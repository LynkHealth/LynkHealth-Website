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
              Nurse-Led Care Coordination{" "}
              <span className="text-primary">for Medicare Patients</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              White-labeled healthcare services that help your practice deliver comprehensive care coordination, 
              monitoring, and behavioral health support while maximizing reimbursement opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/contact">
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
                Licensed Nurses
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
                src="https://lynk.health/wp-content/uploads/2023/09/AdobeStock_610198709-scaled.jpeg"
                alt="Healthcare professional providing care to elderly patient at home"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Overlay Stats */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-primary mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-secondary mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Care Support</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video Placeholder */}
            <div className="mt-6 relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://lynk.health/wp-content/uploads/2022/12/AdobeStock_39976543-1024x683.jpeg"
                alt="Elderly patient using remote monitoring device at home"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-semibold text-foreground">See Our Care in Action</div>
                  <div className="text-xs text-muted-foreground">Real patients, real results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
