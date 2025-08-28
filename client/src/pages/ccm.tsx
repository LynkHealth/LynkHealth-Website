import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Clock, Users, DollarSign, CheckCircle, Phone, Calendar, Shield, Heart } from "lucide-react";
import ccmIllustration from "@/assets/graphics/ccm-illustration.svg";
import healthcareDashboard from "@/assets/graphics/healthcare-dashboard.svg";

export default function CCM() {
  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Revenue Generation",
      description: "Generate $99+ per patient per month with CMS-covered CCM services"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Efficiency",
      description: "Our nurses handle 20+ minutes of monthly care coordination"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Patient Engagement",
      description: "Improved medication adherence and health outcomes"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Reduction",
      description: "Fewer hospitalizations and emergency room visits"
    }
  ];

  const features = [
    "24/7 access to registered nurses",
    "Monthly comprehensive care plan reviews",
    "Medication management and adherence monitoring",
    "Care transition support",
    "Provider communication and coordination",
    "Emergency response protocols",
    "Health education and self-management support",
    "Documentation and billing compliance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <div className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
                  CMS Approved Program
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Chronic Care Management
                <span className="text-primary"> That Actually Works</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Turnkey Medicare Chronic Care Management (CCM) program for healthcare providers nationwide. 
                Zero upfront costs, seamless EHR integration, and dedicated nurses who understand your patients' communities—generating $50+ per patient monthly in new revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/#contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                    Launch CCM Program
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                  Program Details
                </Button>
              </div>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">$42+ per patient/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">20+ minutes monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">24/7 care team access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Local RN coordination</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/AdobeStock_279901729_1751485954797.jpeg"
                  alt="Professional nurse providing comprehensive chronic care management to Medicare patient"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-foreground mb-2">Comprehensive Care Coordination</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our registered nurses provide monthly care plan reviews and ongoing support for Medicare patients with chronic conditions.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">RN Led</span>
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is CCM Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                  Medicare Program
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What is Chronic Care Management?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Chronic Care Management (CCM) is a Medicare-covered service designed to coordinate care for patients with multiple chronic conditions. The program requires at least 20 minutes of clinical staff time per month and focuses on comprehensive care planning, medication management, and care transitions.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our white-labeled CCM program integrates seamlessly with your practice, providing experienced registered nurses who work under your supervision to deliver high-quality care coordination while generating sustainable revenue.
              </p>
              
              {/* CMS Requirements */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-foreground mb-4">CMS Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Two or more chronic conditions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Expected to last 12+ months</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Substantial risk of decline</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">20+ minutes monthly care coordination</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={healthcareDashboard}
                alt="Healthcare dashboard showing patient management interface"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                Program Benefits
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why Choose Our CCM Program?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Partner with experienced healthcare professionals who understand the complexities of chronic care management and Medicare billing requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-105 transition-transform">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                  Comprehensive Care
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Complete CCM Services
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our comprehensive CCM program covers all aspects of chronic care management, from initial patient enrollment to ongoing care coordination and Medicare billing compliance.
              </p>
              
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3 w-3 text-secondary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-3xl p-8 text-white">
              <div className="mb-6">
                <Heart className="h-12 w-12 text-white/80 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Patient-Centered Care</h3>
                <p className="text-white/90">
                  Our registered nurses build meaningful relationships with patients, providing personalized care coordination that improves health outcomes and quality of life.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">92%</div>
                  <div className="text-white/80 text-sm">Patient Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">35%</div>
                  <div className="text-white/80 text-sm">Fewer ER Visits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">28%</div>
                  <div className="text-white/80 text-sm">Reduced Hospitalizations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">89%</div>
                  <div className="text-white/80 text-sm">Medication Adherence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CPT Codes Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              CCM CPT Codes & Reimbursement Rates
            </h2>
            <p className="text-lg text-muted-foreground">
              2025 Medicare reimbursement rates for Chronic Care Management services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Primary CCM Codes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Primary CCM Codes</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99490 - CCM Initial Month</h4>
                        <p className="text-sm text-muted-foreground">First month of CCM services</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$42</Badge>
                    </div>
                    <p className="text-sm">Minimum 20 minutes of clinical staff time for care management services. Includes comprehensive care plan development.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99491 - CCM Subsequent Months</h4>
                        <p className="text-sm text-muted-foreground">Ongoing monthly CCM</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">$35</Badge>
                    </div>
                    <p className="text-sm">Minimum 20 minutes of clinical staff time for ongoing care management and care plan refinement.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99487 - Complex CCM Initial</h4>
                        <p className="text-sm text-muted-foreground">First month - complex patients</p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">$94</Badge>
                    </div>
                    <p className="text-sm">Minimum 60 minutes for patients with complex medical conditions requiring extensive care coordination.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional CCM Codes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Additional CCM Codes</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99489 - Additional 30 Minutes</h4>
                        <p className="text-sm text-muted-foreground">Add-on for complex CCM</p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">$47</Badge>
                    </div>
                    <p className="text-sm">Each additional 30 minutes of clinical staff time for complex care management (use with 99487).</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99495 - Transitional Care</h4>
                        <p className="text-sm text-muted-foreground">Post-discharge management</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$165</Badge>
                    </div>
                    <p className="text-sm">Post-hospital discharge transitional care management services within 14 days of discharge.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99496 - Transitional Care Complex</h4>
                        <p className="text-sm text-muted-foreground">High complexity post-discharge</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$230</Badge>
                    </div>
                    <p className="text-sm">High complexity transitional care management requiring medical decision making within 7 days.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Revenue Example */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  CCM Revenue Example (500 patients)
                </h3>
                <p className="text-muted-foreground">
                  Typical monthly revenue potential for active CCM patients
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Standard CCM (400 patients)</div>
                  <div className="text-3xl font-bold text-primary mb-2">$14,000</div>
                  <div className="text-xs text-muted-foreground">$35 × 400 patients/month</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Complex CCM (100 patients)</div>
                  <div className="text-3xl font-bold text-secondary mb-2">$9,400</div>
                  <div className="text-xs text-muted-foreground">$94 × 100 patients/month</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Transitional Care (50/month)</div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">$8,250</div>
                  <div className="text-xs text-muted-foreground">$165 × 50 patients/month</div>
                </div>
              </div>
              
              <div className="text-center mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-lg font-semibold text-foreground">Total Monthly CCM Revenue</div>
                <div className="text-4xl font-bold text-primary">$31,650</div>
                <div className="text-sm text-muted-foreground mt-2">Annual Revenue: $379,800</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
              Get Started Today
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Launch Your CCM Program?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Partner with Lynk Health to provide comprehensive chronic care management services that improve patient outcomes while generating sustainable revenue for your practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Start Partnership
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}