import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";

export default function MonitoringPage() {
  return (
    <>
      <SEOHead
        title="In-Home Patient Monitoring Services | Remote Patient Monitoring (RPM) | Lynk Health"
        description="Professional Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services. FDA-approved devices, real-time data transmission, and Medicare reimbursement support."
        keywords="remote patient monitoring, RPM services, RTM monitoring, in-home monitoring, Medicare RPM, patient monitoring devices"
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary to-green-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">In-Home Patient Monitoring</h1>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Advanced Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that enable continuous health tracking from the comfort of home.
                </p>
                <Link href="/contact" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
                  Learn About RPM/RTM
                </Link>
              </div>
              <div>
                <img src="/images/AdobeStock_39976543_1751485954824.jpeg" alt="Senior patient using remote monitoring device for health tracking" className="rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* RPM vs RTM Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Remote Patient Monitoring Solutions</h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto">
                Our comprehensive monitoring services include both Remote Patient Monitoring (RPM) for physiological data and Remote Therapeutic Monitoring (RTM) for non-physiological data, providing complete health oversight.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-heartbeat text-secondary text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Remote Patient Monitoring (RPM)</h3>
                <p className="text-slate-600 mb-6">
                  RPM focuses on monitoring physiological parameters like blood pressure, weight, heart rate, and blood glucose levels using FDA-approved medical devices.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Blood pressure monitoring
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Weight and BMI tracking
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Blood glucose monitoring
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-secondary mr-3"></i>
                    Heart rate and rhythm monitoring
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-mobile-alt text-primary text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Remote Therapeutic Monitoring (RTM)</h3>
                <p className="text-slate-600 mb-6">
                  RTM monitors non-physiological data including medication adherence, therapy compliance, and functional status using digital health tools.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-primary mr-3"></i>
                    Medication adherence tracking
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-primary mr-3"></i>
                    Therapy compliance monitoring
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-primary mr-3"></i>
                    Symptom tracking and reporting
                  </li>
                  <li className="flex items-center text-slate-600">
                    <i className="fas fa-check text-primary mr-3"></i>
                    Activity and mobility assessment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware and Technology */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">FDA-Approved Monitoring Devices</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We provide state-of-the-art, FDA-approved monitoring devices that are easy to use and seamlessly transmit data to our care team.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-thermometer-half text-red-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Blood Pressure Monitors</h3>
                <p className="text-slate-600 text-sm">Automatic cuffs with cellular connectivity for hypertension monitoring</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-weight text-blue-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Scales</h3>
                <p className="text-slate-600 text-sm">Cellular-enabled scales for weight and BMI tracking in heart failure patients</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-tint text-green-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Glucose Meters</h3>
                <p className="text-slate-600 text-sm">Connected glucometers for diabetes management and glucose tracking</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lungs text-purple-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Pulse Oximeters</h3>
                <p className="text-slate-600 text-sm">Digital pulse oximeters for oxygen saturation and heart rate monitoring</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conditions We Track */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Conditions We Monitor</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our monitoring services benefit seniors with various chronic conditions, helping prevent complications and hospitalizations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-heart text-red-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Congestive Heart Failure</h3>
                <p className="text-slate-600 text-sm">Daily weight monitoring helps detect fluid retention and prevent heart failure exacerbations.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-head-side-cough text-purple-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Hypertension</h3>
                <p className="text-slate-600 text-sm">Regular blood pressure monitoring helps optimize medication management and prevent complications.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-pills text-green-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Diabetes</h3>
                <p className="text-slate-600 text-sm">Continuous glucose monitoring helps maintain optimal blood sugar control and prevent complications.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-lungs text-blue-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">COPD</h3>
                <p className="text-slate-600 text-sm">Oxygen saturation and respiratory rate monitoring help manage chronic lung conditions.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-kidneys text-yellow-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Chronic Kidney Disease</h3>
                <p className="text-slate-600 text-sm">Blood pressure and weight monitoring support kidney function preservation.</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-procedures text-indigo-600"></i>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Post-Surgical Care</h3>
                <p className="text-slate-600 text-sm">Remote monitoring supports recovery and early detection of post-operative complications.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Transmission & Compliance */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Secure Data Transmission & Compliance</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Our monitoring platform ensures secure, HIPAA-compliant data transmission with real-time alerts for concerning values.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-shield-alt text-green-600"></i>
                    </div>
                    <span className="text-slate-700">HIPAA-compliant data encryption</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-clock text-blue-600"></i>
                    </div>
                    <span className="text-slate-700">Real-time data transmission</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-bell text-yellow-600"></i>
                    </div>
                    <span className="text-slate-700">Automated alerts for abnormal readings</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-chart-line text-purple-600"></i>
                    </div>
                    <span className="text-slate-700">Trend analysis and reporting</span>
                  </div>
                </div>
              </div>
              
              <div>
                <img src="https://images.pexels.com/photos/7578826/pexels-photo-7578826.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" alt="Healthcare data dashboard showing patient monitoring metrics" className="rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Medicare Reimbursement */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Medicare Reimbursement for RPM/RTM</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Medicare covers RPM and RTM services with specific CPT codes, providing sustainable revenue while improving patient outcomes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-secondary mb-2">99453</div>
                <div className="font-semibold text-slate-900 mb-2">Device Setup</div>
                <div className="text-slate-600 text-sm">Patient education and device setup</div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">99454</div>
                <div className="font-semibold text-slate-900 mb-2">Device Supply</div>
                <div className="text-slate-600 text-sm">30-day device supply and data collection</div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-accent mb-2">99457</div>
                <div className="font-semibold text-slate-900 mb-2">Initial Analysis</div>
                <div className="text-slate-600 text-sm">First 20 minutes of data review</div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">99458</div>
                <div className="font-semibold text-slate-900 mb-2">Additional Time</div>
                <div className="text-slate-600 text-sm">Each additional 20 minutes</div>
              </div>
            </div>
            
            <div className="mt-12 bg-secondary/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">RPM Revenue Potential</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">$80-160</div>
                  <div className="text-slate-600">Average monthly revenue per RPM patient</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$4,800</div>
                  <div className="text-slate-600">Annual revenue potential per 50 patients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">30%</div>
                  <div className="text-slate-600">Reduction in emergency room visits</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Implement Remote Monitoring?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Start monitoring your patients remotely and generate additional revenue while preventing hospitalizations and improving outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
                Get Started Today
              </Link>
              <Link href="/how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-secondary transition-colors">
                Learn How It Works
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
