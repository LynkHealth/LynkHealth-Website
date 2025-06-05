import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Lynk Health has transformed how we care for our chronic disease patients. The reduction in hospital readmissions has been remarkable, and our patients feel more supported than ever.",
      name: "Dr. Sarah Johnson",
      title: "Chief Medical Officer, Regional Health System",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "The remote monitoring program has been a game-changer for our diabetes patients. We're catching issues early and preventing complications before they become serious.",
      name: "Michael Chen",
      title: "Practice Administrator, Metro Family Clinic", 
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "Our patients love the behavioral health integration program. The compassionate approach has made a real difference in engagement and treatment adherence.",
      name: "Dr. Maria Rodriguez", 
      title: "Medical Director, Community Health Center",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">What Our Partners Say</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Healthcare providers across the country trust Lynk Health to deliver exceptional care coordination services.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-50 border-none">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-slate-700 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
