/**
 * Floating animated colour orbs that create a premium "mesh gradient" effect.
 * Renders as a fixed full-screen layer behind everything (z-0).
 */
export default function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Orb 1 — top-left tracking blue */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full
        bg-brand-700/20 blur-[120px] animate-orb-1" />
      {/* Orb 2 — bottom-right delivery orange */}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full
        bg-accent-700/20 blur-[120px] animate-orb-2" />
      {/* Orb 3 — center-right teal accent */}
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full
        bg-cyan-800/10 blur-[100px] animate-orb-3" />
    </div>
  );
}
