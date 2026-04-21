import { useState } from 'react';
import { useTrucks } from '../../context/TruckContext';
import { fmtTime } from '../../data/mockData';

export default function TruckProfileModal({ truckId, onClose }) {
  const { trucks, addDocument, removeDocument } = useTrucks();
  const truck = trucks.find(t => t.id === truckId);

  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');

  if (!truck) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!docName.trim()) return;
    addDocument(truck.id, { name: docName, url: docUrl });
    setDocName('');
    setDocUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-2xl p-6 w-full max-w-xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div>
            <h3 className="text-white font-bold text-lg">📄 Truck Documents</h3>
            <p className="text-slate-400 text-xs mt-0.5">{truck.name} · {truck.plateNumber}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all flex items-center justify-center text-lg">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          {/* Document List */}
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Saved Documents</h4>
            {!truck.documents || truck.documents.length === 0 ? (
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 text-center text-slate-500 text-sm">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {truck.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl text-slate-400">📝</div>
                      <div>
                        <p className="text-sm font-medium text-white">{doc.name}</p>
                        <p className="text-xs text-slate-500">Added {fmtTime(doc.date)}</p>
                        {doc.url && <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:text-brand-300 underline mt-0.5 inline-block">View Link</a>}
                      </div>
                    </div>
                    <button onClick={() => removeDocument(truck.id, doc.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors" title="Delete Document">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Document Form */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-xs text-slate-300 font-semibold uppercase tracking-wide mb-3">Upload New Document</h4>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Name <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Insurance Policy, RC Book"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <button type="submit" disabled={!docName.trim()} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-2">
                Add Document
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
