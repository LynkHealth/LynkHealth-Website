import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Smartphone, Wifi, TrendingUp, CheckCircle, Monitor, Heart, AlertTriangle } from "lucide-react";
import monitoringIllustration from "@/assets/graphics/monitoring-illustration.svg";

export default function Monitoring() {
  const devices = [
    {
      icon: <Heart className="h-6 w-6" />,
      name: "Blood Pressure Monitor",
      description: "Automatic cuff with Bluetooth connectivity for daily readings"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      name: "Pulse Oximeter",
      description: "Fingertip device measuring oxygen saturation and pulse rate"
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      name: "Digital Scale",
      description: "Smart scale tracking weight trends and body composition"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      name: "Glucose Monitor",
      description: "Continuous glucose monitoring for diabetic patients"
    }
  ];

  const benefits = [
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Real-Time Data",
      description: "Continuous monitoring with automatic data transmission to care teams"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Early Detection",
      description: "Immediate alerts for abnormal readings preventing health crises"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Patient Engagement",
      description: "User-friendly devices that encourage daily health monitoring"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Improved Outcomes",
      description: "Data-driven care adjustments leading to better health results"
    }
  ];

  const rpmFeatures = [
    "FDA-approved medical devices",
    "16+ days of monitoring per month",
    "Real-time data transmission",
    "Automated alert systems",
    "Clinical staff interpretation",
    "Provider notifications",
    "Patient education and engagement",
    "Medicare billing compliance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <div className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
                  Remote Patient Monitoring
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Remote Patient Monitoring
                <span className="text-primary"> Solutions</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Turnkey RPM and RTM programs with cellular-enabled devices and 24/7 clinical monitoring. 
                Generate $58+ per patient monthly with FDA-approved monitoring technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/#contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                    Start RPM Program
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                  View Devices
                </Button>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">$58+ per patient/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">16+ monitoring days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Real-time alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">FDA-approved devices</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/AdobeStock_616281932_1751485954797.jpeg"
                  alt="Patient using FDA-approved remote monitoring devices for continuous health tracking"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-foreground mb-2">Remote Patient Monitoring</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      FDA-approved devices enable continuous health tracking from home with real-time data transmission to care teams.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">FDA Approved</span>
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">Real-time Data</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is RPM Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                  Medicare Coverage
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Remote Patient Monitoring (RPM)
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Remote Patient Monitoring uses digital technologies to collect medical and health data from patients 
                in their homes and securely transmit this information to healthcare providers for assessment and recommendations.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our RPM program includes FDA-approved devices, 24/7 monitoring, clinical staff interpretation, 
                and seamless integration with your practice's workflow while ensuring Medicare billing compliance.
              </p>
              
              {/* CMS Requirements */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-foreground mb-4">CMS Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">FDA-approved medical devices</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">16+ days of monitoring per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Clinical staff data interpretation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">Patient education and engagement</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {devices.map((device, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white border border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-3 text-primary group-hover:scale-105 transition-transform">
                      {device.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">{device.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{device.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                Program Benefits
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why Choose Remote Monitoring?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform patient care with continuous monitoring that provides early intervention opportunities 
              and improved health outcomes while generating sustainable revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-105 transition-transform">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                  Complete Solution
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Comprehensive RPM Services
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our end-to-end RPM solution includes device provisioning, patient onboarding, clinical monitoring, 
                data analysis, and provider communication to ensure seamless care coordination.
              </p>
              
              <div className="grid gap-4">
                {rpmFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3 w-3 text-secondary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-3xl p-8 text-white">
              <div className="mb-6">
                <Activity className="h-12 w-12 text-white/80 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Continuous Care</h3>
                <p className="text-white/90">
                  24/7 monitoring provides unprecedented visibility into patient health status, 
                  enabling proactive interventions and improved clinical outcomes.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">40%</div>
                  <div className="text-white/80 text-sm">Fewer Readmissions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">85%</div>
                  <div className="text-white/80 text-sm">Patient Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-white/80 text-sm">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">16+</div>
                  <div className="text-white/80 text-sm">Days/Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
              Start Monitoring Today
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Patient Care?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Implement remote patient monitoring to provide continuous care, improve outcomes, 
            and generate sustainable revenue with our comprehensive RPM program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Start Partnership
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}