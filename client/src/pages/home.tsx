import Hero from "@/components/sections/hero";
import ServicesSection from "@/components/sections/services";
import StatsSection from "@/components/sections/stats";
import TestimonialsSection from "@/components/sections/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Hospital, Users, Heart, Building2 } from "lucide-react";

export default function Home() {
  const audiences = [
    {
      icon: <Hospital className="h-12 w-12" />,
      title: "Hospitals",
      description: "Reduce readmissions and improve patient outcomes with comprehensive care coordination."
    },
    {
      icon: <Building2 className="h-12 w-12" />,
      title: "Clinics", 
      description: "Expand your care capabilities with our nurse-led chronic care management programs."
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "FQHCs",
      description: "Serve underserved populations with culturally competent care coordination services."
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Private Practice",
      description: "Enhance patient care while generating additional revenue through CMS-covered services."
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Who We Serve Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Who We Serve</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We partner with healthcare providers to deliver exceptional care coordination services for Medicare patients with chronic conditions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audiences.map((audience, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-none bg-slate-50">
                <CardContent className="p-8">
                  <div className="text-blue-600 mb-6 flex justify-center group-hover:scale-110 transition-transform">
                    {audience.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{audience.title}</h3>
                  <p className="text-slate-600">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />

      {/* Partner Logos Section */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Trusted by Healthcare Leaders</h2>
            <p className="text-slate-600">We partner with leading healthcare organizations across the country</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center justify-center h-16 bg-white rounded-lg shadow-sm p-4">
                <div className="text-slate-400 font-bold text-sm">PARTNER LOGO</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our streamlined 3-step process makes it easy to get started with care coordination services.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Identify Patients</h3>
              <p className="text-slate-600 mb-6">
                We help you identify Medicare patients with multiple chronic conditions who qualify for care coordination services.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">
                  <i className="fas fa-clock mr-2"></i>
                  Timeline: 1-2 weeks
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Engage Patients</h3>
              <p className="text-slate-600 mb-6">
                Our registered nurses begin comprehensive care coordination, including health assessments, care plan development, and ongoing monitoring.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">
                  <i className="fas fa-clock mr-2"></i>
                  Timeline: Ongoing monthly
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Bill & Report</h3>
              <p className="text-slate-600 mb-6">
                We handle all CMS billing and provide detailed reporting on patient outcomes and program performance.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">
                  <i className="fas fa-clock mr-2"></i>
                  Timeline: Monthly reporting
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join healthcare providers across the country who are improving patient outcomes and generating additional revenue with our care coordination services.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                  Schedule a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
