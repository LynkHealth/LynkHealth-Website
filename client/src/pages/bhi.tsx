import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Heart, CheckCircle, Clock, Phone, TrendingUp, Smile, DollarSign } from "lucide-react";
import bhiIllustration from "@/assets/graphics/bhi-illustration.svg";

export default function BHI() {
  const services = [
    {
      icon: <Smile className="h-6 w-6" />,
      title: "Depression Screening",
      description: "Systematic assessment using validated tools like PHQ-9 and GAD-7"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Anxiety Management",
      description: "Evidence-based interventions for anxiety disorders and panic symptoms"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Crisis Intervention",
      description: "24/7 emergency support for behavioral health crises and safety planning"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Care Coordination",
      description: "Seamless integration between primary care and behavioral health providers"
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Improved Outcomes",
      description: "Integrated care leads to better mental health and medical outcomes"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Early Intervention",
      description: "Proactive identification and treatment of behavioral health issues"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Reduced Stigma",
      description: "Low-stigma approach encourages patient engagement and participation"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Continuous Support",
      description: "Ongoing behavioral health coordination between medical visits"
    }
  ];

  const bhiFeatures = [
    "Comprehensive behavioral health assessments",
    "Evidence-based screening tools (PHQ-9, GAD-7)",
    "Crisis intervention and safety planning",
    "Medication adherence support",
    "Care team communication and coordination",
    "Provider consultation and recommendations",
    "Patient education and self-management",
    "Medicare billing compliance and documentation"
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
                  Behavioral Health Integration
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Behavioral Health 
                <span className="text-primary"> Integration (BHI)</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Comprehensive behavioral health support integrated into primary care settings that generates additional revenue streams. 
                Our licensed professionals—never call centers—provide mental health screening, intervention, and ongoing support using a low-stigma, collaborative approach that patients trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/#contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                    Launch BHI Program
                  </Button>
                </Link>
                <Link href="/calculator">
                  <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Calculate Revenue
                  </Button>
                </Link>
              </div>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Integrated care model</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Licensed professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Low-stigma approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">24/7 crisis support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/AdobeStock_553516145_1751485954797.jpeg"
                  alt="Licensed healthcare professional providing integrated behavioral health support to patient"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-foreground mb-2">Behavioral Health Integration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Licensed professionals provide mental health screening and support using a low-stigma, integrated approach within primary care.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Low Stigma</span>
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">Integrated Care</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is BHI Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                  Integrated Care
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Behavioral Health Integration
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Behavioral Health Integration combines medical and behavioral health care in primary care settings. 
                This collaborative approach addresses mental health conditions alongside physical health issues, 
                providing comprehensive patient care that improves outcomes and reduces stigma.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our BHI program includes licensed behavioral health coordinators who work directly with your care team 
                to provide screening, brief interventions, care coordination, and ongoing support for patients with 
                behavioral health needs.
              </p>
              
              {/* Evidence Base */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-foreground mb-4">Evidence-Based Approach</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">50% improvement in depression outcomes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Reduced healthcare costs and utilization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Higher patient satisfaction scores</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Improved medication adherence</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white border border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-3 text-primary group-hover:scale-105 transition-transform">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
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
              Why Integrate Behavioral Health?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Address the growing mental health needs of your patients while improving overall health outcomes 
              and practice efficiency through our integrated behavioral health program.
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
                  Comprehensive Support
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Complete BHI Services
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our behavioral health integration program provides comprehensive support for patients with mental health conditions, 
                substance use disorders, and behavioral health challenges within the primary care setting.
              </p>
              
              <div className="grid gap-4">
                {bhiFeatures.map((feature, index) => (
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
                <h3 className="text-2xl font-bold mb-2">Holistic Care Approach</h3>
                <p className="text-white/90">
                  Our integrated model addresses both physical and mental health needs, 
                  creating a comprehensive care experience that improves patient outcomes and satisfaction.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">75%</div>
                  <div className="text-white/80 text-sm">Improved Screening</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">60%</div>
                  <div className="text-white/80 text-sm">Better Adherence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">45%</div>
                  <div className="text-white/80 text-sm">Reduced Symptoms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-white/80 text-sm">Crisis Support</div>
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
              BHI CPT Codes & Reimbursement Rates
            </h2>
            <p className="text-lg text-muted-foreground">
              2025 Medicare reimbursement rates for Behavioral Health Integration services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Primary BHI Codes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Primary BHI Codes</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99492 - BHI Initial Assessment</h4>
                        <p className="text-sm text-muted-foreground">First month of BHI services</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$140</Badge>
                    </div>
                    <p className="text-sm">Initial behavioral health assessment and care planning by clinical staff under physician supervision.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99493 - BHI Subsequent Months</h4>
                        <p className="text-sm text-muted-foreground">Ongoing monthly BHI</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">$95</Badge>
                    </div>
                    <p className="text-sm">Ongoing behavioral health care management including assessment, care planning, and coordination.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99494 - BHI Crisis Response</h4>
                        <p className="text-sm text-muted-foreground">Emergency intervention</p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">$85</Badge>
                    </div>
                    <p className="text-sm">Crisis intervention and safety planning for behavioral health emergencies (per incident).</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Collaborative Care Codes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center text-primary">✓ Primary BHI Code - Lynk Health Team</h3>
              <div className="space-y-4">
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-primary">99484 - CoCM Initial</h4>
                        <p className="text-sm text-muted-foreground">First month collaborative care</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$165</Badge>
                    </div>
                    <p className="text-sm">Initial month of collaborative care management with psychiatric consultation and care coordination.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99492 - CoCM Subsequent</h4>
                        <p className="text-sm text-muted-foreground">Ongoing collaborative care</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">$125</Badge>
                    </div>
                    <p className="text-sm">Subsequent months of collaborative care management with ongoing psychiatric consultation.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">99495 - Psychiatric Consultation</h4>
                        <p className="text-sm text-muted-foreground">Per consultation session</p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">$115</Badge>
                    </div>
                    <p className="text-sm">Psychiatric consultation for complex cases requiring specialist input and treatment adjustment.</p>
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
                  BHI Revenue Example (200 patients)
                </h3>
                <p className="text-muted-foreground">
                  Typical monthly revenue potential for active BHI patients
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Standard BHI (150 patients)</div>
                  <div className="text-3xl font-bold text-primary mb-2">$14,250</div>
                  <div className="text-xs text-muted-foreground">$95 × 150 patients/month</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Collaborative Care (50 patients)</div>
                  <div className="text-3xl font-bold text-secondary mb-2">$6,250</div>
                  <div className="text-xs text-muted-foreground">$125 × 50 patients/month</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Crisis Interventions (20/month)</div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">$1,700</div>
                  <div className="text-xs text-muted-foreground">$85 × 20 incidents/month</div>
                </div>
              </div>
              
              <div className="text-center mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-lg font-semibold text-foreground">Total Monthly BHI Revenue</div>
                <div className="text-4xl font-bold text-primary">$22,200</div>
                <div className="text-sm text-muted-foreground mt-2">Annual Revenue: $266,400</div>
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
              Integrated Care Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Integrate Behavioral Health?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform your practice with integrated behavioral health services that address the complete spectrum 
            of patient needs while improving outcomes and generating sustainable revenue.
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