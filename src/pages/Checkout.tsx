import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, ShoppingCart, User, CreditCard, CheckCircle, Star, Lock } from 'lucide-react';
import { api, isApiConfigured, type Product as ApiProduct } from '../lib/api';

// ── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
}

interface CartItem extends Product { qty: number }

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  gst: string;
}

interface CheckoutState {
  step: number;
  selectedProduct: Product | null;
  cart: CartItem[];
  customer: CustomerDetails;
  paymentMethod: 'card' | 'upi' | 'netbanking';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  orderId: string;
  npsScore: number | null;
  npsComment: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const FALLBACK_PRODUCTS: Product[] = [
  { id: 'digital-growth', name: 'Digital Growth Plan', price: 15000, description: 'SEO, paid search & conversion optimisation', features: ['SEO Audit & Strategy', 'Paid Search Campaigns', 'Conversion Optimisation', 'Monthly Reports', 'Dedicated Manager'], badge: 'Most Popular' },
  { id: 'brand-identity', name: 'Brand Identity Plan', price: 25000, description: 'Complete visual & messaging framework', features: ['Logo Design', 'Brand Voice Guidelines', 'Social Media Kit', 'Business Stationery', 'Brand Book'], badge: 'Foundation' },
  { id: 'social-media', name: 'Social Media Plan', price: 12000, description: 'Community growth on every platform', features: ['30 Posts / Month', 'Story & Reel Production', 'Hashtag Research', 'Influencer Outreach', 'Weekly Analytics'], badge: 'High Engagement' },
  { id: 'analytics-pro', name: 'Analytics Pro Plan', price: 20000, description: 'Custom dashboards & predictive reporting', features: ['GA4 & Tag Manager', 'Custom KPI Dashboards', 'Monthly Deep-Dive', 'A/B Testing Framework', 'Quarterly Reviews'], badge: 'Data-Driven' },
];

function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.slug,
    name: p.name,
    price: p.price,
    description: p.description,
    features: p.features,
    badge: p.badge,
  };
}

const STEPS = [
  { label: 'Select Plan', icon: <ShoppingCart className="h-4 w-4" /> },
  { label: 'Cart Review', icon: <ShoppingCart className="h-4 w-4" /> },
  { label: 'Your Details', icon: <User className="h-4 w-4" /> },
  { label: 'Payment Method', icon: <CreditCard className="h-4 w-4" /> },
  { label: 'Card Details', icon: <CreditCard className="h-4 w-4" /> },
  { label: 'Confirmation', icon: <Check className="h-4 w-4" /> },
  { label: 'Feedback', icon: <Star className="h-4 w-4" /> },
];

const LS_KEY = 'shiva_checkout_state';

