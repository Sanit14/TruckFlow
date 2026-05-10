import { useTrucks } from '../../context/TruckContext';
import { fmtTime } from '../../data/mockData';

export default function DocumentsList() {
  const { trucks } = useTrucks();

  // Aggregate all documents from all trucks
  const allDocuments = trucks.flatMap((truck) => 
    (truck.documents || []).map((doc) => ({
      ...doc,
      truckId: truck.id,
      truckName: truck.name,
      plateNumber: truck.plateNumber,
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allDocuments.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-slate-600 animate-fade-in">
        <p className="text-5xl mb-3">📄</p>
        <p className="text-base font-medium text-slate-500">No documents found</p>
        <p className="text-sm mt-1">Uploaded documents for trucks will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* List of documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDocuments.map((doc) => (
          <div key={doc.id} className="glass rounded-2xl p-4 flex gap-4 hover:bg-white/[0.06] transition-colors">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-indigo-900/30 border border-indigo-700/30 flex items-center justify-center text-2xl shrink-0">
              📄
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-white font-semibold text-sm truncate pr-2">{doc.title}</h4>
              </div>
              
              <div className="text-xs text-slate-400 space-y-1">
                <p className="truncate">Truck: <span className="text-slate-300">{doc.truckName}</span> ({doc.plateNumber})</p>
                <p>Type: <span className="uppercase text-slate-300">{doc.type}</span></p>
                <p>Uploaded: {fmtTime(doc.date)}</p>
              </div>

              {/* View/Download Action - In a real app this would open the file */}
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
    </div>
  );
}
