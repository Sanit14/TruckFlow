import { useState } from 'react';

const FAQS = [
  {
    q: 'Is the hardware available yet?',
    a: "It's in development. You can try the software today with sample data, or bring your own compatible GPS/fuel device once you're on a real fleet.",
  },
  {
    q: 'What happens after the free trial?',
    a: "You can keep exploring with sample data. Paid plans aren't live yet — trial users get first access when they are.",
  },
  {
    q: "Is my fleet's data private?",
    a: 'Yes — every account is fully isolated. Nothing is pooled or shared across customers.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <div id="faq" className="max-w-2xl mx-auto px-4 md:px-6 py-14 border-t border-white/8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-center mb-8">
        Questions, answered
      </h2>
      <div className="flex flex-col">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-white/8">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left py-[18px] flex justify-between items-center gap-4 text-white font-bold text-sm"
              >
                {item.q}
                <span className={`text-brand-400 text-lg shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-[13px] leading-relaxed pb-[18px]">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
