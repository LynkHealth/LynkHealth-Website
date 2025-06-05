import { useEffect, useRef, useState } from "react";

const stats = [
  { number: "92%", label: "Patient Satisfaction", description: "Based on quarterly surveys" },
  { number: "35%", label: "Reduction in ER Visits", description: "Among enrolled patients" },
  { number: "28%", label: "Fewer Hospitalizations", description: "Year-over-year comparison" },
  { number: "89%", label: "Medication Adherence", description: "Chronic condition management" },
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 text-white font-semibold text-sm rounded-full backdrop-blur-sm">
              Proven Results
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Measurable Patient Impact
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Real outcomes from our comprehensive care coordination programs across healthcare partners nationwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all ${isVisible ? "animate-counter" : ""}`}>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-3">{stat.number}</div>
              <div className="text-white/90 font-semibold text-lg mb-2">{stat.label}</div>
              <div className="text-sm text-white/70">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
