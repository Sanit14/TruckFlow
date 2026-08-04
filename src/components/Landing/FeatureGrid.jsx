import { MapPinLine, GasPump, FileText } from '@phosphor-icons/react';

export default function FeatureGrid() {
  return (
    <div id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass card-hover card-glow rounded-2xl p-5 stagger-1">
        <MapPinLine size={26} weight="duotone" color="#60a5fa" className="mb-3.5" />
        <h3 className="text-white font-semibold text-[15px] mb-1.5">Geofenced stage alerts</h3>
        <p className="text-slate-400 text-[13px] leading-relaxed">
          Incoming, outgoing, loading, unloading, idle, service — fired automatically the moment a truck crosses your radius.
        </p>
      </div>

      <div className="glass card-hover card-glow rounded-2xl p-5 stagger-2">
        <GasPump size={26} weight="duotone" color="#60a5fa" className="mb-3.5" />
        <h3 className="text-white font-semibold text-[15px] mb-1.5">Fuel mileage, calculated</h3>
        <p className="text-slate-400 text-[13px] leading-relaxed">
          Odometer delta ÷ litres filled, logged on every fill-up. No manual entry, no guessed averages.
        </p>
      </div>

      <div className="glass card-hover card-glow rounded-2xl p-5 stagger-3">
        <FileText size={26} weight="duotone" color="#60a5fa" className="mb-3.5" />
        <h3 className="text-white font-semibold text-[15px] mb-1.5">Documents that alert you</h3>
        <p className="text-slate-400 text-[13px] leading-relaxed">
          Insurance, permit, PUC and fitness — TruckFlow counts down and warns you before anything lapses.
        </p>
      </div>
    </div>
  );
}
