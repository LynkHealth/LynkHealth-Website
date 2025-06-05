import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
            <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 backdrop-blur-sm border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-8">
                {/* Metric Cards */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Care Support</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-accent mb-2">CMS</div>
                  <div className="text-sm text-muted-foreground">Compliant</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-2">RN</div>
                  <div className="text-sm text-muted-foreground">Led Care</div>
                </div>
              </div>
              
              {/* Central Healthcare Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
