import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Lynk Health - Care Coordination That Clicks | Medicare Care Management"
        description="Professional nurse-led care coordination services for Medicare patients. Chronic Care Management, In-Home Monitoring, and Behavioral Health Integration."
        keywords="Medicare care coordination, chronic care management, remote patient monitoring, behavioral health integration, healthcare services"
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                  Care Coordination That <span className="text-blue-200">Clicks.</span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                  Helping patients stay healthy and independent through Chronic Care Management, In-Home Monitoring, and Behavioral Health Integration.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors text-center">
                    Partner With Us
                  </Link>
                  <Link href="/how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors text-center">
                    Learn How It Works
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" alt="Healthcare professionals providing patient care" className="rounded-2xl shadow-2xl" />
                
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-secondary">2,500+</div>
                  <div className="text-sm text-slate-600">Patients Served</div>
                </div>
                <div className="absolute -top-4 -right-4 bg-secondary text-white p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Who We Serve</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We partner with healthcare providers to deliver exceptional care coordination services for Medicare patients with chronic conditions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <i className="fas fa-hospital text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Hospitals</h3>
                <p className="text-slate-600">Reduce readmissions and improve patient outcomes with comprehensive care coordination.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <i className="fas fa-clinic-medical text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Clinics</h3>
                <p className="text-slate-600">Expand your care capabilities with our nurse-led chronic care management programs.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <i className="fas fa-heart text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">FQHCs</h3>
                <p className="text-slate-600">Serve underserved populations with culturally competent care coordination services.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <i className="fas fa-user-md text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Private Practice</h3>
                <p className="text-slate-600">Enhance patient care while generating additional revenue through CMS-covered services.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Programs Section */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Our Programs</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive care coordination services designed to improve patient outcomes and provider efficiency.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* CCM Program Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-stethoscope text-primary text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Chronic Care Management</h3>
                <p className="text-slate-600 mb-6">
                  CMS-covered monthly care coordination for patients with multiple chronic conditions. Our registered nurses provide comprehensive health monitoring and care plan management.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    24/7 care team availability
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Monthly care plan updates
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Medication management
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Provider communication
                  </li>
                </ul>
                <Link href="/services/ccm" className="inline-flex items-center text-primary font-semibold hover:text-blue-700">
                  Learn More <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
              
              {/* In-Home Monitoring Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-home text-secondary text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">In-Home Patient Monitoring</h3>
                <p className="text-slate-600 mb-6">
                  Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that enable continuous health tracking from the comfort of home.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    FDA-approved devices
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Real-time data transmission
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Alert management
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Patient education
                  </li>
                </ul>
                <Link href="/services/monitoring" className="inline-flex items-center text-primary font-semibold hover:text-blue-700">
                  Learn More <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
              
              {/* BHI Program Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-brain text-accent text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Behavioral Health Integration</h3>
                <p className="text-slate-600 mb-6">
                  Compassionate mental health support for seniors with behavioral conditions, using a low-stigma approach to improve engagement and outcomes.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Depression screening
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Medication adherence
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Crisis intervention
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Care team coordination
                  </li>
                </ul>
                <Link href="/services/bhi" className="inline-flex items-center text-primary font-semibold hover:text-blue-700">
                  Learn More <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Impact Stats Section */}
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Patient Impact Stats</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Our evidence-based approach delivers measurable results for patients and providers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">32%</div>
                <div className="text-blue-200 font-medium">Reduction in Hospital Readmissions</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">45%</div>
                <div className="text-blue-200 font-medium">Decrease in ER Visits</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">89%</div>
                <div className="text-blue-200 font-medium">Medication Adherence Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">96%</div>
                <div className="text-blue-200 font-medium">Patient Satisfaction Score</div>
              </div>
            </div>
            
            <div className="mt-16 bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Real Results, Real Impact</h3>
                  <p className="text-blue-100 mb-6">
                    Our comprehensive care coordination programs have demonstrated significant improvements in patient health outcomes while reducing healthcare costs for providers and payers.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <i className="fas fa-award text-yellow-400 mr-2"></i>
                      <span className="text-sm">CMS Certified</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-shield-alt text-green-400 mr-2"></i>
                      <span className="text-sm">HIPAA Compliant</span>
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" alt="Healthcare data analytics dashboard showing positive patient outcomes" className="rounded-xl opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">What Our Partners Say</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Healthcare providers across the country trust Lynk Health to deliver exceptional care coordination services.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <blockquote className="text-slate-700 mb-6 italic">
                  "Lynk Health has transformed how we care for our chronic disease patients. The reduction in hospital readmissions has been remarkable, and our patients feel more supported than ever."
                </blockquote>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" alt="Dr. Sarah Johnson, Chief Medical Officer" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-semibold text-slate-900">Dr. Sarah Johnson</div>
                    <div className="text-slate-600 text-sm">Chief Medical Officer, Regional Health System</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <blockquote className="text-slate-700 mb-6 italic">
                  "The remote monitoring program has been a game-changer for our diabetes patients. We're catching issues early and preventing complications before they become serious."
                </blockquote>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" alt="Michael Chen, Practice Administrator" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-semibold text-slate-900">Michael Chen</div>
                    <div className="text-slate-600 text-sm">Practice Administrator, Metro Family Clinic</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <blockquote className="text-slate-700 mb-6 italic">
                  "Our patients love the behavioral health integration program. The compassionate approach has made a real difference in engagement and treatment adherence."
                </blockquote>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" alt="Dr. Maria Rodriguez, Medical Director" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-semibold text-slate-900">Dr. Maria Rodriguez</div>
                    <div className="text-slate-600 text-sm">Medical Director, Community Health Center</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos Section */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Trusted by Healthcare Leaders</h2>
              <p className="text-slate-600">We partner with leading healthcare organizations across the country</p>
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
    </>
  );
}
