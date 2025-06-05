import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function BHI() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-healthcare-accent/5 to-healthcare-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-healthcare-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-brain text-healthcare-accent text-3xl"></i>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Behavioral Health Integration</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compassionate mental health support for seniors with behavioral conditions, using our low-stigma approach to improve engagement and outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* How BHI Supports Seniors Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">How BHI Supports Seniors on Behavioral Medications</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Behavioral Health Integration (BHI) provides specialized support for Medicare patients taking behavioral health medications. Our program addresses the unique challenges seniors face with mental health treatment, including medication adherence, side effect management, and social isolation.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our clinical team works closely with patients and their providers to ensure optimal medication management, monitor for adverse effects, and provide ongoing psychosocial support that improves treatment outcomes.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-healthcare-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <i className="fas fa-heart text-healthcare-accent text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Medication Adherence Support</h4>
                    <p className="text-muted-foreground text-sm">Regular check-ins to ensure proper medication compliance and identify barriers to adherence.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-healthcare-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <i className="fas fa-shield-alt text-healthcare-accent text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Side Effect Monitoring</h4>
                    <p className="text-muted-foreground text-sm">Proactive monitoring for medication side effects and coordination with prescribing providers.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-healthcare-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <i className="fas fa-users text-healthcare-accent text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Social Support</h4>
                    <p className="text-muted-foreground text-sm">Addressing social isolation and connecting patients with community resources.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Healthcare professional providing compassionate behavioral health support"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Low-Stigma Approach Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Low-Stigma Approach to Engagement</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We understand that mental health discussions can be challenging for seniors. Our approach prioritizes dignity, privacy, and compassionate care.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-comments text-healthcare-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Respectful Communication</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our team uses person-first language and approaches mental health discussions with sensitivity and respect for individual experiences.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-healthcare-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-shield text-healthcare-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Privacy Protection</h3>
              <p className="text-muted-foreground leading-relaxed">
                All conversations are confidential and conducted in private settings, ensuring patients feel safe to discuss their mental health openly.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-healthcare-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-graduation-cap text-healthcare-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Education & Empowerment</h3>
              <p className="text-muted-foreground leading-relaxed">
                We provide education about mental health conditions and treatment options, empowering patients to be active participants in their care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reimbursement and Dual Enrollment Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Healthcare billing and reimbursement documentation"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Reimbursement and Dual-Enrollment with CCM</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                BHI services are reimbursable through Medicare and can be provided alongside Chronic Care Management (CCM) services for eligible patients, maximizing revenue opportunities while providing comprehensive care.
              </p>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">Dual Enrollment Benefits</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center">
                      <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                      Patients can receive both CCM and BHI services simultaneously
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                      Comprehensive approach to physical and mental health
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                      Increased revenue per patient through dual billing
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                      Better patient outcomes through integrated care
                    </li>
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-healthcare-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-healthcare-primary mb-1">$150-250</div>
                    <div className="text-sm text-muted-foreground">Monthly BHI Reimbursement</div>
                  </div>
                  <div className="text-center p-4 bg-healthcare-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-healthcare-secondary mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">Medicare Coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Comprehensive BHI Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our behavioral health integration program provides a full spectrum of support services for seniors with mental health needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clipboard-check text-healthcare-primary"></i>
              </div>
              <h3 className="font-bold text-foreground mb-2">Depression Screening</h3>
              <p className="text-muted-foreground text-sm">Regular PHQ-9 assessments and mood monitoring</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-pills text-healthcare-secondary"></i>
              </div>
              <h3 className="font-bold text-foreground mb-2">Medication Management</h3>
              <p className="text-muted-foreground text-sm">Adherence support and side effect monitoring</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-healthcare-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-healthcare-accent"></i>
              </div>
              <h3 className="font-bold text-foreground mb-2">Crisis Intervention</h3>
              <p className="text-muted-foreground text-sm">24/7 support for mental health emergencies</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-network-wired text-blue-600"></i>
              </div>
              <h3 className="font-bold text-foreground mb-2">Care Coordination</h3>
              <p className="text-muted-foreground text-sm">Integration with primary care and specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-healthcare-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Behavioral Health Integration</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Provide compassionate mental health support for your patients while generating additional revenue through our BHI program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-healthcare-accent hover:bg-slate-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-healthcare-accent">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
