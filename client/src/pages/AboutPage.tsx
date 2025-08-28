import { SEOHead } from "@/components/SEOHead";

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Lynk Health - Mission & Vision | Healthcare Care Coordination"
        description="Learn about Lynk Health's mission to help seniors stay out of hospitals and age in place through professional nurse-led care coordination services."
        keywords="healthcare mission, care coordination company, Medicare services, aging in place, preventive care"
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">About Lynk Health</h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Helping seniors stay out of hospitals and age in place through comprehensive, nurse-led care coordination services.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  At Lynk Health, we believe that every senior deserves to live independently and with dignity. Our mission is to provide comprehensive care coordination services that help Medicare patients with chronic conditions stay healthy, avoid unnecessary hospitalizations, and age comfortably in their own homes.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We partner with healthcare providers to deliver white-labeled, nurse-led care coordination that improves patient outcomes while generating sustainable revenue streams for practices and health systems.
                </p>
              </div>
              <div>
                <img src="/images/AdobeStock_671445453 (1)_1751485954796.jpeg" alt="Senior patient receiving comprehensive care at home" className="rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img src="/images/AdobeStock_400795942_1751485954824.jpeg" alt="Healthcare technology enabling better patient care outcomes" className="rounded-2xl shadow-lg" />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  We envision a healthcare system where preventive care and continuous monitoring are the norm, not the exception. Through better nurse-led engagement and advanced technology, we aim to transform how chronic diseases are managed in the Medicare population.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our vision is to become the leading provider of care coordination services, empowering healthcare organizations to deliver exceptional patient care while improving their financial sustainability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Values</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                These core values guide everything we do and inform how we serve our partners and their patients.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Compassionate Care</h3>
                <p className="text-slate-600">We treat every patient with dignity, respect, and genuine concern for their well-being and quality of life.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-handshake text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Partnership</h3>
                <p className="text-slate-600">We work collaboratively with healthcare providers, becoming an extension of their care team.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Excellence</h3>
                <p className="text-slate-600">We strive for the highest standards in clinical care, customer service, and operational efficiency.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Innovation</h3>
                <p className="text-slate-600">We continuously improve our services through technology and evidence-based practices.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-amber-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Integrity</h3>
                <p className="text-slate-600">We operate with transparency, honesty, and strict adherence to regulatory compliance.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-purple-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Community</h3>
                <p className="text-slate-600">We are committed to improving the health and well-being of the communities we serve.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Leadership Team</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our experienced leadership team brings decades of healthcare, technology, and business expertise.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder for future team member profiles */}
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-slate-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Leadership Profile</h3>
                <p className="text-slate-600 mb-4">Position Title</p>
                <p className="text-sm text-slate-500">Leadership team profiles will be added here as the company grows.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-slate-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Leadership Profile</h3>
                <p className="text-slate-600 mb-4">Position Title</p>
                <p className="text-sm text-slate-500">Leadership team profiles will be added here as the company grows.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-slate-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Leadership Profile</h3>
                <p className="text-slate-600 mb-4">Position Title</p>
                <p className="text-sm text-slate-500">Leadership team profiles will be added here as the company grows.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Partner with Us?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join healthcare providers across the country who are improving patient outcomes and generating additional revenue with our care coordination services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors">
                Get Started Today
              </a>
              <a href="/how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors">
                Learn How It Works
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
