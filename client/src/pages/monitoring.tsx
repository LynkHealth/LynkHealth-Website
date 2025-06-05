import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, Smartphone, Shield, Heart, Check, ArrowRight, Bell, BarChart } from "lucide-react";

export default function Monitoring() {
  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="container py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">In-Home Patient Monitoring</h1>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that enable continuous health tracking from the comfort of home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Start RPM/RTM Program
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1605684954998-685c79d6a018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Senior patient using remote monitoring device at home"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview of RPM and RTM */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Remote Monitoring Services Overview</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our comprehensive remote monitoring programs help patients manage their health from home while providing healthcare providers with real-time insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* RPM Card */}
            <Card className="bg-slate-50 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-900">
                  <Activity className="h-6 w-6 mr-3 text-emerald-600" />
                  Remote Patient Monitoring (RPM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  RPM uses digital technologies to collect medical and health data from patients in one location and electronically transmit that information securely to healthcare providers for assessment and recommendations.
                </p>
                <h4 className="font-semibold text-slate-900 mb-4">Key Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-3" />
                    Continuous vital sign monitoring
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-3" />
                    Automatic data transmission
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-3" />
                    Real-time alerts for abnormal readings
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-3" />
                    Medicare reimbursement eligible
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* RTM Card */}
            <Card className="bg-slate-50 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-900">
                  <BarChart className="h-6 w-6 mr-3 text-blue-600" />
                  Remote Therapeutic Monitoring (RTM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  RTM monitors non-physiologic data such as medication adherence, respiratory system status, therapy response, and other therapeutic parameters outside traditional clinical settings.
                </p>
                <h4 className="font-semibold text-slate-900 mb-4">Key Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-blue-600 mr-3" />
                    Medication adherence tracking
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-blue-600 mr-3" />
                    Therapy response monitoring
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-blue-600 mr-3" />
                    Digital therapeutic interventions
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-blue-600 mr-3" />
                    Enhanced patient engagement
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hardware and Technology */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">FDA-Approved Monitoring Devices</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We provide state-of-the-art monitoring equipment that seamlessly integrates with our care coordination platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-white border-none shadow-sm">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Blood Pressure Monitors</h3>
                <p className="text-slate-600 text-sm">Automatic daily readings with wireless transmission to care team</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-none shadow-sm">
              <CardContent className="p-8">
                <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Weight Scales</h3>
                <p className="text-slate-600 text-sm">Smart scales that track weight trends for heart failure management</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-none shadow-sm">
              <CardContent className="p-8">
                <Smartphone className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Glucose Meters</h3>
                <p className="text-slate-600 text-sm">Connected glucose monitoring for diabetes management</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-none shadow-sm">
              <CardContent className="p-8">
                <Bell className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Pulse Oximeters</h3>
                <p className="text-slate-600 text-sm">Continuous oxygen saturation monitoring for respiratory conditions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Conditions Tracked */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Conditions We Monitor</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our remote monitoring services are particularly effective for managing these chronic conditions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-50 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Cardiovascular Conditions</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Congestive Heart Failure</li>
                  <li>• Hypertension</li>
                  <li>• Arrhythmias</li>
                  <li>• Post-cardiac surgery recovery</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Respiratory Conditions</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• COPD</li>
                  <li>• Asthma</li>
                  <li>• Sleep apnea</li>
                  <li>• Post-pneumonia recovery</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Metabolic Conditions</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Type 1 & 2 Diabetes</li>
                  <li>• Obesity management</li>
                  <li>• Thyroid disorders</li>
                  <li>• Chronic kidney disease</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Seniors */}
      <section className="bg-blue-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Benefits for Seniors with Chronic Disease</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Remote monitoring enables aging in place while providing peace of mind for patients and families.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Senior patient confidently using remote monitoring device"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Enhanced Independence & Safety</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Early Detection</div>
                    <div className="text-slate-600">Catch health changes before they become emergencies</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Reduced Hospital Visits</div>
                    <div className="text-slate-600">Prevent unnecessary ER visits and hospitalizations</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Family Peace of Mind</div>
                    <div className="text-slate-600">Real-time updates keep family members informed</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Medication Adherence</div>
                    <div className="text-slate-600">Reminders and tracking improve medication compliance</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance and Data Transmission */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Compliance & Data Security</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our remote monitoring platform meets the highest standards for healthcare data security and regulatory compliance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center bg-slate-50 border-none">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">HIPAA Compliant</h3>
                <p className="text-slate-600">
                  All data transmission and storage meets HIPAA requirements for protected health information.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-slate-50 border-none">
              <CardContent className="p-8">
                <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-Time Data</h3>
                <p className="text-slate-600">
                  Secure wireless transmission of patient data directly to EHR systems and care teams.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-slate-50 border-none">
              <CardContent className="p-8">
                <Bell className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Alerts</h3>
                <p className="text-slate-600">
                  Intelligent alerting system notifies care teams of concerning trends or critical values.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-emerald-50 rounded-2xl p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Medicare Reimbursement</h3>
                <p className="text-slate-600 mb-6">
                  RPM and RTM services are covered by Medicare, providing sustainable revenue streams for healthcare providers while improving patient outcomes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    CPT codes 99453-99458 for RPM
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    CPT codes 98975-98981 for RTM
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    No patient copay for eligible services
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">$200+</div>
                <div className="text-lg font-semibold text-slate-900 mb-2">Monthly Revenue Potential</div>
                <div className="text-slate-600">Per patient enrolled in comprehensive monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Launch Remote Monitoring?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Help your patients manage their health from home while generating additional revenue for your practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100">
                Start Your Program Today
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                Learn More <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
