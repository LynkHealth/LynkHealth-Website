const testimonials = [
  {
    quote: "Lynk Health has been an incredible extension of our team. Our patients love the personal connection, and our providers love the ease.",
    name: "Clinic Administrator",
    title: "Mississippi",
    image: "/images/AdobeStock_671445453 (1)_1751485954796.jpeg"
  },
  {
    quote: "The implementation was seamless, and our staff loves having the additional support. Lynk Health handles all the administrative burden while we focus on direct patient care.",
    name: "Michael Chen",
    title: "Practice Administrator, Metro Family Clinic",
    image: "/images/AdobeStock_400795942_1751485954824.jpeg"
  },
  {
    quote: "Our patients love the behavioral health integration program. The compassionate approach has made a real difference in engagement and treatment adherence.",
    name: "Dr. Maria Rodriguez",
    title: "Medical Director, Community Health Center",
    image: "/images/AdobeStock_425213387_Preview_1751485954824.jpeg"
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What Our Partners Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Healthcare providers across the country trust Lynk Health to deliver exceptional care coordination services.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
