import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Monitoring() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-healthcare-secondary/5 to-healthcare-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-healthcare-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-heartbeat text-healthcare-secondary text-3xl"></i>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">In-Home Patient Monitoring</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that keep patients healthy at home while generating additional revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Overview of RPM and RTM</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Remote Patient Monitoring (RPM) allows continuous tracking of vital signs and health metrics using FDA-approved devices. Remote Therapeutic Monitoring (RTM) focuses on non-physiologic data such as medication adherence and therapy compliance.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our comprehensive monitoring program combines both RPM and RTM services to provide complete oversight of patient health between clinical visits, enabling early intervention and preventing complications.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">RPM Services</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Blood pressure monitoring</li>
                    <li>• Weight tracking</li>
                    <li>• Glucose monitoring</li>
                    <li>• Pulse oximetry</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">RTM Services</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Medication adherence</li>
                    <li>• Physical therapy compliance</li>
                    <li>• Respiratory therapy</li>
                    <li>• Cognitive therapy</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1605684954998-685c79d6a018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Senior patient using remote monitoring device at home"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hardware and Conditions Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Hardware Used and Conditions Tracked</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We use only FDA-approved devices to ensure accuracy and reliability in patient monitoring.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Hardware */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <i className="fas fa-devices text-healthcare-secondary mr-3"></i>
                Monitoring Devices
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-heartbeat text-healthcare-secondary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Blood Pressure Monitors</h4>
                    <p className="text-muted-foreground text-sm">Automatic cuffs with wireless transmission capabilities</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-weight text-healthcare-secondary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Digital Scales</h4>
                    <p className="text-muted-foreground text-sm">Cellular-enabled scales for daily weight monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-tint text-healthcare-secondary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Glucose Meters</h4>
                    <p className="text-muted-foreground text-sm">Connected glucometers for diabetes management</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-lungs text-healthcare-secondary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Pulse Oximeters</h4>
                    <p className="text-muted-foreground text-sm">Oxygen saturation and pulse rate monitoring</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <i className="fas fa-clipboard-list text-healthcare-primary mr-3"></i>
                Conditions We Monitor
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Congestive Heart Failure
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Hypertension
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Diabetes
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    COPD
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Chronic Kidney Disease
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Atrial Fibrillation
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Coronary Artery Disease
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Sleep Apnea
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Stroke Recovery
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <i className="fas fa-check text-healthcare-secondary mr-3"></i>
                    Post-Surgical Care
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Benefits for Seniors with Chronic Disease</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Remote monitoring empowers patients to take control of their health while providing peace of mind for families and providers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-home text-healthcare-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Age in Place</h3>
              <p className="text-muted-foreground">
                Stay safely at home while receiving professional monitoring and support for chronic conditions.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-healthcare-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bell text-healthcare-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Early Detection</h3>
              <p className="text-muted-foreground">
                Catch health changes early before they become serious complications requiring hospitalization.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-healthcare-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-graduation-cap text-healthcare-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Health Education</h3>
              <p className="text-muted-foreground">
                Learn to better understand and manage your health with guidance from our clinical team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance and Data Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Compliance and Data Transmission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our monitoring platform meets the highest standards for healthcare data security and regulatory compliance.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Healthcare data security and compliance dashboard"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Security & Compliance Features</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-shield-alt text-healthcare-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">HIPAA Compliant</h4>
                    <p className="text-muted-foreground">
                      All data transmission and storage meets HIPAA security requirements with end-to-end encryption.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-wifi text-healthcare-secondary"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Real-Time Transmission</h4>
                    <p className="text-muted-foreground">
                      Data is transmitted automatically via cellular networks, no internet required from patients.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chart-line text-healthcare-accent"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Clinical Dashboard</h4>
                    <p className="text-muted-foreground">
                      Provider access to real-time patient data with customizable alerts and reporting.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-award text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">CMS Approved</h4>
                    <p className="text-muted-foreground">
                      All devices and protocols meet CMS requirements for reimbursement under RPM and RTM codes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-healthcare-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Remote Monitoring Today</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Enhance patient care and generate additional revenue with our comprehensive remote monitoring solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-healthcare-secondary hover:bg-slate-100">
                Get Started
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-healthcare-secondary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
