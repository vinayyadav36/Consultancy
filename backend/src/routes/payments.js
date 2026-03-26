import express from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js';
import { sendOrderConfirmation } from '../services/emailService.js';

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

// ── Create Payment Intent ─────────────────────────────────────────────────────

router.post('/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment service not configured' });
  }
  const { amount, currency = 'inr', productSlug, customerEmail, orderId } = req.body;
  if (!amount || !orderId) {
    return res.status(400).json({ error: 'amount and orderId are required' });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to paise
      currency,
      metadata: { productSlug: productSlug || '', customerEmail: customerEmail || '', orderId },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('stripe create-intent error:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// ── Stripe Webhook ────────────────────────────────────────────────────────────
// Use raw body for webhook verification

router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: 'Payment service not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const intent = event.data.object;
          const { orderId } = intent.metadata;
          if (orderId) {
            try {
              await prisma.order.update({
                where: { orderId },
                data: { status: 'paid', stripeId: intent.id },
              });
              // Send confirmation email
              const order = await prisma.order.findUnique({ where: { orderId } });
              if (order) {
                await sendOrderConfirmation(order).catch((emailErr) => {
                  console.error('Order confirmation email failed:', emailErr.message);
                });
              }
            } catch (updateErr) {
              console.error('Failed to update order status to paid:', updateErr);
              // Re-throw so Stripe retries the webhook
              throw updateErr;
            }
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const intent = event.data.object;
          const { orderId } = intent.metadata;
          if (orderId) {
            try {
              await prisma.order.update({
                where: { orderId },
                data: { status: 'failed' },
              });
            } catch (updateErr) {
              console.error('Failed to update order status to failed:', updateErr);
              throw updateErr;
            }
          }
          break;
        }
        default:
          // Unhandled event type
          break;
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Webhook handler error:', err);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

export default router;
