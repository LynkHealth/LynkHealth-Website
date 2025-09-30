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
import { Bandage, Activity, Package, Microscope, Shield, Users, TrendingDown, CheckCircle, Heart, Clock, Hospital, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SEOHead } from "@/components/SEOHead";
import { insertWoundCareReferralSchema } from "@shared/schema";

const woundCareFormSchema = insertWoundCareReferralSchema;

type WoundCareForm = z.infer<typeof woundCareFormSchema>;

export default function ChronicWoundManagement() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<WoundCareForm>({
    resolver: zodResolver(woundCareFormSchema),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: WoundCareForm) => {
      try {
        return await apiRequest("POST", "/api/referrals/wound-care", data);
      } catch (error) {
        // Fallback to mailto if API fails
        const subject = encodeURIComponent('Wound Care Referral - ' + data.patientName);
        const body = encodeURIComponent(
          `Provider Name: ${data.providerName}\n` +
          `Organization: ${data.organization}\n` +
          `Role: ${data.role || 'Not provided'}\n` +
          `Email: ${data.email}\n` +
          `Phone: ${data.phone || 'Not provided'}\n\n` +
          `Patient Name: ${data.patientName}\n` +
          `Patient DOB: ${data.patientDob}\n` +
          `Diagnosis/Wound Type: ${data.diagnosisWoundType}\n` +
          `Care Setting: ${data.careSetting}\n` +
          `Urgency: ${data.urgency}\n` +
          `Notes: ${data.notes || 'No additional notes'}`
        );
        window.location.href = `mailto:hello@lynk.health?subject=${subject}&body=${body}`;
        return { success: true, fallback: true };
      }
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Referral Submitted",
        description: "We'll contact you within 1 business day to coordinate the patient's wound care pathway.",
      });

      // Analytics event
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'wound_referral_submitted', {
          event_category: 'engagement',
          event_label: 'wound_care_referral'
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

  const onSubmit = (data: WoundCareForm) => {
    // Analytics for CTA click
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'wound_referral_cta_clicked', {
        event_category: 'engagement',
        event_label: 'refer_patient_button'
      });
    }
    submitMutation.mutate(data);
  };

  const networkComponents = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Care Coordination + CCM Backbone",
      description: "Dedicated care managers, monthly CCM touchpoints, structured education, medication and comorbidity support, and closed-loop updates to the referring provider"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Remote Monitoring of Wound Progress",
      description: "Secure check-ins, photo/measurement capture (where supported), adherence tracking, escalation rules, and summary reports"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Conservative Wound Care Products",
      description: "Dressings, wraps, and DME delivered fast, with usage guidance and re-supply coordination"
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Advanced Wound Therapies",
      description: "Skin substitutes, grafts, and biologics via our partner network when wounds require escalation"
    }
  ];

  const providerBenefits = [
    "One referral → end-to-end pathway (supplies, advanced therapies, monitoring, CCM)",
    "Less administrative burden; better continuity between visits",
    "Closed-loop communication and data summaries for your EMR/workflows",
    "Reimbursement guidance for eligible services and products"
  ];

  const patientBenefits = [
    "Faster access to the right products and therapies",
    "Continuous support between visits (CCM + remote monitoring)",
    "Fewer ER visits/hospitalizations; better adherence and education",
    "Clear escalation if healing stalls"
  ];

  const servingSettings = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Primary Care & Specialty Clinics",
      description: "Endocrinology, Vascular, Podiatry"
    },
    {
      icon: <Hospital className="h-8 w-8" />,
      title: "Hospitals",
      description: "Post-discharge/transitional wound care"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Skilled Nursing & Long-Term Care",
      description: "Continuous wound management support"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Home Health Agencies",
      description: "In-home wound care coordination"
    }
  ];

  return (
    <>
      <SEOHead
        title="Chronic Wound Management | Lynk Health"
        description="Referral-driven wound program powered by remote monitoring and CCM—coordinating conservative supplies and advanced therapies through our partner network."
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-primary to-secondary overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/elderly-patient-care.jpeg')] opacity-10 bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30" data-testid="badge-wound-care">
                <Bandage className="w-4 h-4 mr-2" />
                Chronic Wound Management
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white" data-testid="heading-wound-care">
                Chronic Wound Management
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                A referral-first wound care network powered by remote monitoring and CCM—linking providers, patients, and product partners through one coordinated platform.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6 text-lg"
                onClick={() => document.getElementById('referral-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-refer-patient-hero"
              >
                Refer a Patient
              </Button>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                The Problem We Solve
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Chronic wounds demand consistent, longitudinal care. Practices often juggle supplies, advanced therapies, and follow-up without a simple way to keep everyone aligned. The result: delays, complications, and avoidable hospitalizations. <strong>Lynk Health</strong> fixes that by building a <strong>referral network</strong> with <strong>remote monitoring and CCM</strong> at its core.
              </p>
            </div>
          </div>
        </section>

        {/* Referral Network Section */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Our Referral Network (We're the "Lynk")
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                With a single referral, Lynk coordinates the entire wound pathway and keeps it connected over time:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {networkComponents.map((component, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        {component.icon}
                      </div>
                      <CardTitle className="text-xl">{component.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{component.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              How It Works
            </h2>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                { num: 1, title: "Refer", desc: "Submit a secure referral to Lynk." },
                { num: 2, title: "Assess & Plan", desc: "We coordinate an initial wound assessment and plan of care." },
                { num: 3, title: "Supply & Educate", desc: "Conservative products shipped with training; adherence reinforced in CCM." },
                { num: 4, title: "Escalate When Needed", desc: "Non-healing wounds are triaged for advanced therapies through partners." },
                { num: 5, title: "Monitor & Report", desc: "Ongoing remote monitoring + CCM follow-ups; structured reports to providers; clear escalation pathways." }
              ].map((step) => (
                <div key={step.num} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Providers Choose Lynk */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                  Why Providers Choose Lynk
                </h2>
                <ul className="space-y-4">
                  {providerBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-lg text-slate-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                  Why Patients Benefit
                </h2>
                <ul className="space-y-4">
                  {patientBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-lg text-slate-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Who We Serve
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {servingSettings.map((setting, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8">
                    <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-4">
                      {setting.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-900">{setting.title}</h3>
                    <p className="text-slate-600">{setting.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Results That Matter
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <TrendingDown className="h-8 w-8" />, text: "Faster wound healing, fewer complications and readmissions" },
                { icon: <Activity className="h-8 w-8" />, text: "Consistent longitudinal support via CCM + remote monitoring" },
                { icon: <Shield className="h-8 w-8" />, text: "Lower workload for clinic teams; better patient experience" },
                { icon: <CheckCircle className="h-8 w-8" />, text: "Predictable, compliant reimbursement pathways" }
              ].map((result, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
                    {result.icon}
                  </div>
                  <p className="text-lg">{result.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How do I refer a patient?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Use the secure referral form below—Lynk coordinates the rest.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Do you support remote monitoring?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Yes. We track wound progress, adherence, and red flags, and summarize for providers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How does this tie into CCM?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  CCM is the backbone of our longitudinal support, keeping patients engaged and closing the loop monthly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What products are included?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Conservative supplies (dressings, wraps, NPWT/DME) and advanced therapies (skin substitutes, grafts, biologics) via partners.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Who are eligible patients/settings?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Chronic or non-healing wounds across outpatient, SNF, home health, and post-discharge settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Do you provide billing support?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  We provide coding and reimbursement guidance for eligible services and products.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Referral Form Section */}
        <section id="referral-form" className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Ready to refer a wound care patient?
              </h2>
              <p className="text-lg text-slate-600">
                Complete the form below and we'll coordinate the entire wound care pathway.
              </p>
            </div>

            {isSubmitted ? (
              <Card className="border-2 border-primary">
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Referral Received!</h3>
                  <p className="text-lg text-slate-600 mb-6">
                    Thank you for your referral. We'll contact you within 1 business day to coordinate the patient's wound care pathway.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    data-testid="button-submit-another"
                  >
                    Submit Another Referral
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Provider Information */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-slate-900">Provider Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="providerName">Provider Name *</Label>
                          <Input
                            id="providerName"
                            {...register("providerName")}
                            placeholder="Dr. Jane Smith"
                            data-testid="input-provider-name"
                          />
                          {errors.providerName && (
                            <p className="text-sm text-red-600 mt-1">{errors.providerName.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="organization">Organization *</Label>
                          <Input
                            id="organization"
                            {...register("organization")}
                            placeholder="ABC Medical Center"
                            data-testid="input-organization"
                          />
                          {errors.organization && (
                            <p className="text-sm text-red-600 mt-1">{errors.organization.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          {...register("role")}
                          placeholder="Physician, Nurse Practitioner, etc."
                          data-testid="input-role"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="provider@example.com"
                            data-testid="input-email"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            placeholder="(555) 123-4567"
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Patient Information */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-xl font-semibold text-slate-900">Patient Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patientName">Patient Name *</Label>
                          <Input
                            id="patientName"
                            {...register("patientName")}
                            placeholder="John Doe"
                            data-testid="input-patient-name"
                          />
                          {errors.patientName && (
                            <p className="text-sm text-red-600 mt-1">{errors.patientName.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="patientDob">Date of Birth *</Label>
                          <Input
                            id="patientDob"
                            type="date"
                            {...register("patientDob")}
                            data-testid="input-patient-dob"
                          />
                          {errors.patientDob && (
                            <p className="text-sm text-red-600 mt-1">{errors.patientDob.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="diagnosisWoundType">Diagnosis/Wound Type *</Label>
                        <Input
                          id="diagnosisWoundType"
                          {...register("diagnosisWoundType")}
                          placeholder="Diabetic foot ulcer, pressure ulcer, etc."
                          data-testid="input-diagnosis"
                        />
                        {errors.diagnosisWoundType && (
                          <p className="text-sm text-red-600 mt-1">{errors.diagnosisWoundType.message}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="careSetting">Care Setting *</Label>
                          <Select onValueChange={(value) => setValue("careSetting", value)}>
                            <SelectTrigger id="careSetting" data-testid="select-care-setting">
                              <SelectValue placeholder="Select care setting" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Practice">Practice</SelectItem>
                              <SelectItem value="Specialty Clinic">Specialty Clinic</SelectItem>
                              <SelectItem value="SNF">SNF</SelectItem>
                              <SelectItem value="Hospital">Hospital</SelectItem>
                              <SelectItem value="Home Health">Home Health</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.careSetting && (
                            <p className="text-sm text-red-600 mt-1">{errors.careSetting.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="urgency">Urgency *</Label>
                          <Select onValueChange={(value) => setValue("urgency", value)}>
                            <SelectTrigger id="urgency" data-testid="select-urgency">
                              <SelectValue placeholder="Select urgency level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Routine">Routine</SelectItem>
                              <SelectItem value="Priority">Priority</SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.urgency && (
                            <p className="text-sm text-red-600 mt-1">{errors.urgency.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          {...register("notes")}
                          rows={4}
                          placeholder="Any additional information about the patient or wound..."
                          data-testid="textarea-notes"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-referral"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Submit Referral"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Wound Care with Lynk Health
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our referral network and provide your patients with coordinated, comprehensive wound care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-100 font-semibold"
                onClick={() => document.getElementById('referral-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-refer-patient-cta"
              >
                Refer a Patient
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
                data-testid="button-contact-us"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
