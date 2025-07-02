import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";

export default function CCMPage() {
  return (
    <>
      <SEOHead
        title="Chronic Care Management (CCM) Services | Lynk Health"
        description="Professional nurse-led Chronic Care Management services for Medicare patients. CMS-covered monthly care coordination, medication management, and 24/7 patient support."
        keywords="chronic care management, CCM services, Medicare CCM, care coordination, chronic disease management, CMS reimbursement"
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">Chronic Care Management</h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Comprehensive, nurse-led care coordination for Medicare patients with multiple chronic conditions. Generate revenue while improving patient outcomes.
                </p>
                <Link href="/contact" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
                  Start a CCM Program
                </Link>
              </div>
              <div>
                <img src="/attached_assets/AdobeStock_425213387_Preview_1751485954824.jpeg" alt="Professional nurse providing chronic care management services" className="rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* What is CCM */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is Chronic Care Management?</h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto">
                Chronic Care Management (CCM) is a CMS-covered service that provides ongoing care coordination for Medicare patients with two or more chronic conditions. Our registered nurses work directly with patients to manage their health, coordinate care, and prevent complications.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-xl p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-user-md text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Nurse-Led Care</h3>
                <p className="text-slate-600">Our registered nurses provide personalized care coordination, working closely with patients to manage their chronic conditions and health goals.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-calendar-check text-secondary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Monthly Contact</h3>
                <p className="text-slate-600">Patients receive at least 20 minutes of non-face-to-face care management services each month, ensuring continuous support and monitoring.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-dollar-sign text-accent text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">CMS Reimbursed</h3>
                <p className="text-slate-600">CCM services are fully reimbursed by Medicare, providing a sustainable revenue stream while improving patient care quality.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How CCM Helps */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">How CCM Helps Providers and Patients</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-hospital text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Reduces Hospital Readmissions</h4>
                      <p className="text-slate-600">Continuous monitoring and care coordination help prevent complications that lead to expensive hospitalizations.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-pills text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Improves Medication Adherence</h4>
                      <p className="text-slate-600">Regular check-ins and education help patients better manage their medications and treatment plans.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-chart-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Enhances Patient Engagement</h4>
                      <p className="text-slate-600">Patients feel more supported and engaged in their care, leading to better health outcomes and satisfaction.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-money-bill-wave text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Generates Additional Revenue</h4>
                      <p className="text-slate-600">CCM services provide a sustainable monthly revenue stream while improving patient care quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <img src="https://images.pexels.com/photos/7578815/pexels-photo-7578815.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" alt="Healthcare provider discussing chronic care management with patient" className="rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Reimbursement Details */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">CCM Reimbursement Details</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Medicare reimburses CCM services with specific CPT codes, providing predictable revenue for qualifying patient encounters.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">99490</div>
                <div className="font-semibold text-slate-900 mb-2">Initial CCM</div>
                <div className="text-slate-600 text-sm">First 20 minutes of CCM services</div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-secondary mb-2">99491</div>
                <div className="font-semibold text-slate-900 mb-2">Additional CCM</div>
                <div className="text-slate-600 text-sm">Each additional 20 minutes</div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">99487</div>
                <div className="font-semibold text-slate-900 mb-2">Complex CCM</div>
                <div className="text-slate-600 text-sm">First 60 minutes for complex patients</div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99489</div>
                <div className="font-semibold text-slate-900 mb-2">Add-on Complex</div>
                <div className="text-slate-600 text-sm">Each additional 30 minutes</div>
              </div>
            </div>
            
            <div className="mt-12 bg-primary/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Revenue Potential</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$60-120</div>
                  <div className="text-slate-600">Average monthly revenue per CCM patient</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">$3,600</div>
                  <div className="text-slate-600">Annual revenue potential per 50 patients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <div className="text-slate-600">Average Medicare reimbursement rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Features */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our CCM Service Features</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive care coordination services designed to meet CMS requirements while delivering exceptional patient care.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-clock text-primary"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">24/7 Patient Access</h3>
                <p className="text-slate-600 text-sm">Patients have round-the-clock access to their care team for urgent health concerns.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-file-medical text-secondary"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Care Plan Development</h3>
                <p className="text-slate-600 text-sm">Personalized care plans created and updated based on patient needs and conditions.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-pills text-accent"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Medication Management</h3>
                <p className="text-slate-600 text-sm">Ongoing medication review, adherence support, and coordination with pharmacies.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-phone text-blue-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Regular Check-ins</h3>
                <p className="text-slate-600 text-sm">Scheduled monthly calls and additional contact as needed for health monitoring.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-chart-bar text-green-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Health Monitoring</h3>
                <p className="text-slate-600 text-sm">Continuous tracking of health metrics and early identification of concerning trends.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-notes-medical text-purple-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Documentation & Billing</h3>
                <p className="text-slate-600 text-sm">Complete documentation and billing support to ensure CMS compliance and reimbursement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your CCM Program?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join healthcare providers across the country who are improving patient outcomes and generating additional revenue with our CCM services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
                Get Started Today
              </Link>
              <Link href="/how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors">
                Learn How It Works
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
