import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Activity, Brain, ArrowRight, Check } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Chronic Care Management",
      description: "CMS-covered monthly care coordination for patients with multiple chronic conditions. Our registered nurses provide comprehensive health monitoring and care plan management.",
      features: [
        "24/7 care team availability",
        "Monthly care plan updates", 
        "Medication management",
        "Provider communication"
      ],
      link: "/ccm",
      cta: "Start a CCM Program"
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "In-Home Patient Monitoring",
      description: "Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that enable continuous health tracking from the comfort of home.",
      features: [
        "FDA-approved devices",
        "Real-time data transmission",
        "Alert management", 
        "Patient education"
      ],
      link: "/monitoring",
      cta: "Learn About RPM/RTM"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Behavioral Health Integration",
      description: "Compassionate mental health support for seniors with behavioral conditions, using a low-stigma approach to improve engagement and outcomes.",
      features: [
        "Depression screening",
        "Medication adherence",
        "Crisis intervention",
        "Care team coordination"
      ],
      link: "/bhi",
      cta: "Explore BHI Services"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Our Programs</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive care coordination services designed to improve patient outcomes and provider efficiency.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl text-slate-900">{service.title}</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.link}>
                  <Button variant="link" className="p-0 text-blue-600 hover:text-blue-700">
                    {service.cta} <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
