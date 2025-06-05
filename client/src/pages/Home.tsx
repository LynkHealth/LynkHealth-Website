import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Hospital, 
  Building2, 
  Heart, 
  Users, 
  Stethoscope, 
  Activity, 
  Brain,
  Check,
  ArrowRight,
  Star,
  Quote
} from "lucide-react";

export default function Home() {
  const stats = [
    { number: "92%", label: "Patient Satisfaction", description: "Based on monthly surveys" },
    { number: "$2,400", label: "Average Monthly Revenue", description: "Per CCM patient per provider" },
    { number: "35%", label: "Reduction in ER Visits", description: "Among enrolled patients" },
    { number: "15,000+", label: "Patients Served", description: "Across our partner network" },
  ];

  const testimonials = [
    {
      quote: "Lynk Health has transformed how we manage our chronic care patients. The reduction in readmissions has been remarkable, and the additional revenue stream has allowed us to expand our services.",
      name: "Dr. Sarah Mitchell",
      title: "Chief Medical Officer, Regional Health Network",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "The white-label solution was perfect for our health system. We were able to launch care coordination services under our brand without the overhead of hiring additional staff.",
      name: "Michael Rodriguez",
      title: "Practice Administrator, City Medical Group",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="section-padding healthcare-gradient text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Care Coordination{" "}
                <span className="text-blue-200">That Clicks.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Helping patients stay healthy and independent through{" "}
                <span className="font-semibold">Chronic Care Management</span>,{" "}
                <span className="font-semibold">In-Home Monitoring</span>, and{" "}
                <span className="font-semibold">Behavioral Health Integration</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Partner With Us
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Healthcare professional providing care coordination services"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Who We Serve</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We partner with healthcare providers to deliver comprehensive care coordination services for Medicare patients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Hospital,
                title: "Hospitals & Health Systems",
                description: "Reduce readmissions and improve patient outcomes with comprehensive post-discharge care coordination."
              },
              {
                icon: Building2,
                title: "Primary Care Clinics",
                description: "Enhance chronic disease management and patient engagement between visits with dedicated nursing support."
              },
              {
                icon: Heart,
                title: "FQHCs & Community Health",
                description: "Extend your reach and provide continuous care for underserved populations with specialized programs."
              },
              {
                icon: Users,
                title: "Health Systems",
                description: "Scale care coordination across multiple facilities with our white-label solution."
              }
            ].map((item, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Programs</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive care coordination services designed to improve patient outcomes and generate sustainable revenue.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Stethoscope,
                title: "Chronic Care Management",
                description: "Nurse-led care coordination for patients with multiple chronic conditions. CMS-reimbursed monthly services that improve outcomes and generate revenue.",
                features: [
                  "24/7 patient access to care team",
                  "Comprehensive care plan development",
                  "Medication management support",
                  "CMS billing and documentation"
                ],
                link: "/ccm",
                linkText: "Start a CCM Program"
              },
              {
                icon: Activity,
                title: "In-Home Patient Monitoring",
                description: "Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) services that keep patients healthy at home.",
                features: [
                  "FDA-approved monitoring devices",
                  "Real-time vital sign tracking",
                  "Automated alert system",
                  "Medicare reimbursement support"
                ],
                link: "/monitoring",
                linkText: "Learn About RPM/RTM"
              },
              {
                icon: Brain,
                title: "Behavioral Health Integration",
                description: "Compassionate behavioral health support for seniors, addressing mental health needs with dignity and reducing stigma.",
                features: [
                  "Low-stigma engagement approach",
                  "Medication adherence support",
                  "Dual enrollment with CCM",
                  "Crisis intervention protocols"
                ],
                link: "/bhi",
                linkText: "Explore BHI Services"
              }
            ].map((program, index) => (
              <Card key={index} className="p-8 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                    <program.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{program.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
                  <ul className="space-y-2 mb-8">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-muted-foreground">
                        <Check className="h-4 w-4 text-secondary mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={program.link}>
                    <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                      {program.linkText} <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Impact Stats */}
      <section className="section-padding stats-gradient text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Patient Impact by the Numbers</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our evidence-based care coordination delivers measurable improvements in patient outcomes and practice revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-counter">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-blue-100">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What Our Partners Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Healthcare providers across the country trust Lynk Health for their care coordination needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <Quote className="h-8 w-8 text-secondary mr-4" />
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <p className="text-muted-foreground font-medium">Trusted by Healthcare Partners Nationwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="h-12 bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground text-xs font-medium">PARTNER LOGO</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-foreground text-background">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted mb-8 max-w-3xl mx-auto">
            Join healthcare providers across the country who are improving patient outcomes and generating additional revenue with our care coordination services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Your Program Today
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
