import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// Standard-tier route wipe (ui-ux-pro-max motion.csv, Page Transition / Standard):
// cover -> swap route -> release. Overlay must be mounted outside <Routes> to survive the swap.
export function usePageTransition() {
  const navigate = useNavigate();

  return (to, state) => {
    const overlay = document.getElementById('page-wipe');
    if (!overlay) { navigate(to, { state }); return; }

    // Navigation runs on its own timer rather than inside the GSAP timeline —
    // a backgrounded/throttled tab can stall rAF-driven tweens indefinitely,
    // and real navigation must never hang on an animation frame that may not fire.
    gsap.to(overlay, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' });
    setTimeout(() => {
      navigate(to, { state });
      window.scrollTo(0, 0);
      gsap.to(overlay, {
        yPercent: -100,
        duration: 0.4,
        ease: 'power2.inOut',
        delay: 0.1,
        onComplete: () => gsap.set(overlay, { yPercent: 100 }),
      });
    }, 400);
  };
}
