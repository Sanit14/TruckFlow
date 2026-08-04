import { useState, useRef } from 'react';
import { MapPinLine, GasPump, FileText, MapTrifold } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import MeshBackground from '../Common/MeshBackground';
import { usePageTransition } from '../../hooks/usePageTransition';

const STEPS = { PHONE: 'PHONE', PIN: 'PIN' };

const FEATURES = [
  { Icon: MapTrifold, title: 'Live fleet map', body: 'Every truck\'s position, refreshed every 10 seconds.' },
  { Icon: MapPinLine, title: 'Geofenced stage alerts', body: 'Incoming, outgoing, loading, unloading, idle, service — set your own radius.' },
  { Icon: GasPump, title: 'Fuel mileage, calculated', body: 'Odometer delta ÷ litres filled, not a guess.' },
  { Icon: FileText, title: 'Document expiry alerts', body: 'Insurance, permit, PUC and fitness, tracked per truck.' },
];

export default function LoginPage() {
  const { sendOTP, verifyOTP } = useAuth();
  const goto = usePageTransition();
  const [step, setStep]      = useState(STEPS.PHONE);
  const [phone, setPhone]    = useState('');
  const [pin, setPin]        = useState(['', '', '', '', '', '']);
  const [error, setError]    = useState('');
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef([]);

  /* ── Step 1: Check if phone is registered ── */
  const handleCheckPhone = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await sendOTP(phone);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    setStep(STEPS.PIN);
  };

  /* ── Step 2: Verify PIN ── */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const code = pin.join('');
    const result = await verifyOTP(phone, code);
    if (!result.ok) { setError(result.error); setLoading(false); }
    // On success, App.jsx will redirect via user state
  };

  /* ── PIN box handlers ── */
  const handlePinChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[i] = val;
    setPin(next);
    if (val && i < 5) pinRefs.current[i + 1]?.focus();
  };
  const handlePinKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) pinRefs.current[i - 1]?.focus();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden bg-[#0b0d14]">
      <MeshBackground />

      {/* Left — feature panel (hidden on small screens) */}
      <div className="hidden lg:flex flex-col justify-center px-14 relative z-10 border-r border-white/8">
        <button onClick={() => goto('/')} className="text-slate-500 hover:text-white text-xs font-semibold mb-10 inline-flex items-center gap-1.5 w-fit transition-colors">
          ← Back to TruckFlow
        </button>
        <h2 className="text-3xl font-extrabold text-white tracking-tight text-balance mb-3 max-w-sm">
          Everything your fleet needs, live.
        </h2>
        <p className="text-slate-400 text-sm mb-10 max-w-sm leading-relaxed">
          Sign in to see your trucks the moment they move — no spreadsheets, no phone calls.
        </p>
        <div className="flex flex-col gap-6 max-w-sm">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/25 flex items-center justify-center shrink-0">
                <Icon size={18} weight="duotone" color="#60a5fa" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{title}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex items-center justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo / Title */}
          <div className="flex flex-col items-center mb-10">
            <button onClick={() => goto('/')} className="lg:hidden text-slate-500 hover:text-white text-xs font-semibold mb-6 self-start transition-colors">
              ← Back to TruckFlow
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/50 mb-4">
              <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">TruckFlow</h1>
            <p className="text-slate-400 text-sm mt-1">Fleet Tracking &amp; Management</p>
          </div>

          {/* Card */}
          <div className="glass rounded-2xl p-8 shadow-2xl">

            {/* ── Step 1: Phone ── */}
            {step === STEPS.PHONE ? (
              <form onSubmit={handleCheckPhone} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Sign In</h2>
                  <p className="text-slate-400 text-sm">Enter your registered mobile number.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="input-field w-16 text-center text-slate-300 shrink-0 cursor-default">+91</span>
                    <input
                      id="phone-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9579115044"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="input-field"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}

                <button id="send-otp-btn" type="submit" disabled={loading || phone.length < 10}
                  className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Checking…' : 'Continue →'}
                </button>
              </form>

            ) : (

              /* ── Step 2: PIN ── */
              <form onSubmit={handleVerify} className="space-y-6 animate-slide-up">
                <div>
                  <button
                    type="button"
                    onClick={() => { setStep(STEPS.PHONE); setError(''); setPin(['', '', '', '', '', '']); }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors"
                  >
                    ← Back
                  </button>
                  <h2 className="text-lg font-semibold text-white mb-1">Enter Your PIN</h2>
                  <p className="text-slate-400 text-sm">+91 {phone}</p>
                </div>

                {/* Info box */}
                <div className="bg-brand-900/30 border border-brand-700/30 rounded-xl px-4 py-3">
                  <p className="text-brand-300 text-sm font-medium">🔐 Enter your 6-digit access PIN</p>
                  <p className="text-slate-500 text-xs mt-1">Contact your administrator if you don't know your PIN.</p>
                </div>

                {/* PIN boxes */}
                <div className="flex gap-3 justify-center">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      id={`pin-box-${i}`}
                      ref={(el) => (pinRefs.current[i] = el)}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      className="w-11 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white
                                 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-brand-500/60 transition-all"
                      style={{ height: '3.25rem' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 text-center">{error}</p>}

                <button id="verify-pin-btn" type="submit" disabled={pin.join('').length < 6 || loading}
                  className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Verifying…' : 'Login →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
