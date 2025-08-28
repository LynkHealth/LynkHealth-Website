import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import elderlyHeroImage from "@assets/elderly-hero-image.jpeg";
import elderlyMonitoring from "@assets/elderly-monitoring.jpeg";

export default function Hero() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="max-w-xl">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-4">
                Professional Healthcare Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Chronic Care Management & Remote Patient Monitoring{" "}
              <span className="text-primary">That Actually Works</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Turnkey Medicare care management programs with local, dedicated nurses who understand your patients' communities. 
              No call centers—just genuine relationships that generate $100+ revenue per patient monthly while achieving 90%+ retention rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/#contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Start Partnership
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                CMS Compliant
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Local Licensed Nurses
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Medicare Approved
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/AdobeStock_616281927_1751485954823.jpeg"
                alt="Professional healthcare team providing comprehensive chronic care management services"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Overlay Stats */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-primary mb-1">93%</div>
                    <div className="text-sm text-muted-foreground">Report Health Issues Sooner</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-secondary mb-1">86%</div>
                    <div className="text-sm text-muted-foreground">Better Med Adherence</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Care Results Showcase */}
            <div className="mt-6 relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="/images/AdobeStock_419808796_1751485954770.jpeg"
                alt="Healthcare professional providing remote patient monitoring and care coordination"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm font-semibold text-foreground">Proven Patient Outcomes</div>
                  <div className="text-xs text-muted-foreground">Real results from our care coordination programs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
