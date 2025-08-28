import ContactForm from "@/components/forms/contact-form";

export default function Contact() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Partner With Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to enhance your patient care capabilities? Get in touch with our team to learn how we can help you implement comprehensive care coordination services.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <p className="text-muted-foreground">(601) 859-4342</p>
                      <p className="text-muted-foreground text-sm">Available Monday - Friday, 8 AM - 6 PM CST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-envelope text-healthcare-secondary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">info@lynkhealthcare.com</p>
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

              {/* Google Maps Placeholder */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <i className="fas fa-map text-4xl mb-2"></i>
                    <div className="font-semibold">Interactive Map</div>
                    <div className="text-sm">Google Maps integration would be implemented here</div>
                  </div>
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

      {/* Emergency Contact */}
      <section className="py-12 bg-healthcare-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">24/7 Clinical Support</h3>
            <p className="text-blue-100 mb-4">
              For urgent clinical matters or patient emergencies, our nursing team is available around the clock.
            </p>
            <div className="flex items-center justify-center">
              <i className="fas fa-phone mr-2"></i>
              <span className="text-lg font-semibold">(601) 859-4342</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
