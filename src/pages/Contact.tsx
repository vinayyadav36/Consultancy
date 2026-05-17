import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { api, type InquiryPayload, type Service, type StrategyRecommendationResponse } from '../lib/api';

const initialForm: InquiryPayload = {
  name: '',
  email: '',
  phone: '',
  business_name: '',
  business_stage: 'idea',
  services_interested: [],
  goals: [],
  monthly_budget_inr: null,
  source_channel: 'website',
  preferred_contact_time: 'Anytime',
  message: '',
};

const growthGoals = [
  'Increase qualified leads',
  'Improve brand positioning',
  'Launch on marketplaces',
  'Automate repetitive tasks',
  'Compliance readiness (GST/FSSAI)',
];

const Contact = () => {
  const [form, setForm] = useState<InquiryPayload>(initialForm);
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<StrategyRecommendationResponse | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    void api.getServices().then(setServices).catch(() => undefined);
  }, []);

  const serviceOptions = useMemo(() => services.map((s) => s.name), [services]);

  const toggleService = (name: string) => {
    setForm((prev) => ({
      ...prev,
      services_interested: prev.services_interested.includes(name)
        ? prev.services_interested.filter((item) => item !== name)
        : [...prev.services_interested, name],
    }));
  };

  const toggleGoal = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((item) => item !== goal)
        : [...prev.goals, goal],
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\+?\d{10,15}$/.test(form.phone.replace(/[\s-]/g, ''))) errs.phone = 'Invalid phone number';
    if (!form.business_name.trim()) errs.business_name = 'Business name is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      await api.createInquiry(form);
      setStatus('success');
      setForm(initialForm);
      setErrors({});
      setStep(1);
    } catch {
      setStatus('error');
    }
  };

  const runRecommendation = async () => {
    try {
      const result = await api.strategyRecommend({
        business_stage: form.business_stage,
        goals: form.goals,
        monthly_budget_inr: form.monthly_budget_inr,
        services_interested: form.services_interested,
      });
      setRecommendation(result);
    } catch {
      setRecommendation(null);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border ${errors[field] ? 'border-red-500/50' : 'border-white/10'} bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all duration-200 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20`;

  if (status === 'success') {
    return (
      <div className="container py-16 md:py-24">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg mx-auto p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Application received</h2>
          <p className="mt-3 text-sm text-slate-400">Your strategy brief application is in review. Our team will respond within 24 hours.</p>
          <button onClick={() => setStatus('idle')} className="mt-6 btn btn-secondary">Submit another</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="container pt-16 pb-12 md:pt-24 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs text-cyan-300 mb-6">Strategy Brief Application</div>
            <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">Apply for a <span className="glow-text">private growth mandate</span></h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl">This curated intake helps us qualify fit, urgency, and execution path in advance.</p>
          </motion.div>
        </div>
      </section>

      <section className="container pb-16 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Concierge</h3>
              <div className="space-y-4">
                <a href="https://wa.me/918930609914" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-300 transition-colors group">
                  <span className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors"><MessageCircle className="w-5 h-5 text-emerald-400" /></span>
                  <div><p className="font-medium">WhatsApp</p><p className="text-slate-500">+91 8930609914</p></div>
                </a>
                <a href="tel:+918930609914" className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-300 transition-colors group">
                  <span className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors"><Phone className="w-5 h-5 text-cyan-400" /></span>
                  <div><p className="font-medium">Phone</p><p className="text-slate-500">+91 8930609914</p></div>
                </a>
                <a href="mailto:contact@shrinandimarketing.com" className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-300 transition-colors group">
                  <span className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors"><Mail className="w-5 h-5 text-violet-400" /></span>
                  <div><p className="font-medium">Email</p><p className="text-slate-500">contact@shrinandimarketing.com</p></div>
                </a>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-slate-400" /></span>
                  <div><p className="font-medium">Location</p><p className="text-slate-500">Rewari, Haryana</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Qualification Flow</h2>
              <p className="mt-1 text-sm text-slate-400">Step {step} of 3 · selective intake for premium projects</p>
              <div className="mt-4 flex gap-2">{[1, 2, 3].map((s) => <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-cyan-400' : 'bg-white/10'}`} />)}</div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input className={inputClass('name')} placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      <input className={inputClass('email')} type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input className={inputClass('phone')} placeholder="WhatsApp number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      <input className={inputClass('business_name')} placeholder="Business name *" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <select className={inputClass('source_channel')} value={form.source_channel} onChange={(e) => setForm({ ...form, source_channel: e.target.value as InquiryPayload['source_channel'] })}>
                        <option value="website">Source: Website</option><option value="whatsapp">Source: WhatsApp</option><option value="referral">Source: Referral</option><option value="other">Source: Other</option>
                      </select>
                      <select className={inputClass('preferred_contact_time')} value={form.preferred_contact_time} onChange={(e) => setForm({ ...form, preferred_contact_time: e.target.value })}>
                        <option value="Anytime">Preferred contact: Anytime</option><option value="Morning">Preferred contact: Morning</option><option value="Afternoon">Preferred contact: Afternoon</option><option value="Evening">Preferred contact: Evening</option>
                      </select>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <select className={inputClass('business_stage')} value={form.business_stage} onChange={(e) => setForm({ ...form, business_stage: e.target.value as InquiryPayload['business_stage'] })}>
                      <option value="idea">Idea stage</option><option value="early">Early traction</option><option value="growing">Growing</option><option value="established">Established</option>
                    </select>
                    <input className={inputClass('monthly_budget_inr')} type="number" min={0} placeholder="Monthly budget in INR (optional)" value={form.monthly_budget_inr ?? ''} onChange={(e) => setForm({ ...form, monthly_budget_inr: e.target.value ? Number(e.target.value) : null })} />
                    <div>
                      <p className="text-sm text-slate-300 mb-2">Primary growth goals</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {growthGoals.map((goal) => (
                          <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={`text-left px-3 py-2.5 rounded-xl text-sm border ${form.goals.includes(goal) ? 'bg-violet-400/10 border-violet-400/30 text-violet-200' : 'bg-white/5 border-white/10 text-slate-300'}`}>{goal}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <p className="text-sm text-slate-300 mb-2">Service intent</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {serviceOptions.map((service) => (
                          <button key={service} type="button" onClick={() => toggleService(service)} className={`text-left px-3 py-2.5 rounded-xl text-sm border ${form.services_interested.includes(service) ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-300'}`}>{service}</button>
                        ))}
                      </div>
                    </div>
                    <textarea className={`${inputClass('message')} min-h-32 resize-y`} placeholder="Describe goals, urgency, and desired transformation *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    <button type="button" className="btn btn-violet w-full gap-2" onClick={() => void runRecommendation()}><Sparkles className="w-4 h-4" />Get instant strategy recommendation</button>
                    {recommendation && (
                      <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-4">
                        <p className="text-xs uppercase tracking-wider text-violet-300">AI Strategy Snapshot</p>
                        <p className="mt-2 text-sm text-slate-300">Readiness {recommendation.readiness_score}/100 · Plan {recommendation.plan_tier.replace('_', ' ')}</p>
                      </div>
                    )}
                  </>
                )}

                {(errors.name || errors.email || errors.phone || errors.business_name || errors.message) && <p className="text-xs text-red-400">Please fill required fields correctly.</p>}
                <div className="flex gap-3">
                  {step > 1 && <button type="button" className="btn btn-secondary flex-1" onClick={() => setStep((v) => Math.max(1, v - 1))}>Back</button>}
                  {step < 3 ? <button type="button" className="btn btn-primary flex-1" onClick={() => setStep((v) => Math.min(3, v + 1))}>Continue</button> : <button className="btn btn-primary flex-1 gap-2" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Submitting...' : <><Send className="w-4 h-4" />Apply for strategy brief</>}</button>}
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />Submission failed. Please WhatsApp us at 8930609914.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
