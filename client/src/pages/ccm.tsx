import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Stethoscope, Clock, DollarSign, Users, Check, ArrowRight } from "lucide-react";

export default function CCM() {
  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Chronic Care Management</h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                CMS-covered monthly care coordination for patients with multiple chronic conditions. Our registered nurses provide comprehensive health monitoring and care plan management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Start a CCM Program
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Nurse providing chronic care management consultation"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description of CCM */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What is Chronic Care Management?</h2>
            <div className="prose prose-lg mx-auto text-slate-600 mb-12">
              <p>
                Chronic Care Management (CCM) is a Medicare-covered service that provides non-face-to-face care coordination for patients with multiple chronic conditions. Our program focuses on comprehensive care plan development, medication management, and continuous health monitoring to help patients better manage their conditions and avoid complications.
              </p>
              <p>
                CCM services are designed for patients who have two or more chronic conditions expected to last at least 12 months, or until the death of the patient, and which place the patient at significant risk of death, acute exacerbation/decompensation, or functional decline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How CCM Helps */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How CCM Helps Providers and Patients</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our CCM program delivers measurable benefits for both healthcare providers and their patients.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits for Providers */}
            <Card className="bg-white shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-900">
                  <Stethoscope className="h-6 w-6 mr-3 text-blue-600" />
                  Benefits for Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Additional Revenue Stream</div>
                      <div className="text-slate-600">Generate $40-60 per patient per month through CMS reimbursement</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Reduced Readmissions</div>
                      <div className="text-slate-600">Lower 30-day readmission rates through proactive monitoring</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Enhanced Patient Satisfaction</div>
                      <div className="text-slate-600">Improve CAHPS scores with better care coordination</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Practice Efficiency</div>
                      <div className="text-slate-600">Reduce urgent care visits and unscheduled appointments</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Benefits for Patients */}
            <Card className="bg-white shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-900">
                  <Users className="h-6 w-6 mr-3 text-emerald-600" />
                  Benefits for Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">24/7 Care Team Access</div>
                      <div className="text-slate-600">Direct access to registered nurses for health questions and concerns</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Medication Management</div>
                      <div className="text-slate-600">Support with medication adherence and side effect monitoring</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Health Education</div>
                      <div className="text-slate-600">Personalized education about managing chronic conditions</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Coordinated Care</div>
                      <div className="text-slate-600">Seamless communication between all members of their care team</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reimbursement Details */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">CCM Reimbursement Details</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Understanding the financial benefits and requirements of CMS-covered CCM services.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center bg-slate-50 border-none">
              <CardContent className="p-8">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Monthly Reimbursement</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">$40-60</div>
                <p className="text-slate-600">Per patient per month from CMS for qualifying CCM services</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-slate-50 border-none">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Time Requirements</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">20+ min</div>
                <p className="text-slate-600">Minimum monthly clinical staff time per patient for reimbursement</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-slate-50 border-none">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Patient Eligibility</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">2+</div>
                <p className="text-slate-600">Chronic conditions required for Medicare CCM eligibility</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">CCM Billing Requirements</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Documentation Requirements</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Comprehensive care plan development
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Monthly patient contact documentation
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Time tracking for clinical staff activities
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Patient consent for CCM services
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">We Handle</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    All CMS billing and documentation
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Patient enrollment and consent process
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Compliance monitoring and reporting
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-600 mr-2" />
                    Revenue cycle management
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your CCM Program?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of healthcare providers who are improving patient outcomes and generating additional revenue with our CCM services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Learn More <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
