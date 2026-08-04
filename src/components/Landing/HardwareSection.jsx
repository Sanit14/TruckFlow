const SPECS = ['GPS + 4G', 'Fuel level sensor', 'Plug-and-play install', '10s refresh'];

const PROBLEMS = [
  { q: '"Where\'s my truck right now?"', a: 'Live GPS position, refreshed every 10 seconds — for one truck or fifty.' },
  { q: '"What is this trip actually costing me?"', a: 'Fuel mileage calculated from the sensor, not a driver\'s estimate.' },
  { q: '"Did anyone renew the insurance?"', a: 'Every document tracked with its own expiry countdown.' },
];

export default function HardwareSection() {
  return (
    <div id="how-it-works-hardware" className="max-w-6xl mx-auto px-4 md:px-6 py-14 border-t border-white/8">
      <div className="max-w-xl mx-auto text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">
          <span className="w-4 h-px bg-brand-400" />How it works
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight text-balance mb-2.5">
          One device. Every truck. The whole picture.
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          A single unit combines a GPS tracker and a fuel-level sensor. It reports continuously, so your
          data stays live and accurate whether you're running one truck or fifty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[.9fr_1.1fr] gap-8 items-center">
        {/* Device visual */}
        <div className="relative aspect-[4/3] rounded-2xl border border-white/10 flex items-center justify-center" style={{ background: 'linear-gradient(160deg,#141a2c,#0a0e1a)' }}>
          <div className="relative w-[58%] aspect-[1.9/1] rounded-xl border border-white/15" style={{ background: 'linear-gradient(145deg,#1e2540,#0e1220)', boxShadow: '0 20px 50px -20px rgba(0,0,0,.6)' }}>
            <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" style={{ boxShadow: '0 0 8px 2px rgba(52,211,153,.6)' }} />
            <span className="absolute -top-3.5 right-4 w-0.5 h-4 bg-white/25" />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {SPECS.map((s) => (
              <span key={s} className="text-[11px] font-bold text-brand-300 bg-brand-500/10 border border-brand-500/25 px-2.5 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            {PROBLEMS.map((p) => (
              <div key={p.q} className="flex gap-3 items-start">
                <span className="text-emerald-400 font-bold text-sm shrink-0 mt-0.5">✓</span>
                <div>
                  <p className="text-white text-[13.5px] font-semibold italic leading-snug">{p.q}</p>
                  <p className="text-slate-400 text-[12.5px] leading-relaxed mt-0.5">{p.a}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-[11px] italic mt-5">
            The hardware is in development — try the software now with sample data, or bring your own compatible GPS/fuel device.
          </p>
        </div>
      </div>
    </div>
  );
}
