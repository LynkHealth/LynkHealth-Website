import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  DollarSign, 
  Clock, 
  Users, 
  FileText, 
  Phone, 
  Heart,
  Check,
  ArrowRight
} from "lucide-react";

export default function CCM() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Revenue Generation",
      description: "Generate $100-150 per patient per month with CMS-covered CCM services"
    },
    {
      icon: Heart,
      title: "Improved Outcomes",
      description: "35% reduction in hospital readmissions and ER visits for enrolled patients"
    },
    {
      icon: Users,
      title: "Patient Satisfaction",
      description: "92% patient satisfaction rate with 24/7 nursing support"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete care plan documentation and CMS billing handled for you"
    }
  ];

  const features = [
    "20+ minutes monthly patient contact",
    "Comprehensive care plan development",
    "Medication adherence monitoring",
    "Health goal setting and tracking",
    "Care team coordination",
    "24/7 patient access to nursing staff",
    "Complete CMS documentation",
    "Real-time provider communication"
  ];

  const reimbursementRates = [
    { code: "99490", description: "First 20 minutes", rate: "$54.60" },
    { code: "99491", description: "Additional 30 minutes", rate: "$48.53" },
    { code: "99487", description: "Complex CCM (60+ minutes)", rate: "$102.43" },
    { code: "99489", description: "Additional 30 minutes", rate: "$51.16" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                <Stethoscope className="h-4 w-4 mr-2" />
                CMS-Covered Service
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Chronic Care Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Comprehensive, nurse-led care coordination for Medicare patients with multiple 
                chronic conditions. Generate sustainable revenue while improving patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start a CCM Program
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img
                src="/attached_assets/AdobeStock_279901729_1751485954797.jpeg"
                alt="Nurse providing chronic care management services"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is CCM */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              What is Chronic Care Management?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Chronic Care Management (CCM) is a Medicare-covered service that provides ongoing 
              care coordination for patients with multiple chronic conditions. Our registered nurses 
              work with your patients between visits to ensure they stay healthy and engaged in their care.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Monthly Contact</h3>
                <p className="text-muted-foreground">
                  Minimum 20 minutes of non-face-to-face clinical staff time per patient per month, 
                  with additional time billed as needed.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <FileText className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Care Planning</h3>
                <p className="text-muted-foreground">
                  Comprehensive care plans addressing all chronic conditions, medications, 
                  and patient goals with regular updates.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <Phone className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">24/7 Access</h3>
                <p className="text-muted-foreground">
                  Patients have continuous access to their care team for questions, 
                  concerns, and urgent issues outside of office hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Providers and Patients */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Benefits for Providers and Patients
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CCM creates a win-win scenario: better patient outcomes and additional practice revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CCM Features */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Comprehensive CCM Services
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our CCM program includes all the services required by CMS, plus additional 
                support that ensures your patients receive the highest quality care.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/7578842/pexels-photo-7578842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400"
                alt="Healthcare team coordinating patient care"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reimbursement Details */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              CMS Reimbursement Rates
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CCM services are fully reimbursed by Medicare, creating a sustainable revenue 
              stream for your practice.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        <th className="text-left p-4 font-semibold">CPT Code</th>
                        <th className="text-left p-4 font-semibold">Description</th>
                        <th className="text-left p-4 font-semibold">Medicare Rate (2024)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reimbursementRates.map((rate, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-muted/20" : "bg-background"}>
                          <td className="p-4 font-mono font-semibold">{rate.code}</td>
                          <td className="p-4">{rate.description}</td>
                          <td className="p-4 font-semibold text-secondary">{rate.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                * Rates based on CMS Physician Fee Schedule. Actual reimbursement may vary by locality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your CCM Program?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of healthcare providers who are improving patient outcomes and 
            generating additional revenue with our CCM services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Start a CCM Program
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
