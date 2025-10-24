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
  Globe,
  Shield,
  Star,
  ArrowRight,
  Stethoscope,
  Clock
} from "lucide-react";

export default function FQHCsPage() {
  return (
    <>
      <SEOHead
        title="FQHCs - Care Coordination for Federally Qualified Health Centers | Lynk Health"
        description="Enhance your FQHC's mission with culturally competent care coordination. Improve outcomes for underserved populations while achieving UDS quality metrics and value-based care goals."
        canonicalUrl="https://lynk.health/fqhcs"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-accent to-secondary text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Care Coordination for Federally Qualified Health Centers
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Serve underserved populations more effectively with culturally competent, nurse-led care coordination that improves UDS metrics and patient outcomes.
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

        {/* FQHC-Specific Value Props */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Designed for Your FQHC's Mission
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Care coordination that aligns with HRSA requirements and advances health equity
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-4">
                    <Star className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">+12%</div>
                  <p className="text-slate-600">Improvement in UDS quality measures</p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Globe className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">15+</div>
                  <p className="text-slate-600">Languages supported for diverse populations</p>
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
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">35%</div>
                  <p className="text-slate-600">Reduction in ER visits</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services for FQHCs */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Comprehensive Care Coordination Services
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                CMS-covered programs that enhance your value-based care performance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Care Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Improve control rates for diabetes, hypertension, and other chronic conditions tracked in UDS reporting.
                  </p>
                  <Link href="/ccm" className="text-accent font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Remote Patient Monitoring</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Extend care reach with device-based monitoring for patients with transportation barriers.
                  </p>
                  <Link href="/monitoring" className="text-accent font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Behavioral Health Integration</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Address mental health needs with integrated screening, intervention, and ongoing support.
                  </p>
                  <Link href="/bhi" className="text-accent font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg mr-3">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Advanced Primary Care Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Intensive care coordination for your most complex, high-utilizing patients.
                  </p>
                  <Link href="/apcm" className="text-accent font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Overnight On-Call Coverage</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Provide after-hours support without straining your on-call providers.
                  </p>
                  <Link href="/overnight-on-call" className="text-accent font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mr-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Chronic Wound Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Coordinated wound care for diabetic and vascular patients through partner networks.
                  </p>
                  <Link href="/chronic-wound-management" className="text-accent font-semibold hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why FQHCs Choose Lynk */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Why FQHCs Choose Lynk Health
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg flex-shrink-0">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Culturally Competent Care</h3>
                      <p className="text-slate-600">
                        Nurses from diverse backgrounds who understand the unique needs of your patient populations.
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
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">UDS Quality Improvement</h3>
                      <p className="text-slate-600">
                        Direct impact on clinical quality measures including BP control, diabetes control, and preventive screenings.
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
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Additional Revenue Without Overhead</h3>
                      <p className="text-slate-600">
                        Generate CMS-covered revenue to support your mission without adding FTE costs or administrative burden.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg flex-shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">Social Determinants Support</h3>
                      <p className="text-slate-600">
                        Address transportation, housing, food insecurity, and other barriers to care for vulnerable populations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Special FQHC Features */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                  Built for Health Equity
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Our care coordination programs are designed to address the unique challenges faced by FQHCs serving medically underserved communities.
                </p>
                <ul className="space-y-4">
                  {[
                    "Multilingual nurses fluent in 15+ languages",
                    "Flexible communication via phone, text, or video",
                    "Transportation and resource navigation assistance",
                    "Culturally appropriate health education materials",
                    "Integration with community health workers and navigators",
                    "Focus on health literacy and patient empowerment"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mr-3 mt-0.5" />
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <img
                  src="/images/AdobeStock_671445453 (1)_1751485954796.jpeg"
                  alt="FQHC Care Team"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-accent to-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advance Your FQHC's Mission
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Partner with Lynk Health to improve health equity and patient outcomes in your community.
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
