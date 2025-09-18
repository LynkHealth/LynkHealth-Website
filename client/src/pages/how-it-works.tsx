import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ClipboardList, Users, Link as LinkIcon, Rocket, Check } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">How It Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined 3-step process makes it easy for healthcare providers to start generating revenue while improving patient outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Simple 3-Step Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From patient identification to billing, we handle the entire care coordination process seamlessly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-healthcare-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
                  1
                </div>
                {/* Connection line - hidden on mobile */}
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Identify Patients</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We help you identify eligible Medicare patients with multiple chronic conditions who would benefit from care coordination services. Our team handles eligibility verification and enrollment.
                </p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-healthcare-primary">
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Timeline:</strong> 1-2 weeks for patient screening and enrollment setup
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-healthcare-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
                  2
                </div>
                {/* Connection line - hidden on mobile */}
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Engage & Monitor</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our licensed nurses provide ongoing care coordination, medication management, and health monitoring. Patients receive 24/7 access to their care team and regular check-ins.
                </p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-healthcare-secondary">
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Service Delivery:</strong> 24/7 support with regular monthly contact and real-time monitoring
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-healthcare-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
                  3
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Bill & Track</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We handle all CMS billing, documentation, and compliance requirements. You receive detailed reports on patient outcomes and revenue generation, with full transparency on all activities.
                </p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-healthcare-accent">
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Revenue Cycle:</strong> Monthly billing with transparent reporting and analytics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Onboarding Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Clinic Onboarding Explained</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive onboarding process ensures your team is fully prepared to succeed with care coordination services.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-healthcare-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Initial Assessment</h3>
                  <p className="text-muted-foreground">
                    We conduct a thorough assessment of your current patient population, EHR system, and workflow to customize our services to your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-healthcare-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="w-6 h-6 text-healthcare-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Staff Training</h3>
                  <p className="text-muted-foreground">
                    Your team receives comprehensive training on care coordination workflows, patient communication, and our technology platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-healthcare-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <LinkIcon className="w-6 h-6 text-healthcare-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">System Integration</h3>
                  <p className="text-muted-foreground">
                    We integrate our platform with your existing EHR system for seamless data flow and minimal workflow disruption.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Rocket className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Program Launch</h3>
                  <p className="text-muted-foreground">
                    We begin with a pilot group of patients to ensure smooth operations before scaling to your full patient population.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">What You Get</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-muted-foreground">
                  <Check className="w-4 h-4 text-healthcare-secondary mr-3" />
                  Dedicated implementation manager
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Check className="w-4 h-4 text-healthcare-secondary mr-3" />
                  Custom workflow development
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Check className="w-4 h-4 text-healthcare-secondary mr-3" />
                  EHR integration and setup
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Check className="w-4 h-4 text-healthcare-secondary mr-3" />
                  Staff training and certification
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Check className="w-4 h-4 text-healthcare-secondary mr-3" />
                  Marketing materials for patients
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Check className="w-4 h-4 text-healthcare-secondary mr-3" />
                  Ongoing support and optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Sample Implementation Timeline</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial consultation to full program launch, here's what you can expect during the implementation process.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-12">
              {/* Week 1 */}
              <div className="relative flex items-center">
                <div className="w-8 h-8 bg-healthcare-primary rounded-full flex items-center justify-center text-white text-sm font-bold absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                  1
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Week 1: Discovery & Planning</h3>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Initial consultation and needs assessment</li>
                      <li>• Patient population analysis</li>
                      <li>• EHR system review</li>
                      <li>• Custom implementation plan development</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week 2-3 */}
              <div className="relative flex items-center md:justify-end">
                <div className="w-8 h-8 bg-healthcare-secondary rounded-full flex items-center justify-center text-white text-sm font-bold absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                  2
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Weeks 2-3: Setup & Integration</h3>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• EHR integration and testing</li>
                      <li>• Staff training sessions</li>
                      <li>• Patient identification and outreach materials</li>
                      <li>• Billing setup and verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week 4 */}
              <div className="relative flex items-center">
                <div className="w-8 h-8 bg-healthcare-accent rounded-full flex items-center justify-center text-white text-sm font-bold absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                  3
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Week 4: Pilot Launch</h3>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Pilot group patient enrollment</li>
                      <li>• Initial care coordination services</li>
                      <li>• Workflow optimization</li>
                      <li>• Performance monitoring and adjustments</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week 5+ */}
              <div className="relative flex items-center md:justify-end">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                  4
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Week 5+: Full Scale Launch</h3>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Program expansion to full patient population</li>
                      <li>• Ongoing support and optimization</li>
                      <li>• Monthly performance reviews</li>
                      <li>• Revenue tracking and reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-healthcare-primary to-healthcare-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join healthcare providers across the country who are improving patient outcomes and generating additional revenue with our care coordination services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-healthcare-primary hover:bg-slate-100">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/services/ccm">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-healthcare-primary">
                Explore Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
