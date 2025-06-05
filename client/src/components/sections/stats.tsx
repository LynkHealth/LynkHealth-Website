export default function StatsSection() {
  const stats = [
    {
      number: "32%",
      label: "Reduction in Hospital Readmissions",
      description: "Among enrolled patients"
    },
    {
      number: "45%", 
      label: "Decrease in ER Visits",
      description: "Year-over-year comparison"
    },
    {
      number: "89%",
      label: "Medication Adherence Rate", 
      description: "Chronic condition management"
    },
    {
      number: "96%",
      label: "Patient Satisfaction Score",
      description: "Based on monthly surveys"
    }
  ];

  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Patient Impact Stats</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our evidence-based approach delivers measurable results for patients and providers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-200 font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-blue-300">{stat.description}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Real Results, Real Impact</h3>
              <p className="text-blue-100 mb-6">
                Our comprehensive care coordination programs have demonstrated significant improvements in patient health outcomes while reducing healthcare costs for providers and payers.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <i className="fas fa-award text-yellow-400 mr-2"></i>
                  <span className="text-sm">CMS Certified</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-green-400 mr-2"></i>
                  <span className="text-sm">HIPAA Compliant</span>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Healthcare data analytics dashboard showing positive patient outcomes" 
                className="rounded-xl opacity-90 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
