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
  Microscope,
  Stethoscope,
  ArrowRight,
  Footprints,
  Zap
} from "lucide-react";

export default function SpecialtyPracticesPage() {
  const specialties = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Cardiology",
      description: "Monitor heart failure, hypertension, and post-MI patients with continuous RPM and CCM support."
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Endocrinology",
      description: "Manage diabetes and metabolic conditions with glucose monitoring and medication adherence tracking."
    },
    {
      icon: <Footprints className="h-8 w-8" />,
      title: "Podiatry",
      description: "Coordinate diabetic wound care with advanced products, remote monitoring, and CCM integration."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Nephrology",
      description: "Support CKD and dialysis patients with comprehensive care coordination and monitoring."
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Pulmonology",
      description: "Monitor COPD and asthma patients with respiratory-focused RPM and therapeutic monitoring."
    },
    {
      icon: <Microscope className="h-8 w-8" />,
      title: "Vascular Surgery",
      description: "Post-surgical monitoring and chronic wound management for vascular patients."
    }
  ];

  return (
    <>
      <SEOHead
        title="Specialty Practices - Specialty-Specific Care Coordination | Lynk Health"
        description="Enhance your specialty practice with tailored care coordination for cardiology, endocrinology, podiatry, nephrology, and more. Improve outcomes and generate additional revenue."
        canonicalUrl="https://lynk.health/specialty-practices"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-secondary to-primary text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Care Coordination for Specialty Practices
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Specialty-specific care coordination programs designed for cardiology, endocrinology, podiatry, nephrology, pulmonology, and vascular surgery practices.
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

        {/* Specialties We Serve */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Specialties We Serve
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Tailored care coordination programs designed for your specialty's unique patient population
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialties.map((specialty, index) => (
                <Card key={index} className="border-2 hover:border-secondary transition-colors">
                  <CardContent className="pt-8">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-secondary/10 text-secondary rounded-lg mr-3">
                        {specialty.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{specialty.title}</h3>
                    </div>
                    <p className="text-slate-600">{specialty.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
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
                  <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">$2,457</div>
                  <p className="text-slate-600">Annual cost reduction per patient</p>
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
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-4">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">85%</div>
                  <p className="text-slate-600">Medication adherence improvement</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Specialty-Specific Programs */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Specialty-Specific Care Programs
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Services tailored to your specialty's clinical focus and patient needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">For Cardiology Practices</h3>
                  <ul className="space-y-3">
                    {[
                      "Continuous heart failure monitoring with RPM devices",
                      "Post-MI care coordination and medication management",
                      "Hypertension tracking and lifestyle intervention support",
                      "Monthly CCM touchpoints for high-risk cardiac patients",
                      "Behavioral health integration for cardiac psychology"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">For Endocrinology Practices</h3>
                  <ul className="space-y-3">
                    {[
                      "Continuous glucose monitoring integration and analysis",
                      "Insulin therapy management and dose optimization support",
                      "Diabetic wound care coordination and prevention",
                      "A1C trend tracking with automated intervention alerts",
                      "Nutrition counseling and lifestyle modification support"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">For Podiatry Practices</h3>
                  <ul className="space-y-3">
                    {[
                      "Chronic wound management with advanced product coordination",
                      "Remote wound photo monitoring and healing progress tracking",
                      "Access to skin grafts and biologics through partner network",
                      "Diabetic foot care education and prevention programs",
                      "Post-surgical monitoring and complication prevention"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">For Nephrology Practices</h3>
                  <ul className="space-y-3">
                    {[
                      "CKD progression monitoring and early intervention",
                      "Pre-dialysis education and preparation support",
                      "Dialysis compliance tracking and adherence improvement",
                      "Medication reconciliation for complex renal patients",
                      "Fluid and dietary management counseling"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enhance Your Specialty Practice Today
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join specialty practices across the country improving patient outcomes and generating additional revenue.
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
