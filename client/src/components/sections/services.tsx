import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Activity, Heart, ArrowRight, Check } from "lucide-react";

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
      icon: <Heart className="h-8 w-8" />,
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
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
              Healthcare Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Care Programs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            White-labeled, nurse-led programs that integrate seamlessly with your practice to deliver 
            exceptional patient care while maximizing Medicare reimbursement opportunities.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-3">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                      <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="h-3 w-3 text-secondary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.link}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
                    {service.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
