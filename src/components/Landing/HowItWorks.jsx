const STEPS = [
  { n: '01', title: 'Fit the tracker', body: 'A GPS + fuel-sensor unit reports position and tank level from every truck, continuously.' },
  { n: '02', title: 'Set your geofence', body: 'Draw a radius around any yard or depot — crossing it fires Incoming/Outgoing automatically.' },
  { n: '03', title: 'Watch it reconcile', body: 'Mileage, cost and document expiry calculate themselves. You read reports, not raw logs.' },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="max-w-6xl mx-auto px-4 md:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
      {STEPS.map((s, i) => (
        <div key={s.n} className={`stagger-${i + 1}`}>
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-brand-300 font-bold text-sm flex items-center justify-center mb-4 font-mono">
            {s.n}
          </div>
          <h3 className="text-white font-semibold text-base mb-1.5">{s.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
