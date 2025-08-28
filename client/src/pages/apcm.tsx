import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  BarChart3,
  Clock,
  Shield,
  Target,
  TrendingUp,
  Heart,
  Stethoscope,
  Calendar,
  FileText
} from "lucide-react";

export default function APCM() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white font-semibold">
                Advanced Primary Care Management
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Primary Care with Advanced Care Management
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Generate up to $110 per patient per month with CMS's new Advanced Primary Care Management codes. Comprehensive care coordination with reduced administrative burden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#contact">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Start APCM Program
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/calculator">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Calculate Revenue
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold mb-6">APCM Revenue Tiers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Level 1 (G0556)</div>
                      <div className="text-sm text-white/80">≤1 chronic condition</div>
                    </div>
                    <div className="text-2xl font-bold text-secondary">$15</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Level 2 (G0557)</div>
                      <div className="text-sm text-white/80">≥2 chronic conditions</div>
                    </div>
                    <div className="text-2xl font-bold text-secondary">$50</div>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/20 pt-4">
                    <div>
                      <div className="font-semibold">Level 3 (G0558)</div>
                      <div className="text-sm text-white/80">QMB + ≥2 conditions</div>
                    </div>
                    <div className="text-3xl font-bold text-secondary">$110</div>
                  </div>
                </div>
                <p className="text-xs text-white/60 mt-4">Per patient per month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is APCM Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What is Advanced Primary Care Management?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              APCM is CMS's newest primary care program, effective January 1, 2025. It provides monthly payments to practices that serve as the continuing focal point for comprehensive primary care services using advanced care models.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Comprehensive Care Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Serve as the central hub for all patient healthcare needs, coordinating services across providers and settings.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>24/7 Access & Continuity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Provide round-the-clock access for urgent needs with continuous care management and coordination.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Quality-Focused Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrated quality reporting and performance measurement tied to the Value in Primary Care MIPS pathway.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* APCM Codes & Reimbursement */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              APCM Codes & Reimbursement Rates
            </h2>
            <p className="text-lg text-muted-foreground">
              Three-tiered payment structure based on patient complexity and eligibility
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-blue-800">Level 1 - G0556</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">$15/month</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Patient Criteria:</h4>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Medicare beneficiaries with ≤1 chronic condition
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Require ongoing primary care management
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Benefit from coordinated care services
                  </li>
                </ul>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-700">
                    <strong>Annual Revenue:</strong> $180 per patient
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader className="bg-amber-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-amber-800">Level 2 - G0557</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800 text-lg px-3 py-1">$50/month</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Patient Criteria:</h4>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    Medicare beneficiaries with ≥2 chronic conditions
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    Conditions lasting 12+ months
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    Require complex care coordination
                  </li>
                </ul>
                <div className="bg-amber-50 p-3 rounded">
                  <p className="text-xs text-amber-700">
                    <strong>Annual Revenue:</strong> $600 per patient
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/40 shadow-lg">
              <CardHeader className="bg-primary/5">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-primary">Level 3 - G0558</CardTitle>
                  <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">$110/month</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Patient Criteria:</h4>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Qualified Medicare Beneficiaries (QMB)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    ≥2 chronic conditions lasting 12+ months
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Higher complexity care needs
                  </li>
                </ul>
                <div className="bg-primary/5 p-3 rounded">
                  <p className="text-xs text-primary">
                    <strong>Annual Revenue:</strong> $1,320 per patient
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Example */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  APCM Revenue Example (1,000 patients)
                </h3>
                <p className="text-muted-foreground">
                  Typical patient distribution and annual revenue potential
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Level 1 (400 patients)</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$72,000</div>
                  <div className="text-xs text-muted-foreground">$15 × 400 × 12 months</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Level 2 (500 patients)</div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">$300,000</div>
                  <div className="text-xs text-muted-foreground">$50 × 500 × 12 months</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="text-sm text-muted-foreground mb-1">Level 3 (100 patients)</div>
                  <div className="text-3xl font-bold text-primary mb-2">$132,000</div>
                  <div className="text-xs text-muted-foreground">$110 × 100 × 12 months</div>
                </div>
              </div>
              
              <div className="text-center mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-lg font-semibold text-foreground">Total Annual APCM Revenue</div>
                <div className="text-4xl font-bold text-primary">$504,000</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 13 Core Service Elements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              13 Core Service Elements
            </h2>
            <p className="text-lg text-muted-foreground">
              APCM requires capability to provide all 13 service elements, tailored to individual patient needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Access & Continuity</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">24/7 Access for Urgent Needs</h4>
                        <p className="text-sm text-muted-foreground">Round-the-clock availability for urgent patient needs and clinical support.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <FileText className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Real-Time Medical Information Access</h4>
                        <p className="text-sm text-muted-foreground">Immediate access to patient medical records and clinical data.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Calendar className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Successive Routine Appointments</h4>
                        <p className="text-sm text-muted-foreground">Ability to schedule follow-up visits and maintain care continuity.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Heart className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Alternative Care Delivery</h4>
                        <p className="text-sm text-muted-foreground">Home visits, expanded hours, and flexible care delivery options.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Care Management & Coordination</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Stethoscope className="h-6 w-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Comprehensive Needs Assessment</h4>
                        <p className="text-sm text-muted-foreground">Systematic evaluation of medical, psychological, and social needs.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Target className="h-6 w-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">System-Based Care Approaches</h4>
                        <p className="text-sm text-muted-foreground">Structured processes to ensure comprehensive care delivery.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <ArrowRight className="h-6 w-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Care Transitions & Coordination</h4>
                        <p className="text-sm text-muted-foreground">Seamless transitions between providers and healthcare settings.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <FileText className="h-6 w-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Electronic Care Planning</h4>
                        <p className="text-sm text-muted-foreground">Comprehensive electronic care plans accessible to patients and providers.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-center">Additional APCM Service Elements</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Patient and family engagement</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Population health management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Enhanced communication systems</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Quality measurement and reporting</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Advanced care team integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APCM vs Other Programs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              APCM vs. Other Care Management Programs
            </h2>
            <p className="text-lg text-muted-foreground">
              Understanding how APCM compares to existing Medicare programs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Program Feature</th>
                  <th className="text-center p-4 font-semibold text-primary">APCM</th>
                  <th className="text-center p-4 font-semibold">CCM</th>
                  <th className="text-center p-4 font-semibold">PCM</th>
                  <th className="text-center p-4 font-semibold">TCM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Time Requirements</td>
                  <td className="p-4 text-center">
                    <Badge className="bg-green-100 text-green-800">None</Badge>
                  </td>
                  <td className="p-4 text-center">20+ minutes</td>
                  <td className="p-4 text-center">30+ minutes</td>
                  <td className="p-4 text-center">Varies</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Monthly Payment</td>
                  <td className="p-4 text-center font-bold text-primary">$15-$110</td>
                  <td className="p-4 text-center">$50.42</td>
                  <td className="p-4 text-center">$58.75</td>
                  <td className="p-4 text-center">Per encounter</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Administrative Burden</td>
                  <td className="p-4 text-center">
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </td>
                  <td className="p-4 text-center">Moderate</td>
                  <td className="p-4 text-center">Moderate</td>
                  <td className="p-4 text-center">High</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Concurrent Billing</td>
                  <td className="p-4 text-center">Limited</td>
                  <td className="p-4 text-center">Yes</td>
                  <td className="p-4 text-center">Yes</td>
                  <td className="p-4 text-center">Limited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Quality Requirements</td>
                  <td className="p-4 text-center">
                    <Badge className="bg-primary/10 text-primary">MIPS MVP</Badge>
                  </td>
                  <td className="p-4 text-center">Optional</td>
                  <td className="p-4 text-center">Optional</td>
                  <td className="p-4 text-center">Optional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              APCM Program Benefits
            </h2>
            <p className="text-lg text-muted-foreground">
              Strategic advantages of implementing Advanced Primary Care Management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Stable Revenue Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Predictable monthly payments based on patient population, not time spent. Reduces billing complexity and administrative burden.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Reduced Administrative Burden</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No time-based documentation requirements. Services tailored to patient needs rather than billing thresholds.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Value-Based Care Alignment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrated with MIPS Value Pathway. Positions practices for future value-based contracts and quality bonuses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Comprehensive Patient Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Serve as continuing focal point for all patient healthcare needs. Improve outcomes through coordinated care.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Quality Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built-in quality measurement and reporting. Enhances practice reputation and patient outcomes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Strategic Positioning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ideal for ACO participants and value-based care models. Aligns with CMS primary care transformation goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              APCM Implementation Process
            </h2>
            <p className="text-lg text-muted-foreground">
              Step-by-step approach to launching your Advanced Primary Care Management program
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Assessment & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Evaluate current capabilities against 13 service elements. Develop implementation strategy and resource plan.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <CardTitle>Infrastructure Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Implement 24/7 access systems, care coordination workflows, and electronic care planning capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <CardTitle>Quality Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up Value in Primary Care MIPS pathway reporting and quality measurement systems.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <CardTitle>Launch & Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Begin patient enrollment, initiate billing, and continuously optimize service delivery based on outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Implement APCM?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join forward-thinking practices generating up to $110 per patient monthly with Advanced Primary Care Management. Our comprehensive platform handles infrastructure, quality reporting, and care coordination.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Complete Service Elements</h3>
              <p className="text-white/80 text-sm">Implementation of all 13 required APCM service capabilities.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Quality Reporting</h3>
              <p className="text-white/80 text-sm">Value in Primary Care MIPS pathway setup and ongoing management.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Revenue Optimization</h3>
              <p className="text-white/80 text-sm">Patient stratification and billing optimization to maximize APCM revenue.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Your APCM Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/calculator">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <DollarSign className="mr-2 h-5 w-5" />
                Calculate APCM Revenue
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}