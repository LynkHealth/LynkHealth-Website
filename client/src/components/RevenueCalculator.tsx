import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, TrendingUp, Users } from "lucide-react";

export default function RevenueCalculator() {
  const [totalMedicarePatients, setTotalMedicarePatients] = useState(500);
  const [ccmEligiblePercent, setCcmEligiblePercent] = useState(30);
  const [ccmEnrollmentRate, setCcmEnrollmentRate] = useState(20);
  const [rpmEligiblePercent, setRpmEligiblePercent] = useState(15);
  const [rpmEnrollmentRate, setRpmEnrollmentRate] = useState(25);

  // 2025 Medicare reimbursement rates
  const CCM_MONTHLY_RATE = 42.60; // CPT 99490
  const RPM_MONTHLY_RATE = 58.40; // CPT 99457 + 99458

  // Calculations
  const ccmEligiblePatients = Math.round((totalMedicarePatients * ccmEligiblePercent) / 100);
  const ccmEnrolledPatients = Math.round((ccmEligiblePatients * ccmEnrollmentRate) / 100);
  const rpmEligiblePatients = Math.round((totalMedicarePatients * rpmEligiblePercent) / 100);
  const rpmEnrolledPatients = Math.round((rpmEligiblePatients * rpmEnrollmentRate) / 100);

  const monthlyRevenue = (ccmEnrolledPatients * CCM_MONTHLY_RATE) + (rpmEnrolledPatients * RPM_MONTHLY_RATE);
  const annualRevenue = monthlyRevenue * 12;

  const handleContactUs = () => {
    window.location.href = '/contact';
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
              Revenue Calculator
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Discover Your CCM & RPM Revenue Potential
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Use our calculator to project your monthly and annual revenue from Medicare's Chronic Care Management 
            and Remote Patient Monitoring programs using 2025 reimbursement rates.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Input */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calculator className="h-6 w-6" />
                Practice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label htmlFor="medicare-patients" className="text-sm font-semibold text-foreground mb-2 block">
                  Total Medicare Patients
                </Label>
                <Input
                  id="medicare-patients"
                  type="number"
                  value={totalMedicarePatients}
                  onChange={(e) => setTotalMedicarePatients(Number(e.target.value))}
                  className="text-lg h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ccm-eligible" className="text-sm font-semibold text-foreground mb-2 block">
                    CCM Eligible (%)
                  </Label>
                  <Input
                    id="ccm-eligible"
                    type="number"
                    value={ccmEligiblePercent}
                    onChange={(e) => setCcmEligiblePercent(Number(e.target.value))}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="ccm-enrollment" className="text-sm font-semibold text-foreground mb-2 block">
                    CCM Enrollment (%)
                  </Label>
                  <Input
                    id="ccm-enrollment"
                    type="number"
                    value={ccmEnrollmentRate}
                    onChange={(e) => setCcmEnrollmentRate(Number(e.target.value))}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rpm-eligible" className="text-sm font-semibold text-foreground mb-2 block">
                    RPM Eligible (%)
                  </Label>
                  <Input
                    id="rpm-eligible"
                    type="number"
                    value={rpmEligiblePercent}
                    onChange={(e) => setRpmEligiblePercent(Number(e.target.value))}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="rpm-enrollment" className="text-sm font-semibold text-foreground mb-2 block">
                    RPM Enrollment (%)
                  </Label>
                  <Input
                    id="rpm-enrollment"
                    type="number"
                    value={rpmEnrollmentRate}
                    onChange={(e) => setRpmEnrollmentRate(Number(e.target.value))}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-semibold mb-2">2025 Medicare Reimbursement Rates:</p>
                <p>• CCM (CPT 99490): ${CCM_MONTHLY_RATE}/month per patient</p>
                <p>• RPM (CPT 99457/99458): ${RPM_MONTHLY_RATE}/month per patient</p>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Results */}
          <div className="space-y-6">
            {/* Monthly Revenue */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-secondary to-red-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">Monthly Revenue</h3>
                </div>
                <div className="text-4xl font-bold mb-2">
                  ${monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-white/80">
                  <p>{ccmEnrolledPatients} CCM patients × ${CCM_MONTHLY_RATE}</p>
                  <p>{rpmEnrolledPatients} RPM patients × ${RPM_MONTHLY_RATE}</p>
                </div>
              </CardContent>
            </Card>

            {/* Annual Revenue */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-primary to-blue-700 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">Annual Revenue</h3>
                </div>
                <div className="text-4xl font-bold mb-2">
                  ${annualRevenue.toLocaleString()}
                </div>
                <div className="text-white/80">
                  Additional revenue potential from CCM & RPM programs
                </div>
              </CardContent>
            </Card>

            {/* Patient Breakdown */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Patient Enrollment</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary mb-1">{ccmEnrolledPatients}</div>
                    <div className="text-sm text-muted-foreground">CCM Patients</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-secondary mb-1">{rpmEnrolledPatients}</div>
                    <div className="text-sm text-muted-foreground">RPM Patients</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Ready to Turn This Into Reality?</h3>
                <p className="mb-6 text-green-50">
                  Lynk Health can implement these programs for you with zero upfront cost. 
                  We handle all the staff, technology, and compliance so you can focus on patient care.
                </p>
                <Button 
                  onClick={handleContactUs}
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-lg shadow-lg"
                >
                  Contact Us to Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Why Choose Lynk Health for CCM & RPM?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">No Upfront Costs</h4>
              <p className="text-muted-foreground">We only succeed when you do. No hiring, training, or technology investments required.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Dedicated Care Team</h4>
              <p className="text-muted-foreground">Licensed nurses and care coordinators handle all patient interactions and documentation.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Proven Results</h4>
              <p className="text-muted-foreground">97% care plan adherence and 30% average revenue uplift for our healthcare partners.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}