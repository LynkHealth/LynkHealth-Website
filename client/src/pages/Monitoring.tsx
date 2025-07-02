import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Smartphone, 
  Heart, 
  Droplets, 
  Weight, 
  AlertTriangle,
  Shield,
  Clock,
  Check,
  ArrowRight,
  Zap
} from "lucide-react";

export default function Monitoring() {
  const devices = [
    {
      icon: Heart,
      name: "Blood Pressure Monitor",
      description: "Automatic readings with real-time transmission",
      conditions: ["Hypertension", "Heart Disease", "Diabetes"]
    },
    {
      icon: Weight,
      name: "Digital Scale",
      description: "Track weight changes for heart failure management",
      conditions: ["Heart Failure", "Kidney Disease", "Diabetes"]
    },
    {
      icon: Droplets,
      name: "Glucose Monitor",
      description: "Continuous glucose monitoring for diabetes management",
      conditions: ["Type 1 Diabetes", "Type 2 Diabetes", "Pre-diabetes"]
    },
    {
      icon: Activity,
      name: "Pulse Oximeter",
      description: "Monitor oxygen saturation and heart rate",
      conditions: ["COPD", "Asthma", "Heart Disease"]
    }
  ];

  const benefits = [
    {
      icon: AlertTriangle,
      title: "Early Detection",
      description: "Catch health issues before they become emergencies"
    },
    {
      icon: Clock,
      title: "Real-Time Monitoring",
      description: "24/7 data transmission and automated alerts"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Secure data transmission and storage"
    },
    {
      icon: Zap,
      title: "Improved Outcomes",
      description: "28% reduction in hospitalizations"
    }
  ];

  const features = [
    "FDA-approved monitoring devices",
    "Cellular connectivity (no WiFi required)",
    "Automatic data transmission",
    "Real-time clinical alerts",
    "Patient education and support",
    "Provider dashboard and reporting",
    "Medicare billing management",
    "24/7 clinical oversight"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-secondary/10 to-primary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                <Activity className="h-4 w-4 mr-2" />
                RPM & RTM Services
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                In-Home Patient Monitoring
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) 
                services that keep patients healthy at home while generating additional 
                revenue for your practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    Start RPM Program
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img
                src="/attached_assets/AdobeStock_616281932_1751485954797.jpeg"
                alt="Senior patient using remote monitoring device at home"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is RPM/RTM */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Remote Patient Monitoring & Therapeutic Monitoring
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              RPM and RTM use FDA-approved devices to continuously monitor patient vital signs 
              and health metrics from home, enabling proactive care management and early intervention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Activity className="h-8 w-8 text-primary mr-4" />
                  <h3 className="text-2xl font-bold text-foreground">Remote Patient Monitoring (RPM)</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  RPM focuses on monitoring physiological parameters like blood pressure, 
                  weight, and glucose levels for patients with chronic conditions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-muted-foreground">Physiological monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-muted-foreground">Chronic disease management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-muted-foreground">Automated data collection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-secondary/20">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Smartphone className="h-8 w-8 text-secondary mr-4" />
                  <h3 className="text-2xl font-bold text-foreground">Remote Therapeutic Monitoring (RTM)</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  RTM monitors therapeutic adherence and response, including medication 
                  compliance and rehabilitation progress.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-muted-foreground">Medication adherence</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-muted-foreground">Therapy compliance</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-muted-foreground">Treatment response tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monitoring Devices */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              FDA-Approved Monitoring Devices
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide state-of-the-art devices that automatically transmit data 
              to our clinical team for continuous monitoring and alerts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {devices.map((device, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <device.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                    {device.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    {device.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Best for:</p>
                    {device.conditions.map((condition, conditionIndex) => (
                      <Badge key={conditionIndex} variant="secondary" className="mr-2 mb-2">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Benefits for Seniors with Chronic Disease
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Remote monitoring helps seniors maintain their independence while receiving 
              the care they need to manage chronic conditions effectively.
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

      {/* How It Works */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                How Remote Monitoring Works
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our comprehensive monitoring program includes device setup, patient training, 
                and ongoing clinical oversight to ensure optimal outcomes.
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
                src="https://images.pexels.com/photos/7578769/pexels-photo-7578769.jpeg?auto=compress&cs=tinysrgb&w=600&h=400"
                alt="Healthcare data analytics dashboard showing patient monitoring results"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Data */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Compliance & Data Transmission
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              All our monitoring solutions meet the highest standards for healthcare 
              data security and regulatory compliance.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">HIPAA Compliant</h3>
                  <p className="text-muted-foreground">
                    All data transmission and storage meets HIPAA requirements for patient privacy
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Zap className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Real-Time Data</h3>
                  <p className="text-muted-foreground">
                    Cellular connectivity ensures immediate data transmission without patient WiFi
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <AlertTriangle className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Clinical Alerts</h3>
                  <p className="text-muted-foreground">
                    Automated alerts notify care team of concerning readings or trends
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Launch Remote Monitoring?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Start improving patient outcomes and generating additional revenue with our 
            comprehensive remote monitoring services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start RPM Program
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
