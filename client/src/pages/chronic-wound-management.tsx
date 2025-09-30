import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bandage, Activity, Package, Microscope, Shield, Users, Phone, Mail, CheckCircle, Heart, Clock, Hospital, Stethoscope, TrendingUp, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function ChronicWoundManagement() {
  const services = [
    {
      image: "/images/elderly-patient-care.jpeg",
      title: "Conservative Wound Care Products",
      description: "Accelerate wound healing with our comprehensive portfolio of proven wound care supplies and dressings. From standard dressings to advanced NPWT/DME, we deliver the right products fast with usage guidance and seamless re-supply coordination. Our clinical experts guide your staff through every application, ensuring optimal outcomes while minimizing infection risk and reducing overall treatment costs.",
      benefits: [
        "Fast product delivery",
        "Usage training & guidance",
        "Re-supply coordination",
        "Reduced infection risk",
        "Expert clinical support",
        "Lower treatment costs"
      ],
      icon: <Package className="h-6 w-6" />
    },
    {
      image: "/images/AdobeStock_419808796_1751485954770.jpeg",
      title: "Advanced Wound Therapies",
      description: "Transform patient outcomes with access to cutting-edge biologic skin grafts, substitutes, and advanced healing solutions through our trusted partner network. When conservative care isn't enough, we coordinate rapid access to skin substitutes, grafts, and biologics that promote tissue regeneration and accelerate closure. Complete with clear escalation pathways and reimbursement guidance to ensure every patient gets the advanced care they need.",
      benefits: [
        "Access to skin grafts & substitutes",
        "Biologic healing solutions",
        "Rapid coordination through partners",
        "Clear escalation pathways",
        "Reimbursement guidance",
        "Proven tissue regeneration"
      ],
      icon: <Microscope className="h-6 w-6" />
    },
    {
      image: "/images/AdobeStock_400007631_1751485954795.jpeg",
      title: "Remote Wound Monitoring",
      description: "Keep wounds on track between visits with comprehensive remote monitoring that tracks progress, adherence, and warning signs. Our secure platform enables photo/measurement capture, adherence tracking, and real-time escalation when healing stalls. Structured summary reports integrate seamlessly with your EMR workflows while reducing avoidable office visits and complications.",
      benefits: [
        "Photo & measurement tracking",
        "Real-time adherence monitoring",
        "Automated escalation alerts",
        "EMR-ready summary reports",
        "Reduced office visits",
        "Early complication detection"
      ],
      icon: <Activity className="h-6 w-6" />
    },
    {
      image: "/images/elderly-behavioral-health.jpeg",
      title: "Chronic Care Management (CCM) for Wound Patients",
      description: "Support longitudinal healing with Medicare-covered CCM services that keep patients engaged and compliant between appointments. Our dedicated care managers provide monthly touchpoints, medication management, comorbidity support, and patient education—all while keeping you in the loop with structured provider updates. This turnkey solution is 100% Medicare reimbursable with no cost to your practice.",
      benefits: [
        "Monthly patient touchpoints",
        "Medication & comorbidity support",
        "Patient education & engagement",
        "Closed-loop provider updates",
        "Medicare reimbursable",
        "No extra staff workload"
      ],
      icon: <Heart className="h-6 w-6" />
    }
  ];

  const whyProviders = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "End-to-End Pathway",
      description: "One referral connects patients to products, therapies, monitoring, and CCM—all coordinated through Lynk"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Less Administrative Burden",
      description: "We handle coordination, supply logistics, and monitoring so your team can focus on clinical care"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Closed-Loop Communication",
      description: "Structured data summaries and provider updates integrate with your EMR workflows"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Reimbursement Guidance",
      description: "We provide coding and billing support for eligible Medicare-covered services"
    }
  ];

  const patientOutcomes = [
    "Faster wound healing with fewer complications",
    "Better adherence through continuous support",
    "Reduced ER visits and hospitalizations",
    "Clear escalation when healing stalls",
    "Access to advanced therapies when needed",
    "Improved quality of life and independence"
  ];

  return (
    <>
      <SEOHead
        title="Chronic Wound Management | Lynk Health"
        description="Comprehensive wound care coordination powered by remote monitoring and CCM—connecting patients to conservative supplies and advanced therapies through our partner network."
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-primary to-secondary overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/elderly-patient-care.jpeg')] opacity-10 bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30" data-testid="badge-wound-care">
                <Bandage className="w-4 h-4 mr-2" />
                Chronic Wound Management
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white" data-testid="heading-wound-care">
                Comprehensive Wound Care Coordination
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Connecting providers, patients, and partners through coordinated wound care—from conservative supplies to advanced therapies, powered by remote monitoring and CCM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-slate-100 font-semibold px-8 py-6 text-lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-contact-us-hero"
                >
                  Contact Us
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
                  asChild
                  data-testid="button-learn-more"
                >
                  <Link href="/contact">Partner With Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Your Role: Advance Patient Care Through Coordination
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Chronic wounds demand consistent, coordinated care across multiple touchpoints. Practices often juggle supplies, advanced therapies, and follow-ups without a simple way to keep everyone aligned. <strong>Lynk Health</strong> acts as the central coordinator—connecting patients to the right products and therapies while maintaining continuous monitoring and CCM support throughout the healing journey.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        {services.map((service, index) => (
          <section 
            key={index} 
            className={`py-16 lg:py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  />
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-4">
                      {service.icon}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Key Benefits:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-2 mt-0.5" />
                          <span className="text-slate-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Summary Cards */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Four Pillars of Wound Care Coordination
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Every element working together to support healing and improve outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-xl transition-shadow border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">1. Conservative Products</h3>
                  <p className="text-slate-600">Dressings, wraps, and DME delivered with training and re-supply support</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Microscope className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">2. Advanced Therapies</h3>
                  <p className="text-slate-600">Grafts, substitutes, and biologics via partner network escalation</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <Activity className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">3. Remote Monitoring</h3>
                  <p className="text-slate-600">Continuous wound progress tracking with automated alerts</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">4. CCM Backbone</h3>
                  <p className="text-slate-600">Medicare-covered monthly touchpoints for longitudinal support</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Providers Choose Lynk */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Why Providers Choose Lynk
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {whyProviders.map((item, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-8">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
                        <p className="text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Patient Outcomes */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Better Patient Outcomes
                </h2>
                <p className="text-xl text-white/90 leading-relaxed">
                  Our coordinated approach delivers measurable improvements in healing times, patient satisfaction, and overall quality of life—while reducing costly complications and hospital readmissions.
                </p>
              </div>
              <div>
                <ul className="space-y-4">
                  {patientOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mr-3 mt-0.5" />
                      <span className="text-lg">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Who We Serve
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Stethoscope className="h-8 w-8" />, title: "Primary Care & Specialty", desc: "Endocrinology, Vascular, Podiatry clinics" },
                { icon: <Hospital className="h-8 w-8" />, title: "Hospitals", desc: "Post-discharge and transitional care" },
                { icon: <Heart className="h-8 w-8" />, title: "SNF & Long-Term Care", desc: "Continuous wound management" },
                { icon: <Users className="h-8 w-8" />, title: "Home Health", desc: "In-home coordination services" }
              ].map((setting, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8">
                    <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                      {setting.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-900">{setting.title}</h3>
                    <p className="text-slate-600">{setting.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* HCPCS Q Codes Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                HCPCS Q Codes - Amnion Skin/510K Graft Products
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                We coordinate access to advanced wound care products through our partner network
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Tiger Biosciences Products */}
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-4">
                      <Microscope className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Tiger Biosciences</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4325</span>
                        <span className="text-slate-600"> - ACA Patch</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4323</span>
                        <span className="text-slate-600"> - alloPLY</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4322</span>
                        <span className="text-slate-600"> - caregraFT</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">A2024</span>
                        <span className="text-slate-600"> - Resolve Matrix 510K Graft (Extremity Care)</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">A6023</span>
                        <span className="text-slate-600"> - Encore Surgical Dressings</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">A6010</span>
                        <span className="text-slate-600"> - Encore Surgical Dressings</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SurgeneX Products */}
              <Card className="border-2 border-secondary/20">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-4">
                      <Microscope className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">SurgeneX</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4320</span>
                        <span className="text-slate-600"> - Pellograft</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4321</span>
                        <span className="text-slate-600"> - Renograft</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4319</span>
                        <span className="text-slate-600"> - Sanograft</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4317</span>
                        <span className="text-slate-600"> - Vitograft</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4269</span>
                        <span className="text-slate-600"> - Surgraft XT</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4268</span>
                        <span className="text-slate-600"> - Surgraft FT</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4263</span>
                        <span className="text-slate-600"> - Surgraft TL</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4265</span>
                        <span className="text-slate-600"> - NeoStim TL</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4266</span>
                        <span className="text-slate-600"> - NeoStim</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Q4267</span>
                        <span className="text-slate-600"> - NeoStim DL</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Contact us to learn more about accessing these advanced wound care products for your patients
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Ready to Transform Wound Care?
              </h2>
              <p className="text-lg text-slate-600">
                Connect with our team to learn how we can coordinate comprehensive wound care for your patients.
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-3 text-slate-900">
                      <Phone className="w-6 h-6 text-primary" />
                      <a 
                        href="tel:+16018594342" 
                        className="text-xl font-semibold hover:text-primary transition-colors"
                        data-testid="link-phone"
                      >
                        (601) 859-4342
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-3 text-slate-900">
                      <Mail className="w-6 h-6 text-primary" />
                      <a 
                        href="mailto:hello@lynk.health" 
                        className="text-xl font-semibold hover:text-primary transition-colors"
                        data-testid="link-email"
                      >
                        hello@lynk.health
                      </a>
                    </div>
                  </div>

                  <div className="pt-6 border-t text-center">
                    <p className="text-slate-600 mb-4">
                      For referrals through our partner network:
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white font-semibold"
                      asChild
                      data-testid="button-partner-referral"
                    >
                      <Link href="/contact">Contact Our Partner Team</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-slate-500">
              <p>
                We coordinate with your existing referral partners or can connect you to our trusted network.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Providers Advancing Wound Care
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Connect your patients to coordinated, comprehensive wound care that improves outcomes and reduces complications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-100 font-semibold"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-get-started"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
                data-testid="button-learn-more-footer"
              >
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
