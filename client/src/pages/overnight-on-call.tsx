import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Moon, Clock, Hospital, Users, DollarSign, CheckCircle, Phone, Calendar, Shield, Heart, Stethoscope, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SEOHead } from "@/components/SEOHead";
import { insertNightCoverageInquirySchema } from "@shared/schema";

const nightCoverageFormSchema = insertNightCoverageInquirySchema;

type NightCoverageForm = z.infer<typeof nightCoverageFormSchema>;

export default function OvernightOnCallCoverage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<NightCoverageForm>({
    resolver: zodResolver(nightCoverageFormSchema),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: NightCoverageForm) => {
      try {
        return await apiRequest("POST", "/api/contact-night-coverage", data);
      } catch (error) {
        // Fallback to mailto if API fails
        const subject = encodeURIComponent('Night Coverage Inquiry from ' + data.organizationName);
        const body = encodeURIComponent(
          `Organization: ${data.organizationName}\n` +
          `Contact: ${data.contactName}\n` +
          `Role: ${data.role}\n` +
          `Email: ${data.email}\n` +
          `Phone: ${data.phone || 'Not provided'}\n` +
          `Care Setting: ${data.careSetting}\n` +
          `Expected Volume: ${data.expectedVolume}\n` +
          `Message: ${data.message || 'No additional message'}`
        );
        window.location.href = `mailto:hello@lynk.health?subject=${subject}&body=${body}`;
        return { success: true, fallback: true };
      }
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Inquiry Submitted",
        description: "We'll contact you within 1 business day to discuss your night coverage needs.",
      });

      // Analytics event
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'night_coverage_inquiry_submitted', {
          event_category: 'engagement',
          event_label: 'night_coverage_form'
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Please try again or contact us directly at hello@lynk.health",
      });
    },
  });

  const onSubmit = (data: NightCoverageForm) => {
    submitMutation.mutate(data);
  };

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Cost-Effective Alternative",
      description: "Reduce overhead costs compared to in-house night staffing while maintaining quality care"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Reliable Response Times",
      description: "Experienced clinicians respond quickly to urgent calls and patient needs"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Reduced Burnout",
      description: "Protect your daytime providers from fatigue and improve retention rates"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Scalable Coverage",
      description: "Full overnight coverage or supplemental backup—tailored to your needs"
    }
  ];

  const supportedFacilities = [
    {
      icon: <Hospital className="h-8 w-8" />,
      title: "Hospitals",
      description: "Admissions, cross-coverage calls, consults, and order requests"
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "LTACHs & Rehab Facilities",
      description: "After-hours patient management and urgent orders"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Skilled Nursing Facilities (SNFs)",
      description: "Reduce avoidable ER transfers with timely interventions"
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Large Outpatient Clinics",
      description: "Offload after-hours patient calls and triage needs"
    }
  ];

  const coverageOptions = [
    "Full Overnight Coverage: Continuous after-hours support",
    "Supplemental Coverage: Backup for peak or high-volume nights",
    "Rapid Start: Credentialing and EMR setup support",
    "Custom Models: Tailored to census size and facility needs"
  ];

  const results = [
    "Faster response times for overnight calls",
    "Fewer unnecessary transfers in SNF/LTACH settings",
    "Improved retention of daytime providers",
    "Predictable costs vs. full in-house staffing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEOHead
        title="Overnight On-Call Coverage | Lynk Health"
        description="Remote nocturnist and after-hours coverage for hospitals, LTACHs, SNFs, and clinics. Admissions, cross-coverage, consults, and orders—cost-effective, reliable night operations."
        keywords="overnight on-call coverage, nocturnist services, after-hours coverage, telehospitalist, remote physician coverage, hospital night coverage, SNF coverage, LTACH coverage"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <div className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
                  Night Coverage Solutions
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Overnight On-Call Coverage
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Flexible nocturnist support across hospitals, SNFs, and clinics—admissions, cross-coverage, consults, and orders when you need them most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="#contact-form">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                    Discuss Night Coverage
                  </Button>
                </a>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all">
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/AdobeStock_419808796_1751485954770.jpeg"
                  alt="Healthcare professional providing overnight on-call coverage services"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-center">
                      <Moon className="mr-2 h-5 w-5 text-primary" />
                      24/7 Night Coverage
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our licensed clinicians provide reliable overnight support for hospitals, SNFs, and clinics nationwide.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Licensed NPs & MDs</span>
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">EMR Integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Nocturnist Coverage Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What Is Nocturnist Coverage?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nocturnist coverage refers to after-hours or overnight clinical support provided by licensed nurse practitioners and physicians who focus specifically on night shifts. Instead of requiring in-house staff to remain on call, facilities can rely on Lynk Health's remote team to handle admissions, calls, consults, and urgent orders during the night. This reduces burnout for daytime providers and ensures continuous, high-quality patient care.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Support Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our night coverage services are designed for various healthcare settings that need reliable after-hours clinical support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportedFacilities.map((facility, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-105 transition-transform">
                    {facility.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{facility.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lynk Health Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Lynk Health
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telehospitalist Services Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              Telehospitalist Services (Legacy Offering)
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Our telehospitalist program is a proven model for hospitals needing dependable inpatient night coverage. We manage admissions, cross-coverage, consults, and orders, acting as a natural extension of your team. This service remains part of our broader nocturnist program.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Options Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Coverage Options
              </h2>
              <ul className="space-y-4">
                {coverageOptions.map((option, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{option}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Results That Matter
              </h2>
              <ul className="space-y-4">
                {results.map((result, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-muted-foreground">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border-0 px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                What is nocturnist coverage?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                It's dedicated clinical support during overnight or after-hours shifts, typically provided remotely by licensed nurse practitioners or physicians.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border-0 px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                Who provides the coverage?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Experienced NPs and physicians credentialed and trained in inpatient and after-hours workflows.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border-0 px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                Can we start with backup coverage?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, many partners begin with supplemental support and expand as needed.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border-0 px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                How do you bill?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Flexible models: hourly coverage or per-encounter, depending on census.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border-0 px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                Do you integrate with our EMR?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes—we work within your EMR whenever possible to keep workflows seamless.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Discuss Night Coverage
            </h2>
            <p className="text-lg text-muted-foreground">
              Tell us about your facility's needs and we'll customize a coverage solution for you.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700">
                We've received your inquiry and will contact you within 1 business day to discuss your night coverage needs.
              </p>
            </div>
          ) : (
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name *</Label>
                      <Input
                        id="organizationName"
                        {...register("organizationName")}
                        placeholder="Your healthcare organization"
                        className={errors.organizationName ? "border-red-500" : ""}
                        data-testid="input-organization-name"
                      />
                      {errors.organizationName && (
                        <p className="text-red-500 text-sm">{errors.organizationName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        {...register("contactName")}
                        placeholder="Your full name"
                        className={errors.contactName ? "border-red-500" : ""}
                        data-testid="input-contact-name"
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm">{errors.contactName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Input
                        id="role"
                        {...register("role")}
                        placeholder="e.g., CNO, Medical Director, Administrator"
                        className={errors.role ? "border-red-500" : ""}
                        data-testid="input-role"
                      />
                      {errors.role && (
                        <p className="text-red-500 text-sm">{errors.role.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="your.email@organization.com"
                        className={errors.email ? "border-red-500" : ""}
                        data-testid="input-email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="(555) 123-4567"
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="careSetting">Care Setting *</Label>
                      <Select onValueChange={(value) => setValue("careSetting", value)} required>
                        <SelectTrigger className={errors.careSetting ? "border-red-500" : ""} data-testid="select-care-setting">
                          <SelectValue placeholder="Select your care setting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="ltach-rehab">LTACH/Rehab</SelectItem>
                          <SelectItem value="snf-nursing-home">SNF/Nursing Home</SelectItem>
                          <SelectItem value="outpatient-clinic">Outpatient Clinic</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.careSetting && (
                        <p className="text-red-500 text-sm">{errors.careSetting.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedVolume">Expected Nightly Volume *</Label>
                    <Input
                      id="expectedVolume"
                      {...register("expectedVolume")}
                      placeholder="e.g., 5-10 calls per night, 20-30 patients, varies by season"
                      className={errors.expectedVolume ? "border-red-500" : ""}
                      data-testid="input-expected-volume"
                    />
                    {errors.expectedVolume && (
                      <p className="text-red-500 text-sm">{errors.expectedVolume.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information (Optional)</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us more about your specific night coverage needs..."
                      className="min-h-[120px]"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-inquiry"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <Calendar className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}