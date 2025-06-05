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

          {/* Hero Image */}
          <div className="animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Healthcare professional providing care coordination services to elderly patient"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
