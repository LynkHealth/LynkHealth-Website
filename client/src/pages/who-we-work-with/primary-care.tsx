import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { 
  Heart, 
  Activity, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  Clock,
  Shield,
  Stethoscope,
  ArrowRight
} from "lucide-react";

export default function PrimaryCarePage() {
  return (
    <>
      <SEOHead
        title="Primary Care Practices - Care Coordination Solutions | Lynk Health"
        description="Enhance your primary care practice with comprehensive care coordination services. Improve patient outcomes, generate additional revenue, and reduce administrative burden with Lynk Health's nurse-led programs."
        canonicalUrl="https://lynk.health/primary-care"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Care Coordination for Primary Care Practices
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Expand your care capabilities, improve patient outcomes, and generate additional revenue through CMS-covered care coordination services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-slate-100 font-semibold"
                  asChild
                  data-testid="button-get-started"
                >
                  <Link href="/contact">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                  data-testid="button-learn-more"
                >
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">$2,457</div>
                  <p className="text-slate-600">Annual cost reduction per patient</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">35%</div>
                  <p className="text-slate-600">Reduction in ER visits</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <Heart className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">92%</div>
                  <p className="text-slate-600">Patient satisfaction rate</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">98%</div>
                  <p className="text-slate-600">Patient retention rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services for Primary Care */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Services Tailored for Primary Care
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our comprehensive suite of CMS-covered services integrates seamlessly with your practice
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Care Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Monthly touchpoints for patients with 2+ chronic conditions, improving adherence and outcomes.
                  </p>
                  <Link href="/ccm" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Remote Patient Monitoring</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    FDA-approved devices track vital signs and physiological data between office visits.
                  </p>
                  <Link href="/monitoring" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Behavioral Health Integration</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Integrated mental health support for patients with anxiety, depression, and substance use.
                  </p>
                  <Link href="/bhi" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Advanced Primary Care Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    CMS's newest 2025 program for complex patients requiring intensive care coordination.
                  </p>
                  <Link href="/apcm" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Overnight On-Call Coverage</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    After-hours telephone triage and remote nocturnist coverage for your patient panel.
                  </p>
                  <Link href="/overnight-on-call" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Wound Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Coordinated wound care with conservative products, advanced therapies, and monitoring.
                  </p>
                  <Link href="/chronic-wound-management" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Lynk */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Why Primary Care Practices Choose Lynk Health
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Additional Revenue Stream</h3>
                      <p className="text-slate-600">
                        Generate CMS-covered revenue through care coordination services without adding staff or overhead costs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg flex-shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Zero Administrative Burden</h3>
                      <p className="text-slate-600">
                        We handle patient enrollment, billing, documentation, and all compliance requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Local Nurse-Led Care</h3>
                      <p className="text-slate-600">
                        Professional nurses from your community build authentic relationships with your patients.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Improved Patient Outcomes</h3>
                      <p className="text-slate-600">
                        Reduce ER visits by 35%, improve medication adherence, and enhance overall health outcomes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                  Everything You Need, Nothing You Don't
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  We provide a complete care coordination solution that integrates with your existing workflows and enhances your practice without disruption.
                </p>
                <ul className="space-y-4">
                  {[
                    "No upfront costs or technology investments required",
                    "Seamless EHR integration with your existing systems",
                    "Monthly detailed reports for each enrolled patient",
                    "Dedicated support team available 24/7",
                    "Full compliance with HIPAA, CMS, and SOC 2 standards",
                    "Flexible program start with scalable patient enrollment"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <img
                  src="/images/AdobeStock_608138220_1759253732062.jpeg"
                  alt="Primary Care Practice"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Primary Care Practice?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join 65+ healthcare providers serving 25,000+ patients with comprehensive care coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-100 font-semibold"
                asChild
                data-testid="button-partner-cta"
              >
                <Link href="/contact">Partner With Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
                data-testid="button-calculate-revenue"
              >
                <Link href="/calculator">Calculate Your Revenue</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
