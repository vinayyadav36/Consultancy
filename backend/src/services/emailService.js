import nodemailer from 'nodemailer';
import axios from 'axios';

// ── EmailJS REST fallback ─────────────────────────────────────────────────────

async function sendViaEmailJS({ name, email, message }) {
  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } = process.env;
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_USER_ID) {
    throw new Error('EmailJS not configured');
  }
  await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_USER_ID,
    template_params: { from_name: name, from_email: email, message },
  });
}

// ── Nodemailer fallback ───────────────────────────────────────────────────────

function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // Fallback to ethereal for testing
  return null;
}

async function sendViaNodemailer({ name, email, message }) {
  const transport = createTransport();
  if (!transport) throw new Error('SMTP not configured');
  await transport.sendMail({
    from: `"${name}" <${email}>`,
    to: process.env.CONTACT_EMAIL || 'contact@shreenadimarketing.com',
    subject: `New Contact Inquiry from ${name}`,
    text: message,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br>')}</p>`,
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function sendContactEmail({ name, email, message }) {
  try {
    await sendViaEmailJS({ name, email, message });
  } catch (emailJsErr) {
    console.warn('EmailJS failed, falling back to Nodemailer:', emailJsErr.message);
    await sendViaNodemailer({ name, email, message });
  }
}

export async function sendOrderConfirmation(order) {
  const transport = createTransport();
  if (!transport) {
    console.warn('SMTP not configured — skipping order confirmation email');
    return;
  }
  await transport.sendMail({
    from: '"Shree Nandi Marketing" <noreply@shreenadimarketing.com>',
    to: order.customerEmail,
    subject: `Order Confirmed – ${order.orderId} 🙏`,
    html: `
      <h2>ॐ नमः शिवाय</h2>
      <p>Dear ${order.customerName},</p>
      <p>Your order <strong>${order.orderId}</strong> has been confirmed.</p>
      <p>Amount paid: <strong>₹${order.amount.toLocaleString('en-IN')}</strong></p>
      <p>Our team will contact you within 24 hours to begin your divine marketing journey.</p>
      <p>Har Har Mahadev 🕉</p>
      <p>— Shree Nandi Marketing Services</p>
    `,
  });
}
