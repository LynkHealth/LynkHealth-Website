import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import Testimonials from "@/components/sections/testimonials";
import elderlyBehavioralHealth from "@assets/elderly-behavioral-health.jpeg";

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
              We partner with healthcare providers to deliver comprehensive care coordination services for Medicare patients with chronic conditions.
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
              <div className="w-16 h-16 bg-healthcare-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-healthcare-accent/20 transition-colors">
                <i className="fas fa-heart text-healthcare-accent text-2xl"></i>
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

      {/* Video Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">See Our Care in Action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Watch how our registered nurses provide compassionate, comprehensive care coordination for Medicare patients in the comfort of their homes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Main Video */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
                alt="Nurse providing care to elderly patient at home"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                  <svg className="w-10 h-10 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="font-bold text-foreground mb-1">Chronic Care Management in Action</h3>
                  <p className="text-sm text-muted-foreground">Real patients sharing their experience with our care coordination services</p>
                </div>
              </div>
            </div>
            
            {/* Video Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Remote monitoring devices in elderly patient home"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 rounded-lg p-2">
                    <p className="text-xs font-semibold">Remote Monitoring</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Healthcare professional conducting behavioral health session"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 rounded-lg p-2">
                    <p className="text-xs font-semibold">Behavioral Health</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Nurse reviewing care plan with elderly patient"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 rounded-lg p-2">
                    <p className="text-xs font-semibold">Care Planning</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Family caregiver with elderly patient using telehealth"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 rounded-lg p-2">
                    <p className="text-xs font-semibold">Family Support</p>
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
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* CCM Program Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-stethoscope text-healthcare-primary text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Chronic Care Management</h3>
              <p className="text-muted-foreground mb-6">
                CMS-covered monthly care coordination for patients with multiple chronic conditions. Our registered nurses provide comprehensive health monitoring and care plan management.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  24/7 care team availability
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Monthly care plan updates
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Medication management
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Provider communication
                </li>
              </ul>
              <Link href="/services/ccm" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            {/* In-Home Monitoring Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-home text-healthcare-secondary text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">In-Home Patient Monitoring</h3>
              <p className="text-muted-foreground mb-6">
                Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that enable continuous health tracking from the comfort of home.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  FDA-approved devices
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Real-time data transmission
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Alert management
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Patient education
                </li>
              </ul>
              <Link href="/services/monitoring" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            {/* BHI Program Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-full h-32 mb-6 rounded-lg overflow-hidden">
                <img 
                  src="https://lynk.health/wp-content/uploads/2022/12/AdobeStock_483359255-scaled.jpeg"
                  alt="Elderly patient in comfortable conversation with healthcare provider in bright, welcoming setting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Behavioral Health Integration</h3>
              <p className="text-muted-foreground mb-6">
                Compassionate mental health support for seniors with behavioral conditions, using a low-stigma approach to improve engagement and outcomes.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Depression screening
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Medication adherence
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Crisis intervention
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Care team coordination
                </li>
              </ul>
              <Link href="/services/bhi" className="inline-flex items-center text-healthcare-primary font-semibold hover:text-blue-700">
                Learn More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Impact Stats */}
      <Stats />

      {/* Testimonials */}
      <Testimonials />

      {/* Partner Logos Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Trusted by Healthcare Leaders</h2>
            <p className="text-muted-foreground">We partner with leading healthcare organizations across the country</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-center h-16 bg-white rounded-lg shadow-sm p-4">
                <div className="text-slate-400 font-bold text-sm">PARTNER LOGO</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
