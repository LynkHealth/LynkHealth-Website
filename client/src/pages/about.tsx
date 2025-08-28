import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Leading Chronic Care Management & Remote Patient Monitoring Provider</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Helping healthcare providers deliver exceptional patient outcomes with turnkey CCM and RPM programs. 
              Zero upfront costs, seamless EHR integration, and proven revenue generation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Leading Medicare Care Coordination Nationwide</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Lynk Health, we're the nation's premier provider of Medicare care coordination services, serving healthcare practices across the United States. We provide turnkey chronic care management and remote patient monitoring solutions that create immediate revenue streams while improving patient outcomes. Our dedicated nursing team—never call centers—integrates seamlessly with your practice through direct EHR access.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We operate directly in your EHR with no additional software required. Zero upfront costs, fast 4-6 week implementation, and proven 90%+ patient retention rates across healthcare providers nationwide.
              </p>
              <Link href="/#contact">
                <Button className="bg-healthcare-primary hover:bg-blue-700">
                  Partner With Us
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="/images/AdobeStock_212104037_1751485954798.jpeg"
                alt="Healthcare team collaborating on patient care"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/AdobeStock_279901729_1751485954797.jpeg"
                alt="Professional nurse providing comprehensive remote care coordination services"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We envision a healthcare system where preventive care through better nurse-led engagement becomes the standard of care for all Medicare patients with chronic conditions.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                By leveraging technology, clinical expertise, and compassionate care, we aim to transform how healthcare providers manage chronic diseases, reduce healthcare costs, and improve patient satisfaction nationwide.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-award text-healthcare-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Excellence in Care</h4>
                    <p className="text-muted-foreground text-sm">Delivering the highest quality care coordination services with measurable outcomes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-handshake text-healthcare-secondary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Trusted Partnerships</h4>
                    <p className="text-muted-foreground text-sm">Building long-term relationships with healthcare providers based on trust and results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Proven Results</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our care coordination programs deliver measurable outcomes that benefit patients, providers, and health systems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-3">$2,457</div>
              <div className="text-white/90 font-semibold text-lg mb-2">Annual Cost Reduction</div>
              <div className="text-sm text-white/70">Per patient in total healthcare costs</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-3">45%</div>
              <div className="text-white/90 font-semibold text-lg mb-2">Average Enrollment Rate</div>
              <div className="text-sm text-white/70">Primary care practice participation</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-3">90%+</div>
              <div className="text-white/90 font-semibold text-lg mb-2">Patient Retention</div>
              <div className="text-sm text-white/70">High engagement and satisfaction</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-3">63%</div>
              <div className="text-white/90 font-semibold text-lg mb-2">ED Utilization Reduction</div>
              <div className="text-sm text-white/70">Fewer emergency room visits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Leadership & Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced healthcare professionals and technology experts are dedicated to providing exceptional Medicare care coordination services nationwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Will Moon - CEO */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="/images/will-headshot.jpg"
                  alt="Will Moon, CEO of Lynk Health"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Will Moon</h3>
              <p className="text-healthcare-primary font-medium mb-2">Chief Executive Officer</p>
              <p className="text-muted-foreground text-sm">Leading Lynk Health's mission to transform Medicare care coordination through dedicated nursing teams and seamless technology integration.</p>
            </div>
            
            {/* Clinical Leadership */}
            <div className="text-center">
              <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-user-nurse text-slate-400 text-4xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Clinical Leadership</h3>
              <p className="text-healthcare-secondary font-medium mb-2">Nursing Team</p>
              <p className="text-muted-foreground text-sm">Experienced registered nurses leading our care coordination teams with local community understanding</p>
            </div>
            
            {/* Technology Team */}
            <div className="text-center">
              <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-laptop-code text-slate-400 text-4xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Technology Team</h3>
              <p className="text-healthcare-primary font-medium mb-2">EHR Integration Specialists</p>
              <p className="text-muted-foreground text-sm">Healthcare technology experts ensuring seamless integration and enterprise-grade data security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-healthcare-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              These core values guide everything we do in serving patients and healthcare partners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Compassion</h3>
              <p className="text-blue-100">Every interaction is guided by empathy and understanding for patients and their families.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-blue-100">We maintain the highest ethical standards in all our clinical and business practices.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lightbulb text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-blue-100">Continuously improving our services through technology and evidence-based practices.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Partnership</h3>
              <p className="text-blue-100">Building collaborative relationships that benefit patients, providers, and communities.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
