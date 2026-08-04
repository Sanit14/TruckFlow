// Mounted once at the router root (outside <Routes>) so it survives page swaps.
export default function PageWipe() {
  return (
    <div
      id="page-wipe"
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #1d4ed8, #ea580c)',
        transform: 'translateY(100%)',
        willChange: 'transform',
      }}
    />
  );
}
