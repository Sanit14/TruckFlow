import { useTrucks } from '../../context/TruckContext';
import { fmtTime } from '../../data/mockData';
import StatusBadge from './StatusBadge';

export default function UploadsList() {
  const { uploads } = useTrucks();

  if (!uploads || uploads.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-slate-600 animate-fade-in">
        <p className="text-5xl mb-3">📷</p>
        <p className="text-base font-medium text-slate-500">No photos uploaded</p>
        <p className="text-sm mt-1">Status photos will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
      {uploads.map((upload) => (
        <div key={upload.id} className="glass rounded-2xl overflow-hidden group">
          {/* Image */}
          <div className="aspect-video bg-black/40 relative">
            <img
              src={upload.photoData}
              alt={`${upload.truckName} status photo`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14]/90 via-transparent to-transparent pointer-events-none" />
            
            {/* Status Badge Positioned on Image */}
            <div className="absolute top-3 right-3">
              <StatusBadge status={upload.status} />
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold text-sm truncate pr-2">{upload.truckName}</h3>
              <span className="text-slate-400 text-[10px] whitespace-nowrap">{fmtTime(upload.date)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold uppercase text-[9px]">
                {upload.uploaderName?.[0] || 'U'}
              </span>
              <span className="truncate">
                Uploaded by {upload.uploaderName || 'User'} ({upload.uploaderRole || 'Manager'})
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
