import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Desktop Background */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-desktop.png')" }}
      />

      {/* Mobile Background */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-top"
        style={{ backgroundImage: "url('/bg-mobile.png')" }}
      />

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-green-50/30 to-green-100/40" />

      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
      </div>
    </main>
  )
}
