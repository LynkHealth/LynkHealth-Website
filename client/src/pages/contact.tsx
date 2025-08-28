import ContactForm from "@/components/forms/contact-form";

export default function Contact() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Zero Upfront Costs • 4-6 Week Implementation</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Start Generating <span className="text-accent">$100+</span> Per Patient Monthly
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Join healthcare providers nationwide who are transforming Medicare care coordination and creating sustainable revenue streams. No upfront investment, proven results, flexible implementation.
            </p>
            
            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-accent mb-2">$2,457</div>
                <div className="text-sm text-blue-100">Annual cost savings per patient</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-accent mb-2">90%+</div>
                <div className="text-sm text-blue-100">Patient retention with local nurses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-accent mb-2">45%</div>
                <div className="text-sm text-blue-100">Average enrollment rate</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact-form" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
                Get Your Revenue Projection
              </a>
              <a href="/calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-white/30">
                Use ROI Calculator
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Why 65+ Healthcare Providers Choose Lynk Health</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We handle the complexity so you can focus on what matters most - patient care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Immediate Revenue</h3>
              <p className="text-muted-foreground">Start generating $42-$110 per patient monthly with CMS-approved Medicare programs. No upfront investment required.</p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-nurse text-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Local Nurses</h3>
              <p className="text-muted-foreground">Dedicated nursing teams who understand your community - never call centers. Build authentic patient relationships.</p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cogs text-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Flexible Integration</h3>
              <p className="text-muted-foreground">Optional EHR integration or independent workflow - the choice is yours. Minimal disruption, maximum flexibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-form" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Practice?</h2>
            <p className="text-xl text-muted-foreground">Get your personalized revenue projection and implementation timeline.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-phone text-healthcare-primary"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <a 
                        href="tel:+16018594342" 
                        className="inline-flex items-center text-healthcare-primary hover:text-healthcare-primary/80 font-medium transition-colors mb-2"
                      >
                        <i className="fas fa-phone-alt mr-2"></i>
                        (601) 859-4342
                      </a>
                      <p className="text-muted-foreground text-sm">Available Monday - Friday, 8 AM - 6 PM CST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-envelope text-healthcare-secondary"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <a 
                        href="mailto:info@lynkhealthcare.com" 
                        className="inline-flex items-center text-healthcare-secondary hover:text-healthcare-secondary/80 font-medium transition-colors mb-2"
                      >
                        <i className="fas fa-envelope-open mr-2"></i>
                        info@lynkhealthcare.com
                      </a>
                      <p className="text-muted-foreground text-sm">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-healthcare-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-healthcare-accent"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Headquarters</h4>
                      <p className="text-muted-foreground">
                        200 Trace Colony Park Dr, Suite C<br />
                        Ridgeland, MS 39157
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-clock text-blue-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Business Hours</h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 8:00 AM - 6:00 PM CST<br />
                        Saturday: Closed<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-muted-foreground hover:text-healthcare-primary transition-colors">
                    <i className="fas fa-download mr-3 text-healthcare-primary"></i>
                    Download our Services Overview (PDF)
                  </a>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-healthcare-primary transition-colors">
                    <i className="fas fa-calculator mr-3 text-healthcare-primary"></i>
                    ROI Calculator Tool
                  </a>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-healthcare-primary transition-colors">
                    <i className="fas fa-calendar mr-3 text-healthcare-primary"></i>
                    Schedule a Demo
                  </a>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-healthcare-primary transition-colors">
                    <i className="fas fa-question-circle mr-3 text-healthcare-primary"></i>
                    Frequently Asked Questions
                  </a>
                </div>
              </div>

              {/* Google Maps */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">Our Location</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3346.123456789!2d-90.1234567!3d32.4123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s200+Trace+Colony+Park+Dr+Suite+C%2C+Ridgeland%2C+MS+39157!5e0!3m2!1sen!2sus!4v1638123456789!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lynk Health Office Location - 200 Trace Colony Park Dr, Suite C, Ridgeland, MS 39157"
                  ></iframe>
                </div>
                <div className="mt-4 text-center">
                  <a 
                    href="https://www.google.com/maps/place/200+Trace+Colony+Park+Dr,+Ridgeland,+MS+39157"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-healthcare-primary hover:text-blue-700 font-medium text-sm"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Support Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Additional Support Options</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're here to support you every step of the way, from initial consultation to ongoing program optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-healthcare-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Schedule a Demo</h3>
              <p className="text-muted-foreground mb-4">
                See our platform in action and learn how it integrates with your existing workflow.
              </p>
              <a href="#" className="text-healthcare-primary font-medium hover:text-blue-700 transition-colors">
                Book a Demo →
              </a>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-healthcare-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-headset text-healthcare-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Customer Support</h3>
              <p className="text-muted-foreground mb-4">
                Get help with technical questions, billing issues, or program optimization.
              </p>
              <a href="#" className="text-healthcare-secondary font-medium hover:text-green-700 transition-colors">
                Contact Support →
              </a>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-healthcare-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-healthcare-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Training & Education</h3>
              <p className="text-muted-foreground mb-4">
                Access training materials, webinars, and educational resources for your team.
              </p>
              <a href="#" className="text-healthcare-accent font-medium hover:text-red-700 transition-colors">
                View Resources →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Your 4-6 Week Implementation Timeline</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We make starting easy with a proven implementation process that gets you generating revenue quickly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Week 1</h3>
              <p className="text-blue-100 text-sm">Contract signing, credentialing, and initial setup</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2-3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Weeks 2-3</h3>
              <p className="text-blue-100 text-sm">Staff training, workflow setup, and optional EHR integration</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Week 4</h3>
              <p className="text-blue-100 text-sm">Patient identification and enrollment begins</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Weeks 5-6</h3>
              <p className="text-blue-100 text-sm">First revenue generated, full program launch</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <i className="fas fa-phone mr-2"></i>
              <span className="font-semibold">24/7 Clinical Support: (601) 859-4342</span>
            </div>
            <p className="text-blue-100">
              Our nursing team is available around the clock for urgent clinical matters or patient emergencies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
