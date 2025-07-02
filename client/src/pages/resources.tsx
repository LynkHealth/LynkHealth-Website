import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Clock, Tag, BookOpen, TrendingUp, Users, Shield } from "lucide-react";

export default function Resources() {
  const blogPosts = [
    {
      title: "2025 Chronic Care Management CPT Codes: Complete Billing Guide",
      excerpt: "Complete guide to 2025 CCM billing codes including 99490, 99439, 99487, and 99489. Learn CMS requirements, documentation standards, and revenue optimization strategies.",
      date: "January 20, 2025",
      readTime: "11 min read",
      category: "Billing & Compliance",
      tags: ["CCM", "CPT Codes", "Medicare"],
      author: "Dr. Sarah Chen, MD",
      slug: "2025-chronic-care-management-cpt-codes"
    },
    {
      title: "Remote Patient Monitoring: Proven Strategies for Better Patient Outcomes",
      excerpt: "Discover how RPM programs reduce hospital readmissions and improve medication adherence for patients with chronic conditions.",
      date: "December 10, 2024",
      readTime: "15 min read",
      category: "Clinical Best Practices",
      tags: ["RPM", "Patient Outcomes", "Technology"],
      author: "Michael Chen, RN",
      slug: "rpm-patient-outcomes-strategies"
    },
    {
      title: "Behavioral Health Integration: Breaking Down Barriers for Senior Care",
      excerpt: "Explore innovative approaches to reducing stigma and improving mental health engagement among Medicare patients.",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "Behavioral Health",
      tags: ["BHI", "Mental Health", "Senior Care"],
      author: "Lisa Rodriguez, LCSW"
    },
    {
      title: "Quality Metrics That Matter: Improving HEDIS Scores with Care Coordination",
      excerpt: "Learn which quality metrics are most impacted by comprehensive care coordination and how to track your progress effectively.",
      date: "November 28, 2024",
      readTime: "8 min read",
      category: "Quality Improvement",
      tags: ["HEDIS", "Quality Metrics", "Performance"],
      author: "David Park, MBA"
    },
    {
      title: "Building Sustainable Revenue Streams Through Value-Based Care",
      excerpt: "Explore how care coordination programs create lasting financial benefits while improving patient outcomes and satisfaction.",
      date: "November 20, 2024",
      readTime: "10 min read",
      category: "Practice Management",
      tags: ["Revenue", "Value-Based Care", "ROI"],
      author: "Jennifer Adams, CPA"
    },
    {
      title: "Technology Integration in Healthcare: A Provider's Guide to Digital Transformation",
      excerpt: "Navigate the digital healthcare landscape with practical strategies for implementing technology solutions that enhance patient care.",
      date: "November 15, 2024",
      readTime: "9 min read",
      category: "Digital Health",
      tags: ["Technology", "Digital Health", "Innovation"],
      author: "Robert Kim, CTO"
    }
  ];

  const resources = [
    {
      title: "CCM Implementation Guide",
      description: "Comprehensive guide to launching a successful Chronic Care Management program",
      type: "Implementation Guide",
      icon: <FileText className="h-6 w-6" />,
      pages: "24 pages",
      downloadUrl: "/downloads/ccm-implementation-guide.html"
    },
    {
      title: "RPM Device Selection Checklist",
      description: "Essential criteria for choosing the right remote monitoring devices for your patients",
      type: "Device Checklist",
      icon: <Shield className="h-6 w-6" />,
      pages: "12 pages",
      downloadUrl: "/downloads/rpm-device-selection-checklist.html"
    },
    {
      title: "BHI Best Practices Toolkit",
      description: "Evidence-based strategies for integrating behavioral health into primary care",
      type: "Clinical Toolkit",
      icon: <BookOpen className="h-6 w-6" />,
      pages: "32 pages",
      downloadUrl: "/downloads/bhi-best-practices-toolkit.html"
    },
    {
      title: "Medicare Billing Compliance Guide",
      description: "Complete reference for CMS billing requirements and documentation standards",
      type: "Compliance Guide",
      icon: <TrendingUp className="h-6 w-6" />,
      pages: "28 pages",
      downloadUrl: "/downloads/medicare-billing-compliance-guide.html"
    }
  ];

  const categories = [
    "All Posts",
    "Billing & Reimbursement",
    "Clinical Best Practices",
    "Behavioral Health",
    "Quality Improvement",
    "Practice Management",
    "Digital Health"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className="mb-4 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
                Healthcare Resources
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Healthcare Insights &
              <span className="text-primary"> Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Stay informed with the latest healthcare trends, best practices, and regulatory updates. 
              Access expert insights on care coordination, Medicare compliance, and clinical excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Subscribe to Updates
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                Browse All Resources
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                Featured Downloads
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Essential Healthcare Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Access comprehensive guides, toolkits, and references to enhance your healthcare practice 
              and improve patient outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-105 transition-transform">
                    {resource.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{resource.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>
                    <span>•</span>
                    <span>{resource.pages}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-4">{resource.description}</p>
                  <a 
                    href={resource.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                Healthcare Blog
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Latest Healthcare Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert perspectives on healthcare innovation, regulatory updates, and best practices 
              from our team of healthcare professionals.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground leading-tight">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.author}</span>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
              Stay Informed
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Healthcare Updates Delivered
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Get the latest healthcare insights, regulatory updates, and best practices 
            delivered directly to your inbox every month.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}