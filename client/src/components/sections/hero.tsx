import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Care Coordination{" "}
              <span className="text-healthcare-primary">That Clicks.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Helping patients stay healthy and independent through{" "}
              <span className="font-semibold text-healthcare-secondary">Chronic Care Management</span>,{" "}
              <span className="font-semibold text-healthcare-secondary">In-Home Monitoring</span>, and{" "}
              <span className="font-semibold text-healthcare-secondary">Behavioral Health Integration</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-healthcare-accent hover:bg-red-700 text-white">
                  Partner With Us
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-healthcare-primary text-healthcare-primary hover:bg-healthcare-primary hover:text-white">
                  Learn How It Works
                </Button>
              </Link>
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
