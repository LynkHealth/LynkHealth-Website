import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  BarChart3,
  Smartphone,
  Target,
  TrendingUp,
  Heart,
  Stethoscope,
  Brain
} from "lucide-react";

export default function RTM() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white font-semibold">
                Remote Therapeutic Monitoring
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Patient Therapy with Remote Therapeutic Monitoring
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Generate $78+ per patient per month while improving rehabilitation outcomes, medication adherence, and chronic condition management through comprehensive RTM programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#contact">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Start RTM Program
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
                <h3 className="text-xl font-semibold mb-6">RTM Revenue Potential</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">$78</div>
                    <div className="text-sm text-white/80">Per Patient/Month</div>
                    <div className="text-xs text-white/60">Treatment Management</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">$65</div>
                    <div className="text-sm text-white/80">Per Patient/Month</div>
                    <div className="text-xs text-white/60">Device Supply</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">$56</div>
                    <div className="text-sm text-white/80">Per Setup</div>
                    <div className="text-xs text-white/60">Initial Education</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">16</div>
                    <div className="text-sm text-white/80">Days Minimum</div>
                    <div className="text-xs text-white/60">Data Collection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is RTM Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What is Remote Therapeutic Monitoring?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Remote Therapeutic Monitoring (RTM) enables healthcare providers to monitor patient therapy and treatment adherence using digital devices. Unlike RPM, RTM focuses on non-physiological data including medication adherence, pain levels, and rehabilitation progress.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cognitive Behavioral Therapy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor patient engagement with digital CBT programs, track mood patterns, and measure therapeutic progress remotely.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Rehabilitation Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track range of motion, exercise compliance, and physical therapy progress using motion sensors and wearable devices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Respiratory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor peak flow, spirometry results, and medication inhaler usage for patients with respiratory conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* RTM vs RPM Comparison */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              RTM vs RPM: Key Differences
            </h2>
            <p className="text-lg text-muted-foreground">
              Understanding the distinctions between Remote Therapeutic Monitoring and Remote Patient Monitoring
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-6 w-6 text-primary" />
                  Remote Therapeutic Monitoring (RTM)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Non-physiological data:</strong> Pain levels, medication adherence, exercise compliance, mood tracking
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>No established relationship required:</strong> Can start RTM with new patients
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>16-day minimum:</strong> Requires 16 days of data collection per 30-day period
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Broader provider eligibility:</strong> PTs, OTs, SLPs can bill RTM codes
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Patient or automatic data:</strong> Can include patient-reported outcomes
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20">
              <CardHeader className="bg-secondary/5">
                <CardTitle className="flex items-center">
                  <Stethoscope className="mr-2 h-6 w-6 text-secondary" />
                  Remote Patient Monitoring (RPM)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Physiological data:</strong> Blood pressure, weight, glucose, oxygen saturation
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Established relationship required:</strong> Must have recent provider interaction
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>16-day minimum:</strong> Same data collection requirement as RTM
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Physician/NPP focused:</strong> Limited to physicians and nurse practitioners
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Automatic transmission:</strong> Devices must automatically transmit data
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CPT Codes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              RTM CPT Codes & Reimbursement Rates
            </h2>
            <p className="text-lg text-muted-foreground">
              2025 Medicare reimbursement rates for Remote Therapeutic Monitoring services
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Setup and Device Codes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Setup & Device Supply Codes</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">98975 - Initial Setup & Education</h4>
                        <p className="text-sm text-muted-foreground">Device setup and patient education</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">$56</Badge>
                    </div>
                    <p className="text-sm">Billed once per episode of care. Includes device setup, patient training, and initial configuration.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">98976 - Respiratory System Monitoring</h4>
                        <p className="text-sm text-muted-foreground">30-day device supply</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">$65</Badge>
                    </div>
                    <p className="text-sm">Peak flow meters, spirometers. Requires 16+ days of data collection per month.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">98977 - Musculoskeletal Monitoring</h4>
                        <p className="text-sm text-muted-foreground">30-day device supply</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">$63</Badge>
                    </div>
                    <p className="text-sm">Motion sensors, activity trackers. Requires 16+ days of data collection per month.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">98978 - Cognitive Behavioral Therapy</h4>
                        <p className="text-sm text-muted-foreground">30-day device supply</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">$65</Badge>
                    </div>
                    <p className="text-sm">Digital therapy apps, mood tracking. Requires 16+ days of data collection per month.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Treatment Management Codes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Treatment Management Codes</h3>
              <div className="space-y-4">
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">98980 - Treatment Management</h4>
                        <p className="text-sm text-muted-foreground">First 20 minutes per month</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$78</Badge>
                    </div>
                    <p className="text-sm">Clinical staff time for data analysis, patient communication, and care plan adjustments. Requires interactive communication.</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">98981 - Additional Management</h4>
                        <p className="text-sm text-muted-foreground">Each additional 20 minutes</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">$39</Badge>
                    </div>
                    <p className="text-sm">Additional clinical time for complex patients. Can be billed multiple times per month as needed.</p>
                  </CardContent>
                </Card>

                {/* Revenue Calculator */}
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Monthly Revenue Example</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Setup (98975)</span>
                        <span>$56</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Device Supply (98976-98978)</span>
                        <span>$65</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Treatment Management (98980)</span>
                        <span>$78</span>
                      </div>
                      <div className="border-t pt-2 font-semibold flex justify-between">
                        <span>Total Per Patient</span>
                        <span>$199</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Setup is one-time. Monthly recurring revenue: $143
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Clinical & Financial Benefits
            </h2>
            <p className="text-lg text-muted-foreground">
              RTM programs deliver measurable improvements in patient outcomes and practice revenue
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Improved Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
                <p className="text-muted-foreground">
                  Increase in medication and therapy adherence with continuous RTM monitoring and patient engagement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Faster Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                <p className="text-muted-foreground">
                  Reduction in rehabilitation time for patients with continuous monitoring and feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">$143</div>
                <p className="text-muted-foreground">
                  Monthly recurring revenue per patient with comprehensive RTM services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Patient Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary mb-2">92%</div>
                <p className="text-muted-foreground">
                  Patient satisfaction rate with RTM programs that provide continuous support and feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Reduced Readmissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent mb-2">35%</div>
                <p className="text-muted-foreground">
                  Decrease in hospital readmissions for patients enrolled in RTM programs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Provider Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">60%</div>
                <p className="text-muted-foreground">
                  Increase in provider efficiency through automated data collection and risk stratification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              RTM Implementation Process
            </h2>
            <p className="text-lg text-muted-foreground">
              Step-by-step approach to launching your Remote Therapeutic Monitoring program
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Program Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Identify target patient populations, select appropriate devices, and establish clinical protocols.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <CardTitle>Staff Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Train clinical staff on RTM workflows, device management, and patient engagement strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <CardTitle>Patient Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enroll eligible patients, provide device training, and establish monitoring schedules.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <CardTitle>Ongoing Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor patient data, provide interventions, and optimize care plans based on outcomes.
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
            Ready to Launch Your RTM Program?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join healthcare providers generating $143+ per patient monthly with Remote Therapeutic Monitoring. Our comprehensive platform includes devices, clinical support, and billing assistance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Complete Device Platform</h3>
              <p className="text-white/80 text-sm">FDA-approved devices for respiratory, musculoskeletal, and cognitive monitoring.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Clinical Support</h3>
              <p className="text-white/80 text-sm">Dedicated clinical staff to manage patient data and provide interventions.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Billing Management</h3>
              <p className="text-white/80 text-sm">Complete RTM billing support to maximize reimbursement and ensure compliance.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Your RTM Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/calculator">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <DollarSign className="mr-2 h-5 w-5" />
                Calculate RTM Revenue
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}