import MeshBackground from '../Common/MeshBackground';
import LandingNav from './LandingNav';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import FeatureGrid from './FeatureGrid';
import HardwareSection from './HardwareSection';
import FaqSection from './FaqSection';
import CtaBand from './CtaBand';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0d14]">
      <MeshBackground />
      <div className="relative z-10">
        <LandingNav />
        <Hero />
        <HowItWorks />
        <FeatureGrid />
        <HardwareSection />
        <FaqSection />
        <CtaBand />
        <footer className="text-center text-slate-600 text-xs py-8 border-t border-white/6">
          TruckFlow — live fleet tracking for Indian logistics operators.
        </footer>
      </div>
    </div>
  );
}
