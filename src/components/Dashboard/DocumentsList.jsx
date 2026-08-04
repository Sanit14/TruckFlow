import { useTrucks } from '../../context/TruckContext';
import { fmtTime } from '../../data/mockData';

function expiryInfo(dateStr) {
  if (!dateStr) return null;
  const days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (days < 0) return { label: `Expired ${Math.abs(days)}d ago`, tone: 'crit' };
  if (days <= 7) return { label: `${days}d left`, tone: 'crit' };
  if (days <= 30) return { label: `${days}d left`, tone: 'warn' };
  return { label: `${days}d left`, tone: 'ok' };
}

const TONE_CLASS = {
  crit: 'text-rose-300 border-rose-700/40 bg-rose-900/30',
  warn: 'text-amber-300 border-amber-700/40 bg-amber-900/30',
  ok: 'text-emerald-300 border-emerald-700/40 bg-emerald-900/30',
};

export default function DocumentsList() {
  const { trucks } = useTrucks();

  // Insurance expiry is tracked per-truck — surface it as a watchlist above the document library
  const expiryWatch = trucks
    .filter((t) => t.insuranceExpiry)
    .map((t) => ({ truck: t, info: expiryInfo(t.insuranceExpiry) }))
    .filter((x) => x.info.tone !== 'ok')
    .sort((a, b) => new Date(a.truck.insuranceExpiry) - new Date(b.truck.insuranceExpiry));

  // Aggregate all uploaded documents from all trucks
  const allDocuments = trucks.flatMap((truck) =>
    (truck.documents || []).map((doc) => ({
      ...doc,
      truckId: truck.id,
      truckName: truck.name,
      plateNumber: truck.plateNumber,
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Expiry watchlist */}
      {expiryWatch.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">🛡️ Insurance expiring soon</h3>
          <div className="space-y-2">
            {expiryWatch.map(({ truck, info }) => (
              <div key={truck.id} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5">
                <div>
                  <p className="text-white text-sm font-medium">{truck.name}</p>
                  <p className="text-slate-500 text-xs">{truck.plateNumber} · expires {truck.insuranceExpiry}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TONE_CLASS[info.tone]}`}>
                  {info.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded documents */}
      {allDocuments.length === 0 ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-slate-600">
          <p className="text-5xl mb-3">📄</p>
          <p className="text-base font-medium text-slate-500">No documents uploaded yet</p>
          <p className="text-sm mt-1">Open a truck's profile to add insurance, permit, PUC or fitness documents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDocuments.map((doc) => (
            <div key={doc.id} className="glass rounded-2xl p-4 flex gap-4 hover:bg-white/[0.06] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-900/30 border border-brand-700/30 flex items-center justify-center text-2xl shrink-0">
                📄
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm truncate pr-2 mb-1">{doc.title}</h4>
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="truncate">Truck: <span className="text-slate-300">{doc.truckName}</span> ({doc.plateNumber})</p>
                  <p>Type: <span className="uppercase text-slate-300">{doc.type}</span></p>
                  <p>Uploaded: {fmtTime(doc.date)}</p>
                </div>
                <a
                  href={doc.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors inline-block"
                >
                  View Document →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
