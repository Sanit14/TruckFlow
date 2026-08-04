import { useState } from 'react';
import MeshBackground from '../Common/MeshBackground';
import { usePageTransition } from '../../hooks/usePageTransition';

export default function SignupPage() {
  const goto = usePageTransition();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0d14]">
      <MeshBackground />
      <div className="relative z-10">
        <nav className="flex items-center justify-between px-4 md:px-6 py-5 max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5 font-bold text-white text-base">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">🚛</span>
            TruckFlow
          </div>
          <button onClick={() => goto('/')} className="btn-ghost text-sm py-2 px-4">Cancel</button>
        </nav>

        {submitted ? (
          <div className="max-w-md mx-auto px-6 py-20 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-2xl mx-auto mb-5 shadow-lg shadow-brand-900/50">🚛</div>
            <h2 className="text-white text-xl font-extrabold">Setting up your fleet…</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-[36ch] mx-auto">
              Account creation isn't wired to a backend yet — OTP verification and real signup land with the
              Supabase backend session. For now, sign in with a demo account instead.
            </p>
            <button onClick={() => goto('/login')} className="btn-ghost text-sm mt-6">← Back to sign in</button>
          </div>
        ) : (
          <div className="max-w-md mx-auto px-4 md:px-6 py-10 animate-fade-in">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-7">
              <h3 className="text-white text-[17px] font-extrabold mb-1">Get early access</h3>
              <p className="text-slate-500 text-xs mb-5">You'll verify with a one-time code, just like signing in.</p>

              <label className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Full name</label>
              <input
                className="input-field mb-4"
                placeholder="Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Company name</label>
              <input
                className="input-field mb-4"
                placeholder="Singh Logistics Pvt. Ltd."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />

              <label className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Phone number</label>
              <div className="flex gap-2 mb-5">
                <span className="input-field w-16 text-center shrink-0 cursor-default">+91</span>
                <input
                  className="input-field"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9579115044"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!name || !company || phone.length < 10}
                className="w-full justify-center bg-accent-600 hover:bg-accent-500 active:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 transition-all duration-200 shadow-lg shadow-accent-900/40"
              >
                Create account &amp; send OTP →
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
