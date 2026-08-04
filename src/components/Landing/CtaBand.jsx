import { usePageTransition } from '../../hooks/usePageTransition';

export default function CtaBand() {
  const goto = usePageTransition();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
      <div
        className="rounded-2xl border border-white/10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,.16), rgba(234,88,12,.1))' }}
      >
        <div>
          <h3 className="text-white font-extrabold text-xl tracking-tight mb-1">See your own fleet on this screen.</h3>
          <p className="text-slate-400 text-sm">15-minute setup call, no card required for the trial.</p>
        </div>
        <button
          onClick={() => goto('/trial')}
          className="bg-accent-600 hover:bg-accent-500 active:bg-accent-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 shadow-lg shadow-accent-900/40 whitespace-nowrap"
        >
          Start free trial →
        </button>
      </div>
    </div>
  );
}
