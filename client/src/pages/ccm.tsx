import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CCM() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-healthcare-primary/5 to-healthcare-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-healthcare-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-stethoscope text-healthcare-primary text-3xl"></i>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Chronic Care Management</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive, nurse-led care coordination for Medicare patients with multiple chronic conditions. Generate revenue while improving patient outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">What is Chronic Care Management?</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Chronic Care Management (CCM) is a CMS-covered service that provides ongoing care coordination for patients with multiple chronic conditions. Our registered nurses work directly with your patients to manage their health between visits, ensuring better outcomes and reducing hospitalizations.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                CCM services include comprehensive care planning, medication management, health education, and 24/7 access to our clinical team. All services are fully reimbursed by Medicare and most commercial insurers.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  20+ minutes of clinical staff time per month
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Comprehensive care plan development and updates
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  24/7 access to care team
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Medication adherence monitoring
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Nurse providing chronic care management services"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">How CCM Helps Providers and Patients</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our CCM program delivers measurable benefits for healthcare providers and their patients.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Provider Benefits */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <i className="fas fa-hospital text-healthcare-primary mr-3"></i>
                Provider Benefits
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-dollar-sign text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Generate Additional Revenue</div>
                    <div className="text-muted-foreground text-sm">Average $200-300 per patient per month through CMS reimbursement</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-chart-line text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Improve Quality Metrics</div>
                    <div className="text-muted-foreground text-sm">Better HEDIS scores and quality reporting outcomes</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-user-shield text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Reduce Provider Burden</div>
                    <div className="text-muted-foreground text-sm">Our team handles all documentation and billing requirements</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-handshake text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Strengthen Patient Relationships</div>
                    <div className="text-muted-foreground text-sm">Improved patient satisfaction and engagement</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Patient Benefits */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <i className="fas fa-heart text-healthcare-accent mr-3"></i>
                Patient Benefits
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-phone text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">24/7 Access to Care Team</div>
                    <div className="text-muted-foreground text-sm">Immediate support when health questions arise</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-pills text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Better Medication Management</div>
                    <div className="text-muted-foreground text-sm">Improved adherence and fewer medication errors</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-home text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Stay Healthy at Home</div>
                    <div className="text-muted-foreground text-sm">Prevent complications that lead to hospitalizations</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-graduation-cap text-healthcare-secondary mr-3 mt-1"></i>
                  <div>
                    <div className="font-semibold text-foreground">Health Education & Support</div>
                    <div className="text-muted-foreground text-sm">Learn to better manage chronic conditions</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reimbursement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Reimbursement Details</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CCM services are fully covered by Medicare and most commercial insurance plans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-bold text-healthcare-primary mb-2">$200-300</div>
              <div className="font-semibold text-foreground mb-2">Per Patient Per Month</div>
              <div className="text-muted-foreground text-sm">Average reimbursement for CCM services</div>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-bold text-healthcare-secondary mb-2">100%</div>
              <div className="font-semibold text-foreground mb-2">Medicare Coverage</div>
              <div className="text-muted-foreground text-sm">No patient copay required for CCM services</div>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-bold text-healthcare-accent mb-2">0%</div>
              <div className="font-semibold text-foreground mb-2">Provider Risk</div>
              <div className="text-muted-foreground text-sm">We handle all billing and compliance</div>
            </div>
          </div>
          
          <div className="mt-12 bg-healthcare-primary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Billing Requirements We Handle</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Patient consent documentation
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Comprehensive care plan creation
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Monthly time tracking and documentation
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  CMS billing and claims submission
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Quality reporting and metrics
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                  Audit preparation and support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-healthcare-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start a CCM Program</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Ready to improve patient outcomes while generating additional revenue? Our team will help you launch a successful CCM program in your practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-healthcare-primary hover:bg-slate-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-healthcare-primary">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
