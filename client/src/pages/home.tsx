import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import Testimonials from "@/components/sections/testimonials";
import RiskMitigation from "@/components/sections/risk-mitigation";
import ContactForm from "@/components/forms/contact-form";


export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Who We Serve Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Who We Serve</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We partner with 65+ healthcare providers nationwide to deliver comprehensive Medicare care coordination services for 25,000+ patients with chronic conditions. Our dedicated nursing teams integrate seamlessly with your practice to improve outcomes and generate new revenue streams.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-healthcare-primary/20 transition-colors">
                <i className="fas fa-hospital text-healthcare-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Hospitals</h3>
              <p className="text-muted-foreground">Reduce readmissions and improve patient outcomes with comprehensive care coordination.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-healthcare-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-healthcare-secondary/20 transition-colors">
                <i className="fas fa-clinic-medical text-healthcare-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Clinics</h3>
              <p className="text-muted-foreground">Expand your care capabilities with our nurse-led chronic care management programs.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <i className="fas fa-heart text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">FQHCs</h3>
              <p className="text-muted-foreground">Serve underserved populations with culturally competent care coordination services.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <i className="fas fa-user-md text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Private Practice</h3>
              <p className="text-muted-foreground">Enhance patient care while generating additional revenue through CMS-covered services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Care Excellence Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Excellence in Patient Care</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our registered nurses provide compassionate, comprehensive care coordination for Medicare patients in the comfort of their homes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Main Care Image - Optimized loading */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/elderly-patient-care.jpeg"
                alt="Professional nurse providing care coordination to elderly patient"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="font-bold text-foreground mb-1">Care Coordination Excellence</h3>
                  <p className="text-sm text-muted-foreground">Professional nursing care delivering measurable health outcomes for Medicare patients</p>
                </div>
              </div>
            </div>
            
            {/* Care Services Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
                <img
                  src="/images/AdobeStock_133178564_1751485954798.jpeg"
                  alt="Advanced remote patient monitoring devices and technology for chronic care"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground">Remote Patient Monitoring</p>
                    <p className="text-xs text-muted-foreground">FDA-approved devices & 24/7 monitoring</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
                <img
                  src="/images/AdobeStock_400007631_1751485954795.jpeg"
                  alt="Behavioral health integration and mental health support services"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground">Behavioral Health Integration</p>
                    <p className="text-xs text-muted-foreground">Mental health support & screening</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
                <img
                  src="/images/AdobeStock_429992249_1751485954795.jpeg"
                  alt="Professional nurse providing chronic care management services"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground">Chronic Care Management</p>
                    <p className="text-xs text-muted-foreground">Licensed nurses & care coordination</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
                <img
                  src="/images/AdobeStock_226055713_1751485954796.jpeg"
                  alt="Healthcare technology integration and EHR connectivity solutions"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground">EHR Integration</p>
                    <p className="text-xs text-muted-foreground">Seamless workflow integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Our Programs</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive care coordination services designed to improve patient outcomes and provider efficiency.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* CCM Program Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/elderly-patient-care.jpeg"
                  alt="Elderly patient receiving chronic care management from a registered nurse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Chronic Care Management</h3>
              <p className="text-muted-foreground mb-4">
                CMS-covered monthly care coordination for patients with multiple chronic conditions by registered nurses.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  24/7 care team availability
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  $50+ per patient/month
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  20+ minutes monthly
                </li>
              </ul>
              <Link href="/services/ccm" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700 text-sm">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            {/* RPM Program Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/elderly-monitoring.jpeg"
                  alt="Elderly patient using remote patient monitoring device at home"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Remote Patient Monitoring</h3>
              <p className="text-muted-foreground mb-4">
                FDA-approved device monitoring of physiological data like blood pressure, weight, and glucose levels.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  FDA-approved devices
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  $58+ per patient/month
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  16-day data requirement
                </li>
              </ul>
              <Link href="/services/monitoring" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700 text-sm">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            {/* RTM Program Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/AdobeStock_400007631_1751485954795.jpeg"
                  alt="Remote therapeutic monitoring for rehabilitation and therapy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Remote Therapeutic Monitoring</h3>
              <p className="text-muted-foreground mb-4">
                Non-physiological monitoring for therapy adherence, pain levels, and rehabilitation progress.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  Therapy monitoring
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  $78+ per patient/month
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  No prior relationship required
                </li>
              </ul>
              <Link href="/services/rtm" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700 text-sm">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* APCM Program Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/AdobeStock_279901729_1751485954797.jpeg"
                  alt="Advanced primary care management comprehensive coordination"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Advanced Primary Care Management</h3>
              <p className="text-muted-foreground mb-4">
                CMS's newest 2025 program providing comprehensive primary care coordination with reduced administrative burden.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  24/7 access capability
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  $15-$110 per patient/month
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  No time requirements
                </li>
              </ul>
              <Link href="/services/apcm" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700 text-sm">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* BHI Program Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/elderly-behavioral-health.jpeg"
                  alt="Elderly patient receiving behavioral health support and mental health care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Behavioral Health Integration</h3>
              <p className="text-muted-foreground mb-4">
                Compassionate mental health support for seniors with behavioral conditions using evidence-based interventions.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  Depression screening
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  $42+ per patient/month
                </li>
                <li className="flex items-center text-muted-foreground text-sm">
                  <i className="fas fa-check text-healthcare-secondary mr-2"></i>
                  Crisis intervention
                </li>
              </ul>
              <Link href="/services/bhi" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700 text-sm">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Impact Stats */}
      <Stats />

      {/* Proven Results */}
      <Testimonials />

      {/* Risk Mitigation */}
      <RiskMitigation />

      {/* Local Nurses Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                  Local Healthcare Professionals
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Local Nurses Who <span className="text-primary">Understand Your Community</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Unlike call centers with scripted conversations, our local nurses understand your patients' dialects, culture, and community challenges. They build genuine relationships that lead to better engagement and health outcomes.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-heart text-primary text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Authentic Connection</h4>
                    <p className="text-muted-foreground text-sm">Nurses who share your patients' accents, understand local customs, and speak their language—literally and culturally.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-handshake text-secondary text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Trust & Comfort</h4>
                    <p className="text-muted-foreground text-sm">Patients open up to nurses who sound familiar and understand their community, leading to better health reporting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-chart-line text-accent text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Better Outcomes</h4>
                    <p className="text-muted-foreground text-sm">93% of patients report health issues sooner when they feel understood and comfortable with their care team.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Why Local Matters</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Patient Comfort Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-[90%] h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-primary">90%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Health Issue Reporting</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-[93%] h-2 bg-secondary rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-secondary">93%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Program Retention</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-[92%] h-2 bg-accent rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-accent">92%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-muted-foreground italic">
                    "My nurse sounds just like my neighbor. I feel comfortable telling her things I'd never share with someone from a call center." - Patient testimonial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Partner With Us</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to enhance your patient care capabilities? Get in touch with our team to learn how we can help you implement comprehensive care coordination services.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <p className="text-muted-foreground">(601) 859-4342</p>
                      <p className="text-muted-foreground text-sm">Available Monday - Friday, 8 AM - 6 PM CST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-envelope text-secondary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">info@lynkhealthcare.com</p>
                      <p className="text-muted-foreground text-sm">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-accent"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Headquarters</h4>
                      <p className="text-muted-foreground">
                        200 Trace Colony Park Dr, Suite C<br />
                        Ridgeland, MS 39157
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-2xl p-8 text-white">
                <h4 className="text-xl font-bold mb-4">Why Partner With Lynk Health?</h4>
                <ul className="space-y-3 text-white/90">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle mr-3 text-white"></i>
                    Zero upfront costs
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle mr-3 text-white"></i>
                    4-6 week implementation
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle mr-3 text-white"></i>
                    CMS compliant programs
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle mr-3 text-white"></i>
                    Local nurses, no call centers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
