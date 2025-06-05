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
    <section ref={ref} className="py-20 bg-gradient-to-r from-healthcare-primary to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Patient Impact</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Real results from our care coordination programs across partner clinics and health systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center ${isVisible ? "animate-counter" : ""}`}>
              <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-200 font-medium">{stat.label}</div>
              <div className="text-sm text-blue-300 mt-2">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
