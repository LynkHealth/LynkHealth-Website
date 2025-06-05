import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Eye, Users, Award, Shield } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make prioritizes patient health, dignity, and quality of life."
    },
    {
      icon: Target,
      title: "Clinical Excellence",
      description: "Our registered nurses deliver evidence-based care coordination with measurable outcomes."
    },
    {
      icon: Users,
      title: "Partnership Focus",
      description: "We believe in true partnerships that enhance your practice's capabilities and reputation."
    },
    {
      icon: Shield,
      title: "Compliance First",
      description: "HIPAA-compliant, CMS-certified processes ensure your practice stays protected and compliant."
    }
  ];

  const teamMembers = [
    {
      name: "Coming Soon",
      role: "Leadership Team",
      description: "Our experienced healthcare leadership team brings decades of clinical and administrative expertise.",
    },
    {
      name: "Coming Soon",
      role: "Clinical Team",
      description: "Licensed registered nurses with specialized training in chronic care management and remote monitoring.",
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                About Lynk Health
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We're dedicated to helping seniors stay out of hospitals and age in place 
                through comprehensive, nurse-led care coordination services.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Award className="h-4 w-4 mr-2" />
                  CMS Certified
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Shield className="h-4 w-4 mr-2" />
                  HIPAA Compliant
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Users className="h-4 w-4 mr-2" />
                  15,000+ Patients Served
                </Badge>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Healthcare team collaborating on patient care"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              To empower healthcare providers with innovative care coordination solutions that 
              improve patient outcomes, reduce healthcare costs, and enhance the quality of life 
              for Medicare patients with chronic conditions. We believe that with the right support, 
              patients can maintain their independence and thrive in their communities.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-2 border-primary/20">
                <CardContent className="p-0 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Preventive care through better nurse-led engagement, creating a healthcare 
                    system where chronic conditions are managed proactively, not reactively.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-8 border-2 border-secondary/20">
                <CardContent className="p-0 text-center">
                  <Eye className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Approach</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    White-labeled solutions that integrate seamlessly with your practice, 
                    allowing you to expand services while maintaining your brand and relationships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These core principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced healthcare professionals are dedicated to delivering exceptional 
              care coordination services.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-8 text-center">
                <CardContent className="p-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-foreground text-background">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Lynk Health?</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              We're more than a vendor – we're your strategic partner in improving patient care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-4">10+</div>
              <h3 className="text-xl font-semibold mb-2">Years Experience</h3>
              <p className="text-muted">
                Decades of combined healthcare and care coordination expertise
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-4">24/7</div>
              <h3 className="text-xl font-semibold mb-2">Patient Support</h3>
              <p className="text-muted">
                Round-the-clock access to our licensed nursing team
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-4">100%</div>
              <h3 className="text-xl font-semibold mb-2">Compliance</h3>
              <p className="text-muted">
                Full HIPAA compliance and CMS certification maintained
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
