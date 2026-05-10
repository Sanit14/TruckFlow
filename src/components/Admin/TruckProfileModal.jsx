import { useState } from 'react';
import { useTrucks } from '../../context/TruckContext';
import { fmtTime } from '../../data/mockData';

const DOC_TYPES = ['RC Book', 'Insurance', 'Permit', 'PUC', 'Fitness', 'Other'];

export default function TruckProfileModal({ truckId, onClose }) {
  const { trucks, addDocument, removeDocument } = useTrucks();
  const truck = trucks.find(t => t.id === truckId);

  const [docTitle,   setDocTitle]   = useState('');
  const [docType,    setDocType]    = useState('RC Book');
  const [docFile,    setDocFile]    = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState('');

  if (!truck) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!docTitle.trim() || !docFile) return;
    setUploading(true);
    setUploadErr('');
    const result = await addDocument(truck.id, {
      title: docTitle.trim(),
      type:  docType,
      file:  docFile,
    });
    setUploading(false);
    if (result?.ok === false) {
      setUploadErr(result.error || 'Upload failed. Try again.');
    } else {
      setDocTitle('');
      setDocFile(null);
    }
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
                      <div className="text-2xl text-slate-400">
                        {doc.type === 'Insurance' ? '🛡️' :
                         doc.type === 'RC Book'   ? '📋' :
                         doc.type === 'Permit'    ? '✅' :
                         doc.type === 'PUC'       ? '🌿' : '📄'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{doc.title}</p>
                        <p className="text-xs text-slate-500">
                          {doc.type} · Added {fmtTime(doc.date)}
                        </p>
                        {doc.publicUrl && (
                          <a
                            href={doc.publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-400 hover:text-brand-300 underline mt-0.5 inline-block"
                          >
                            View Document →
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(truck.id, doc.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                      title="Delete Document"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload New Document Form */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-xs text-slate-300 font-semibold uppercase tracking-wide mb-3">Upload New Document</h4>
            <form onSubmit={handleAdd} className="space-y-3">

              {/* Document Name */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Name <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Insurance Policy 2026, RC Book"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* File Picker */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">File <span className="text-rose-400">*</span> <span className="text-slate-600">(PDF or image, max 10MB)</span></label>
                <label className={`flex items-center gap-3 border rounded-lg py-2.5 px-3 cursor-pointer transition-all
                  ${docFile ? 'border-emerald-500/40 bg-emerald-900/20' : 'border-white/10 bg-black/20 hover:border-white/20'}`}>
                  <span className="text-lg">{docFile ? '✅' : '📎'}</span>
                  <span className="text-sm text-slate-300 truncate">
                    {docFile ? docFile.name : 'Choose PDF or image file'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setDocFile(e.target.files[0] || null)}
                    required
                  />
                </label>
              </div>

              {uploadErr && (
                <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  {uploadErr}
                </p>
              )}

              <button
                type="submit"
                disabled={!docTitle.trim() || !docFile || uploading}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-2"
              >
                {uploading ? 'Uploading…' : 'Upload Document'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
