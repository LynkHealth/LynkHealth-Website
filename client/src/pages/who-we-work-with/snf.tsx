import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { 
  Heart, 
  Activity, 
  Users, 
  TrendingDown, 
  CheckCircle, 
  DollarSign,
  Clock,
  Shield,
  HeartPulse,
  ArrowRight,
  Hospital,
  Stethoscope
} from "lucide-react";

export default function SNFPage() {
  return (
    <>
      <SEOHead
        title="Skilled Nursing Facilities - Post-Acute Care Coordination | Lynk Health"
        description="Enhance your SNF's care delivery with comprehensive care coordination. Reduce hospital readmissions, improve Star Ratings, and support successful discharges to home."
        canonicalUrl="https://lynk.health/snf"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Care Coordination for Skilled Nursing Facilities
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Reduce hospital readmissions, improve Star Ratings, and support successful transitions to home with comprehensive care coordination services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-slate-100 font-semibold"
                  asChild
                  data-testid="button-get-started"
                >
                  <Link href="/contact">Partner With Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
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

        {/* Impact Metrics */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">35%</div>
                  <p className="text-slate-600">Reduction in hospital readmissions</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">$2,457</div>
                  <p className="text-slate-600">Annual savings per resident</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">92%</div>
                  <p className="text-slate-600">Resident & family satisfaction</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <HeartPulse className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">+15%</div>
                  <p className="text-slate-600">Improvement in clinical quality measures</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services for SNFs */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Comprehensive Care Coordination for Post-Acute Care
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Support your residents across the entire care continuum
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
                    Ongoing coordination for residents with multiple chronic conditions to prevent complications.
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
                    Continuous vital sign tracking for high-risk residents with real-time escalation alerts.
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
                    Mental health screening and support for residents with depression, anxiety, or dementia.
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
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Overnight On-Call Coverage</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    After-hours triage and remote nocturnist support to reduce unnecessary ER transfers.
                  </p>
                  <Link href="/overnight-on-call" className="text-primary font-semibold hover:underline">
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
                    <h3 className="text-xl font-bold text-slate-900">Chronic Wound Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Coordinated wound care with conservative products, advanced therapies, and progress monitoring.
                  </p>
                  <Link href="/chronic-wound-management" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Care Transition Support</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Seamless coordination between hospital, SNF, and home to prevent readmissions.
                  </p>
                  <Link href="/how-it-works" className="text-primary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why SNFs Choose Lynk */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Why SNFs Choose Lynk Health
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <TrendingDown className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Reduce Hospital Readmissions</h3>
                      <p className="text-slate-600">
                        Lower your 30-day readmission rate by 35% with proactive monitoring and early intervention.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg flex-shrink-0">
                      <Hospital className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Improve Star Ratings</h3>
                      <p className="text-slate-600">
                        Enhance clinical quality measures for better CMS Star Ratings and competitive advantage.
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
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">No Staff Burden</h3>
                      <p className="text-slate-600">
                        We provide the nurses and technology—your staff focuses on direct resident care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Additional Revenue Stream</h3>
                      <p className="text-slate-600">
                        Generate CMS-covered revenue through care coordination billing without overhead costs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Integration Benefits */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                  Seamless Integration with Your EHR
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Our platform integrates with PointClickCare, MatrixCare, and other long-term care EHR systems for streamlined documentation.
                </p>
                <ul className="space-y-4">
                  {[
                    "Automated resident identification and enrollment",
                    "Real-time clinical documentation in your EHR",
                    "Alert escalation to your nursing staff and physicians",
                    "Comprehensive progress notes for care planning",
                    "Quality reporting and analytics dashboards",
                    "Full HIPAA compliance and SOC 2 certification"
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
                  src="/images/AdobeStock_400795942_1751485954824.jpeg"
                  alt="SNF Care Coordination"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enhance Your Post-Acute Care Delivery
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Partner with Lynk Health to reduce readmissions and improve resident outcomes.
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
