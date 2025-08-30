import { Shield, CheckCircle, Award, Lock, TrendingUp, Heart, Rocket, Building2, Pill, Users } from "lucide-react";

const provenResults = [
  {
    metric: "$2,457",
    label: "Average Annual Cost Reduction",
    description: "Per patient through improved care coordination and reduced hospitalizations",
    icon: TrendingUp,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    metric: "90%+",
    label: "Patient Retention Rate",
    description: "Industry-leading engagement with dedicated nurse relationships",
    icon: Heart,
    color: "text-amber-600", 
    bgColor: "bg-amber-50"
  },
  {
    metric: "4-6 Weeks",
    label: "Implementation Timeline",
    description: "From contract signing to first patient enrolled and generating revenue",
    icon: Rocket,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    metric: "35%",
    label: "Reduction in ER Visits",
    description: "Through proactive monitoring and early intervention protocols",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    metric: "86%",
    label: "Medication Adherence",
    description: "Improved compliance through consistent nurse follow-up and education",
    icon: Pill,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    metric: "45%",
    label: "Average Enrollment Rate",
    description: "Of eligible patients choose to participate in care coordination programs",
    icon: Users,
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Proven Results Across Healthcare Partners</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Anonymous data from healthcare practices nationwide shows consistent outcomes and revenue generation through our Medicare care coordination programs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {provenResults.map((result, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${result.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                <result.icon className={`${result.color} w-8 h-8`} />
              </div>
              <div className={`text-4xl font-bold ${result.color} mb-2`}>
                {result.metric}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {result.label}
              </h3>
              <p className="text-muted-foreground">
                {result.description}
              </p>
            </div>
          ))}
        </div>

        {/* Industry Recognition */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Industry Recognition & Compliance</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our commitment to excellence is validated by industry certifications and rigorous compliance standards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="text-primary w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">HIPAA Compliant</h4>
              <p className="text-sm text-muted-foreground">Enterprise-grade security and privacy protection</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle className="text-secondary w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">CMS Approved</h4>
              <p className="text-sm text-muted-foreground">All programs meet Medicare billing requirements</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Award className="text-accent w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Joint Commission</h4>
              <p className="text-sm text-muted-foreground">Quality and safety standards certification</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="text-primary w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">SOC 2 Type II</h4>
              <p className="text-sm text-muted-foreground">Third-party verified security controls</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
