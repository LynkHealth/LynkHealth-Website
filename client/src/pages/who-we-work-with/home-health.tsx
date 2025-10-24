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
  Home,
  ArrowRight,
  Stethoscope,
  HeartPulse
} from "lucide-react";

export default function HomeHealthPage() {
  return (
    <>
      <SEOHead
        title="Home Health Agencies - In-Home Care Coordination | Lynk Health"
        description="Enhance your home health agency with comprehensive care coordination. Support your clinicians, improve OASIS scores, and deliver exceptional patient outcomes with Lynk Health."
        canonicalUrl="https://lynk.health/home-health"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-secondary to-primary text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Care Coordination for Home Health Agencies
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Extend your care reach and improve patient outcomes with comprehensive remote monitoring and care coordination that supports your field clinicians.
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
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">35%</div>
                  <p className="text-slate-600">Reduction in hospital readmissions</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">$2,457</div>
                  <p className="text-slate-600">Annual cost savings per patient</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">92%</div>
                  <p className="text-slate-600">Patient satisfaction rate</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">+18%</div>
                  <p className="text-slate-600">Improvement in OASIS outcomes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services for Home Health */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Comprehensive In-Home Care Coordination
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Support your clinicians and patients between visits with continuous monitoring and coordination
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-secondary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Remote Patient Monitoring</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Continuous vital sign tracking between nurse visits with automated alerts for concerning trends.
                  </p>
                  <Link href="/monitoring" className="text-secondary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Care Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Monthly care coordination touchpoints that complement your skilled nursing visits.
                  </p>
                  <Link href="/ccm" className="text-secondary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Remote Therapeutic Monitoring</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Track therapy adherence, medication compliance, and patient-reported outcomes remotely.
                  </p>
                  <Link href="/rtm" className="text-secondary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Behavioral Health Integration</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Mental health screening and support for homebound patients with depression or anxiety.
                  </p>
                  <Link href="/bhi" className="text-secondary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Wound Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Remote wound monitoring with photo capture and coordinated product delivery.
                  </p>
                  <Link href="/chronic-wound-management" className="text-secondary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Overnight On-Call Support</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    After-hours triage and support for patients and families between your scheduled visits.
                  </p>
                  <Link href="/overnight-on-call" className="text-secondary font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Home Health Agencies Choose Lynk */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Why Home Health Agencies Choose Lynk Health
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Support Your Field Clinicians</h3>
                      <p className="text-slate-600">
                        Provide your nurses and therapists with continuous patient data between visits for better care planning.
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
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Improve OASIS Outcomes</h3>
                      <p className="text-slate-600">
                        Enhance medication management, functional status, and other OASIS measures with continuous monitoring.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg flex-shrink-0">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Early Warning System</h3>
                      <p className="text-slate-600">
                        Detect deterioration early with automated alerts, preventing hospital readmissions and ER visits.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg flex-shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Additional Revenue Stream</h3>
                      <p className="text-slate-600">
                        Generate CMS-covered RPM and CCM revenue without adding overhead or technology costs.
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
                  Seamless Integration with Your Workflow
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Our platform integrates with your home health software and enhances your clinicians' visits with continuous data.
                </p>
                <ul className="space-y-4">
                  {[
                    "Compatible with all major home health EMR systems",
                    "Real-time alerts to your on-call team and clinicians",
                    "Progress notes and vital trends accessible in your EMR",
                    "Device setup and patient training support",
                    "24/7 technical support for patients and staff",
                    "Comprehensive analytics and quality reporting"
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
                  src="/images/AdobeStock_39976543_1751485954824.jpeg"
                  alt="Home Health Care"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Perfect for Your Patient Population
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our care coordination enhances outcomes across all your service lines
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Post-Acute Patients</h3>
                  <p className="text-slate-600">
                    Monitor recently discharged patients to prevent readmissions during the critical 30-day window.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <Stethoscope className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Chronic Disease Management</h3>
                  <p className="text-slate-600">
                    Support patients with CHF, COPD, diabetes, and other conditions requiring ongoing monitoring.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <Home className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Long-Term Home Care</h3>
                  <p className="text-slate-600">
                    Extend care for homebound patients requiring continuous support beyond skilled visits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enhance Your Home Health Services
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Partner with Lynk Health to deliver exceptional in-home care coordination.
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
