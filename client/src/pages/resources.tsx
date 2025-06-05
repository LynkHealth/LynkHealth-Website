import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Resources() {
  const blogPosts = [
    {
      title: "Maximizing CMS Reimbursement for Chronic Care Management in 2025",
      excerpt: "Learn about the latest CMS updates for CCM billing and how to optimize your reimbursement strategy with proper documentation and patient engagement.",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Billing & Reimbursement",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      tags: ["CCM", "CMS", "Billing"]
    },
    {
      title: "Remote Patient Monitoring: Proven Strategies for Better Patient Outcomes",
      excerpt: "Discover how RPM programs reduce hospital readmissions and improve medication adherence for patients with chronic conditions.",
      date: "December 10, 2024",
      readTime: "7 min read",
      category: "Clinical Best Practices",
      image: "https://images.unsplash.com/photo-1605684954998-685c79d6a018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      tags: ["RPM", "Patient Outcomes", "Technology"]
    },
    {
      title: "Behavioral Health Integration: Breaking Down Barriers for Senior Care",
      excerpt: "Explore innovative approaches to reducing stigma and improving mental health engagement among Medicare patients.",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "Behavioral Health",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      tags: ["BHI", "Mental Health", "Senior Care"]
    },
    {
      title: "Quality Metrics That Matter: Improving HEDIS Scores with Care Coordination",
      excerpt: "Learn which quality metrics are most impacted by comprehensive care coordination and how to track your progress effectively.",
      date: "November 28, 2024",
      readTime: "8 min read",
      category: "Quality Improvement",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      tags: ["HEDIS", "Quality Metrics", "Performance"]
    }
  ];

  const resources = [
    {
      title: "CCM Implementation Guide",
      description: "Comprehensive guide to launching a successful Chronic Care Management program",
      type: "PDF Download",
      icon: "fas fa-file-pdf"
    },
    {
      title: "ROI Calculator",
      description: "Calculate the potential revenue impact of care coordination services for your practice",
      type: "Interactive Tool",
      icon: "fas fa-calculator"
    },
    {
      title: "Patient Engagement Templates",
      description: "Proven communication templates for enrolling and engaging patients in care coordination",
      type: "Template Pack",
      icon: "fas fa-envelope"
    },
    {
      title: "Regulatory Compliance Checklist",
      description: "Stay compliant with CMS requirements for care coordination billing and documentation",
      type: "Checklist",
      icon: "fas fa-clipboard-check"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed about healthcare trends, care coordination best practices, and regulatory updates with our expert insights and practical resources.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Latest Articles</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert insights and practical guidance for healthcare providers implementing care coordination services.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {blogPosts.slice(0, 2).map((post, index) => (
              <article key={index} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span className="bg-healthcare-primary/10 text-healthcare-primary px-2 py-1 rounded-md text-xs font-medium mr-3">
                      {post.category}
                    </span>
                    <i className="far fa-calendar mr-2"></i>
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href="#" className="inline-flex items-center text-healthcare-primary font-medium hover:text-blue-700 transition-colors">
                      Read More <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.slice(2).map((post, index) => (
              <article key={index + 2} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <span className="bg-healthcare-secondary/10 text-healthcare-secondary px-2 py-1 rounded-md text-xs font-medium mr-3">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#" className="inline-flex items-center text-healthcare-primary font-medium hover:text-blue-700 transition-colors text-sm">
                    Read More <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Downloads & Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practical resources to help you implement and optimize your care coordination programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className={`${resource.icon} text-healthcare-primary`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-healthcare-secondary font-medium">{resource.type}</span>
                      <Button size="sm" className="bg-healthcare-primary hover:bg-blue-700">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Browse by Category</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find resources tailored to your specific interests and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-stethoscope text-healthcare-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Clinical Best Practices</h3>
              <p className="text-muted-foreground mb-4">Evidence-based approaches to care coordination and patient management</p>
              <span className="text-healthcare-primary font-medium">12 Articles</span>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-healthcare-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-healthcare-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Billing & Reimbursement</h3>
              <p className="text-muted-foreground mb-4">Navigate CMS requirements and maximize your revenue potential</p>
              <span className="text-healthcare-secondary font-medium">8 Articles</span>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-healthcare-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-healthcare-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality Improvement</h3>
              <p className="text-muted-foreground mb-4">Strategies for improving patient outcomes and quality metrics</p>
              <span className="text-healthcare-accent font-medium">10 Articles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-healthcare-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Get the latest insights on care coordination, regulatory updates, and best practices delivered to your inbox monthly.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-white text-healthcare-primary hover:bg-slate-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have questions about implementing care coordination services? Our team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-healthcare-primary hover:bg-blue-700">
                Contact Our Team
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-healthcare-primary text-healthcare-primary hover:bg-healthcare-primary hover:text-white">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
