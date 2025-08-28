const riskMitigationPoints = [
  {
    concern: "Will this disrupt our current workflow?",
    solution: "Zero disruption implementation",
    details: "We adapt to your existing workflow, with optional EHR integration available. No required new software, minimal staff training, and flexible implementation. Your team continues working as they prefer.",
    icon: "fas fa-sync-alt",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    concern: "What if patients don't engage?",
    solution: "90%+ retention guarantee",
    details: "Our dedicated nurses build authentic relationships that patients trust. Unlike call centers, our approach generates industry-leading engagement rates.",
    icon: "fas fa-handshake",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    concern: "How do we ensure quality oversight?",
    solution: "Complete transparency & control",
    details: "Real-time dashboard access, monthly quality reports, and direct communication channels. You maintain full oversight of patient care decisions.",
    icon: "fas fa-chart-bar",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    concern: "What about compliance risks?",
    solution: "Enterprise-grade compliance",
    details: "SOC 2 Type II certified, HIPAA compliant, CMS approved programs. Our compliance team handles all regulatory requirements and documentation.",
    icon: "fas fa-shield-alt",
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

export default function RiskMitigation() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-4">
            Risk-Free Implementation
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Address Every Concern Before You Start
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We understand healthcare practices have valid concerns about adding new services. 
            Here's how we eliminate every risk and ensure success from day one.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {riskMitigationPoints.map((point, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 ${point.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <i className={`${point.icon} ${point.color} text-2xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2 italic">
                    "{point.concern}"
                  </h3>
                  <h4 className={`text-xl font-bold ${point.color} mb-3`}>
                    {point.solution}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Benefits */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Risk-Free Implementation
          </h3>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Start generating revenue with no upfront costs and proven implementation support. 
            Our experienced team ensures a smooth transition and optimal outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <div className="font-semibold">Zero Risk</div>
              <div className="text-sm opacity-90">No upfront costs</div>
            </div>
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <div className="font-semibold">Fast Implementation</div>
              <div className="text-sm opacity-90">4-6 weeks to revenue</div>
            </div>
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <div className="font-semibold">Proven Results</div>
              <div className="text-sm opacity-90">90%+ retention rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}