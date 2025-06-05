import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Target, Eye, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-slate-50">
        <div className="container py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">About Lynk Health</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're dedicated to helping seniors stay out of hospitals and age in place through innovative nurse-led care coordination services.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Lynk Health, we believe that seniors deserve to age with dignity and independence in their own homes. Our mission is to bridge the gap between clinical care and daily living through comprehensive, nurse-led care coordination services.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We partner with healthcare providers to deliver preventive care that keeps patients healthy, reduces hospitalizations, and improves quality of life for Medicare beneficiaries with chronic conditions.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Partner With Us
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Senior patient receiving care coordination support at home"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              These values guide everything we do and shape how we deliver care coordination services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-none bg-white shadow-sm">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Patient-Centered</h3>
                <p className="text-slate-600">Every decision we make puts the patient's health, dignity, and preferences first.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none bg-white shadow-sm">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Excellence</h3>
                <p className="text-slate-600">We maintain the highest standards in clinical care and service delivery.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none bg-white shadow-sm">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Collaboration</h3>
                <p className="text-slate-600">We work seamlessly with your care team to enhance patient outcomes.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none bg-white shadow-sm">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Innovation</h3>
                <p className="text-slate-600">We leverage technology and best practices to continuously improve care.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Healthcare team collaborating on patient care plans"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We envision a healthcare system where preventive care through better nurse-led engagement becomes the standard, not the exception. Our goal is to transform how chronic disease management is delivered by making it more accessible, effective, and sustainable.
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Preventive Care Focus</h3>
                <p className="text-slate-600">
                  By catching health issues early and providing continuous support, we help prevent costly emergency interventions and hospitalizations.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Nurse-Led Engagement</h3>
                <p className="text-slate-600">
                  Our registered nurses provide the clinical expertise and compassionate care that patients need to successfully manage their chronic conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Leadership Team</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our experienced healthcare professionals bring decades of clinical expertise and healthcare innovation to every partnership.
            </p>
          </div>

          {/* Placeholder for future team member profiles */}
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="text-center bg-white border-none shadow-sm">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Team Member</h3>
                  <p className="text-slate-600 mb-4">Leadership Position</p>
                  <p className="text-sm text-slate-500">
                    Detailed team member biographies and professional backgrounds will be featured here.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Patient Care?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the growing network of healthcare providers who are improving patient outcomes and generating sustainable revenue with Lynk Health.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Start Your Partnership Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
