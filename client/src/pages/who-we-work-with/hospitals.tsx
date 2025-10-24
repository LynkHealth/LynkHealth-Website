import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { 
  Hospital, 
  Activity, 
  Users, 
  TrendingDown, 
  CheckCircle, 
  DollarSign,
  Clock,
  Shield,
  HeartPulse,
  ArrowRight,
  Star,
  FileText
} from "lucide-react";

export default function HospitalsPage() {
  return (
    <>
      <SEOHead
        title="Hospitals & Health Systems - Reduce Readmissions | Lynk Health"
        description="Partner with Lynk Health to reduce hospital readmissions, improve patient outcomes, and enhance care transitions. Comprehensive post-discharge care coordination for health systems."
        canonicalUrl="https://lynk.health/hospitals"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Reduce Readmissions with Comprehensive Care Transitions
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Partner with Lynk Health to bridge the gap between hospital discharge and home care, reducing costly readmissions while improving patient outcomes and satisfaction.
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Measurable Impact on Your Key Metrics
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">35%</div>
                  <p className="text-slate-600">Reduction in 30-day readmissions</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">$2,457</div>
                  <p className="text-slate-600">Annual cost savings per patient</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Star className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">+8%</div>
                  <p className="text-slate-600">HCAHPS score improvement</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">48 hrs</div>
                  <p className="text-slate-600">First post-discharge contact</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Care Transition Services */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Comprehensive Post-Discharge Care Coordination
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Close care gaps and reduce readmission risk with our integrated care transition program
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">48-Hour Follow-Up</h3>
                  </div>
                  <p className="text-slate-600">
                    Nurse outreach within 48 hours of discharge to review medications, answer questions, and identify red flags.
                  </p>
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
                  <p className="text-slate-600">
                    Continuous vital sign tracking post-discharge with automated escalation for concerning trends.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Medication Reconciliation</h3>
                  </div>
                  <p className="text-slate-600">
                    Complete medication review to prevent adverse drug events and ensure prescription fulfillment.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Care Team Coordination</h3>
                  </div>
                  <p className="text-slate-600">
                    Seamless handoffs between hospital, PCP, specialists, and home health to ensure continuity.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Disease Management</h3>
                  </div>
                  <p className="text-slate-600">
                    Ongoing CCM for high-risk patients with chronic conditions to prevent future hospitalizations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Social Determinants Support</h3>
                  </div>
                  <p className="text-slate-600">
                    Address transportation, housing, food security, and other barriers to successful recovery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Hospitals Choose Lynk */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Why Health Systems Choose Lynk Health
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <TrendingDown className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Reduce Readmission Penalties</h3>
                      <p className="text-slate-600">
                        Avoid Medicare penalties with proven 35% reduction in 30-day readmissions for high-risk patients.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg flex-shrink-0">
                      <Star className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Improve Star Ratings</h3>
                      <p className="text-slate-600">
                        Enhance HCAHPS scores and Star Ratings through better care transitions and patient communication.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg flex-shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Value-Based Care Success</h3>
                      <p className="text-slate-600">
                        Excel in ACO and bundled payment models with reduced costs and improved quality metrics.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Scalable Solution</h3>
                      <p className="text-slate-600">
                        Deploy across your entire health system with no capital investment or technology implementation required.
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
                  Seamless EHR Integration
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Our platform integrates directly with your Epic, Cerner, or Meditech system for real-time data exchange and streamlined workflows.
                </p>
                <ul className="space-y-4">
                  {[
                    "Automated ADT feeds for discharge identification",
                    "Bi-directional clinical documentation exchange",
                    "Real-time escalation alerts to hospital care teams",
                    "Comprehensive progress notes in your EHR",
                    "Quality reporting dashboards and analytics",
                    "HIPAA-compliant data security and SOC 2 certification"
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
                  src="/images/AdobeStock_569656987_1759253732064.jpeg"
                  alt="Hospital Care Team"
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
              Ready to Reduce Readmissions?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Partner with Lynk Health to transform your care transitions and improve patient outcomes.
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
