import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Care Coordination <span className="text-blue-200">That Clicks.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Helping patients stay healthy and independent through Chronic Care Management, In-Home Monitoring, and Behavioral Health Integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
                  Partner With Us
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
          <div className="animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Healthcare professionals providing patient care" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