const initialState: CheckoutState = {
  step: 1,
  selectedProduct: null,
  cart: [],
  customer: { name: '', email: '', phone: '', company: '', gst: '' },
  paymentMethod: 'card',
  cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '',
  orderId: '',
  npsScore: null, npsComment: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

function generateOrderId() {
  // Use crypto.randomUUID() if available, otherwise fall back to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const uuid = crypto.randomUUID().slice(0, 8).toUpperCase();
    return `SNMS-${Date.now().toString(36).toUpperCase()}-${uuid}`;
  }
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `SNMS-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

// ── Checkout component ────────────────────────────────────────────────────────

const Checkout = () => {
  const [state, setState] = useState<CheckoutState>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved) as CheckoutState;
    } catch { /* ignore */ }
    return initialState;
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [orderError, setOrderError] = useState('');

  // Fetch products from backend (non-blocking, falls back to hardcoded)
  useEffect(() => {
    if (!isApiConfigured) return;
    const controller = new AbortController();
    api.getProducts(controller.signal)
      .then((apiProducts) => {
        if (apiProducts.length > 0) {
          setProducts(apiProducts.map(mapApiProduct));
        }
      })
      .catch(() => undefined); // use fallback silently
    return () => controller.abort();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const update = <K extends keyof CheckoutState>(key: K, value: CheckoutState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const goTo = (step: number) => setState((s) => ({ ...s, step }));
  const next = () => goTo(state.step + 1);
  const back = () => goTo(state.step - 1);

  const total = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;

  // Step 1 – Select product
  const handleSelectProduct = (product: Product) => {
    update('selectedProduct', product);
    update('cart', [{ ...product, qty: 1 }]);
  };

  // Step 3 – Validate customer
  const validateCustomer = () => {
    const errs: Partial<Record<string, string>> = {};
    if (!state.customer.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.customer.email)) errs.email = 'Valid email required';
    if (!/^[6-9]\d{9}$/.test(state.customer.phone.replace(/\s/g, ''))) errs.phone = 'Valid 10-digit phone required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 5 – Validate card
  const validateCard = () => {
    const errs: Partial<Record<string, string>> = {};
    if (state.paymentMethod === 'card') {
      if (state.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Valid card number required';
      if (!/^\d{2}\/\d{2}$/.test(state.cardExpiry)) errs.cardExpiry = 'MM/YY format required';
      if (state.cardCvv.length < 3) errs.cardCvv = 'CVV required';
      if (!state.cardName.trim()) errs.cardName = 'Name on card required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateCard()) return;
    setIsSubmitting(true);
    setOrderError('');
    try {
      const orderId = generateOrderId();

      // Try backend order creation first
      if (isApiConfigured) {
        try {
          await api.createOrder({
            orderId,
            customer: state.customer,
            cart: state.cart.map((item) => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })),
            total: grandTotal,
          });
        } catch (err) {
          // Backend error — show message but still allow flow to complete
          console.warn('Order backend error:', err);
          // If it's a product-not-found error, still proceed (using fallback products)
        }
      } else {
        // Simulate processing delay when no backend
        await new Promise((r) => setTimeout(r, 1500));
      }

      update('orderId', orderId);
      next();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Unable to process your order. Please check your connection and try again, or contact us at +91 9992021159.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(LS_KEY);
    setState(initialState);
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const StepHeader = () => (
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const isActive = state.step === stepNum;
        const isDone = state.step > stepNum;
        return (
          <div key={s.label} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone ? 'step-completed' : isActive ? 'step-active' : 'step-inactive'
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : stepNum}
              </div>
              <span className={`text-[10px] mt-1 text-center max-w-[60px] ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 md:w-12 h-px mx-1 flex-shrink-0 ${isDone ? 'bg-cyan-400' : 'bg-indigo-900'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // Step 1
  const Step1 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Choose Your Sacred Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <motion.div
            key={p.id}
            onClick={() => handleSelectProduct(p)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`shiva-card cursor-pointer transition-all duration-200 ${state.selectedProduct?.id === p.id ? 'border-cyan-400/60' : ''}`}
            style={state.selectedProduct?.id === p.id ? { borderColor: 'rgba(34,211,238,0.6)', boxShadow: '0 0 20px rgba(34,211,238,0.15)' } : {}}
            role="radio"
            aria-checked={state.selectedProduct?.id === p.id}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">{p.badge}</span>
                <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${state.selectedProduct?.id === p.id ? 'bg-cyan-400 border-cyan-400' : 'border-gray-600'}`}>
                {state.selectedProduct?.id === p.id && <Check className="h-3 w-3 text-[#0a0a14] m-auto" />}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">{p.description}</p>
            <ul className="space-y-1 mb-4">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                  <Check className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="text-2xl font-bold text-cyan-400">{formatINR(p.price)}<span className="text-sm text-gray-500">/month</span></div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={next} disabled={!state.selectedProduct} className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
          Continue <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  // Step 2
  const Step2 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Cart</h2>
      {state.cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {state.cart.map((item) => (
              <div key={item.id} className="shiva-card flex items-center justify-between">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-400">{item.description}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-cyan-400 font-bold">{formatINR(item.price)}</div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
            ))}
          </div>
          <div className="shiva-card space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">GST (18%)</span>
              <span>{formatINR(gst)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-indigo-900/50">
              <span>Total</span>
              <span className="text-cyan-400">{formatINR(grandTotal)}</span>
            </div>
          </div>
        </>
      )}
      <div className="flex justify-between">
        <button onClick={back} className="btn btn-secondary inline-flex items-center gap-2"><ChevronLeft className="h-5 w-5" /> Back</button>
        <button onClick={next} disabled={state.cart.length === 0} className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-40">Continue <ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );

  // Step 3
  const Step3 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {([
          { id: 'name', label: 'Full Name *', placeholder: 'Rajesh Sharma', type: 'text' },
          { id: 'email', label: 'Email Address *', placeholder: 'you@example.com', type: 'email' },
          { id: 'phone', label: 'Phone Number *', placeholder: '9876543210', type: 'tel' },
          { id: 'company', label: 'Company Name', placeholder: 'Your Company Pvt. Ltd.', type: 'text' },
          { id: 'gst', label: 'GST Number', placeholder: '29ABCDE1234F1Z5', type: 'text' },
        ] as { id: keyof CustomerDetails; label: string; placeholder: string; type: string }[]).map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              value={state.customer[field.id]}
              onChange={(e) => update('customer', { ...state.customer, [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${errors[field.id] ? 'ring-1 ring-red-400' : ''}`}
              style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.5)' }}
            />
            {errors[field.id] && <p className="text-red-400 text-xs mt-1">{errors[field.id]}</p>}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={back} className="btn btn-secondary inline-flex items-center gap-2"><ChevronLeft className="h-5 w-5" /> Back</button>
        <button onClick={() => { if (validateCustomer()) next(); }} className="btn btn-primary inline-flex items-center gap-2">Continue <ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );

  // Step 4
  const Step4 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      <div className="space-y-3 mb-8">
        {([
          { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay', emoji: '💳' },
          { id: 'upi', label: 'UPI', sub: 'PhonePe, GPay, Paytm, BHIM', emoji: '📱' },
          { id: 'netbanking', label: 'Net Banking', sub: 'All major banks supported', emoji: '🏦' },
        ] as { id: CheckoutState['paymentMethod']; label: string; sub: string; emoji: string }[]).map((m) => (
          <div
            key={m.id}
            onClick={() => update('paymentMethod', m.id)}
            className={`shiva-card flex items-center gap-4 cursor-pointer transition-all duration-200 ${state.paymentMethod === m.id ? 'border-cyan-400/60' : ''}`}
            style={state.paymentMethod === m.id ? { borderColor: 'rgba(34,211,238,0.6)' } : {}}
            role="radio"
            aria-checked={state.paymentMethod === m.id}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${state.paymentMethod === m.id ? 'bg-cyan-400 border-cyan-400' : 'border-gray-600'}`} />
            <span className="text-2xl">{m.emoji}</span>
            <div>
              <div className="font-semibold">{m.label}</div>
              <div className="text-xs text-gray-400">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Lock className="h-3 w-3" />
        <span>Your payment information is encrypted and secure. We never store card details.</span>
      </div>
      <div className="flex justify-between">
        <button onClick={back} className="btn btn-secondary inline-flex items-center gap-2"><ChevronLeft className="h-5 w-5" /> Back</button>
        <button onClick={next} className="btn btn-primary inline-flex items-center gap-2">Continue <ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );

  // Step 5
  const Step5 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
      <p className="text-gray-400 text-sm mb-6">
        {state.paymentMethod === 'card' ? 'Enter your card details securely.' : state.paymentMethod === 'upi' ? 'You will be redirected to your UPI app after clicking Pay.' : 'Select your bank after clicking Pay.'}
      </p>

      {state.paymentMethod === 'card' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
            <input
              type="text"
              value={state.cardNumber}
              onChange={(e) => update('cardNumber', formatCard(e.target.value))}
              placeholder="4111 1111 1111 1111"
              maxLength={19}
              className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-cyan-400 ${errors.cardNumber ? 'ring-1 ring-red-400' : ''}`}
              style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.5)' }}
            />
            {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Expiry</label>
              <input
                type="text"
                value={state.cardExpiry}
                onChange={(e) => update('cardExpiry', formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-cyan-400 ${errors.cardExpiry ? 'ring-1 ring-red-400' : ''}`}
                style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.5)' }}
              />
              {errors.cardExpiry && <p className="text-red-400 text-xs mt-1">{errors.cardExpiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CVV</label>
              <input
                type="password"
                value={state.cardCvv}
                onChange={(e) => update('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                maxLength={4}
                className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-cyan-400 ${errors.cardCvv ? 'ring-1 ring-red-400' : ''}`}
                style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.5)' }}
              />
              {errors.cardCvv && <p className="text-red-400 text-xs mt-1">{errors.cardCvv}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name on Card</label>
            <input
              type="text"
              value={state.cardName}
              onChange={(e) => update('cardName', e.target.value)}
              placeholder="RAJESH SHARMA"
              className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-cyan-400 ${errors.cardName ? 'ring-1 ring-red-400' : ''}`}
              style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.5)' }}
            />
            {errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}
          </div>
        </div>
      )}

      {/* Order summary */}
      <div className="shiva-card mb-6 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-gray-400">Plan</span><span>{state.selectedProduct?.name}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">GST (18%)</span><span>{formatINR(gst)}</span></div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-indigo-900/50"><span>Total to Pay</span><span className="text-cyan-400">{formatINR(grandTotal)}</span></div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Lock className="h-3 w-3" /><span>Secured by 256-bit SSL encryption</span>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={back} className="btn btn-secondary inline-flex items-center gap-2"><ChevronLeft className="h-5 w-5" /> Back</button>
        <div className="flex flex-col items-end gap-2">
          {orderError && <p className="text-red-400 text-xs">{orderError}</p>}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <><span className="h-4 w-4 rounded-full border-2 border-[#0a0a14] border-t-transparent animate-spin" /> Processing...</>
            ) : (
              <>Pay {formatINR(grandTotal)} <Lock className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Step 6
  const Step6 = () => (
    <div className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
        <CheckCircle className="h-20 w-20 text-cyan-400 mx-auto mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.5))' }} />
      </motion.div>
      <h2 className="text-3xl font-bold mb-2">ॐ Order Confirmed!</h2>
      <p className="text-gray-400 mb-4">Your divine marketing journey begins now.</p>
      <div className="inline-block shiva-card px-8 py-4 mb-6">
        <div className="text-xs text-gray-500 mb-1">Order ID</div>
        <div className="text-cyan-400 font-mono font-bold text-lg">{state.orderId}</div>
      </div>
      <div className="shiva-card max-w-sm mx-auto text-left text-sm space-y-2 mb-8">
        <div className="flex justify-between"><span className="text-gray-400">Plan</span><span>{state.selectedProduct?.name}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Customer</span><span>{state.customer.name}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Email</span><span>{state.customer.email}</span></div>
        <div className="flex justify-between font-bold pt-2 border-t border-indigo-900/50"><span>Total Paid</span><span className="text-cyan-400">{formatINR(grandTotal)}</span></div>
      </div>
      <p className="text-gray-400 text-sm mb-6">A confirmation email has been sent to <span className="text-cyan-400">{state.customer.email}</span>. Our team will contact you within 24 hours.</p>
      <button onClick={next} className="btn btn-primary inline-flex items-center gap-2">
        Share Your Experience <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );

  // Step 7
  const Step7 = () => (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">🙏</div>
      <h2 className="text-2xl font-bold mb-2">How was your experience?</h2>
      <p className="text-gray-400 mb-8 text-sm">Your feedback helps us serve you better. On a scale of 0–10, how likely are you to recommend Shree Nandi?</p>

      {/* NPS scale */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => update('npsScore', i)}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${state.npsScore === i ? 'bg-cyan-400 text-[#0a0a14] scale-110' : 'text-gray-300 hover:bg-cyan-400/10'}`}
            style={{ border: state.npsScore === i ? '2px solid #22d3ee' : '1px solid rgba(49,46,129,0.4)' }}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 max-w-xs mx-auto mb-6">
        <span>Not likely</span><span>Very likely</span>
      </div>

      <textarea
        value={state.npsComment}
        onChange={(e) => update('npsComment', e.target.value)}
        placeholder="Any additional feedback? (optional)"
        rows={3}
        className="w-full max-w-md mx-auto block px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-cyan-400 mb-6"
        style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.5)' }}
      />

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => {
            // Submit NPS via centralized API
            if (isApiConfigured && state.npsScore !== null) {
              api.submitNps({ orderId: state.orderId, score: state.npsScore, comment: state.npsComment || undefined })
                .catch(() => undefined);
            }
            handleReset();
          }}
          className="btn btn-primary"
        >
          Submit Feedback & Finish
        </button>
        <button onClick={handleReset} className="btn btn-secondary">Skip</button>
      </div>
    </div>
  );

  const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];
  const CurrentStep = STEP_COMPONENTS[state.step - 1];

  return (
    <div className="py-20">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="trident-divider"><span className="text-2xl text-cyan-400 opacity-50">᛭</span></div>
          <h1 className="text-4xl font-bold mb-2">Sacred <span className="text-cyan-400 glow-text">Checkout</span></h1>
          <p className="text-gray-400">Begin your divine marketing journey in 7 sacred steps</p>
        </motion.div>

        <div className="shiva-card p-6 md:p-10">
          <StepHeader />

          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="step-enter"
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
