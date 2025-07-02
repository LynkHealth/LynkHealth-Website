import React, { useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, TrendingUp, Users } from "lucide-react";

// Medicare billing codes and rates
const CCM_CODES = {
  '99490': { rate: 60.49, name: 'Initial 20 minutes (clinical staff)' },
  '99439': { rate: 45.93, name: 'Each additional 20 minutes (clinical staff)' },
  '99487': { rate: 131.65, name: 'Complex CCM initial 60 minutes' },
  '99489': { rate: 70.52, name: 'Complex CCM each additional 30 minutes' },
};

const RPM_CODES = {
  '99453': { rate: 19.73, name: 'Setup and patient education' },
  '99454': { rate: 43.02, name: 'Device supply with daily recordings' },
  '99457': { rate: 48.14, name: 'Initial 20 minutes of treatment management' },
  '99458': { rate: 38.49, name: 'Each additional 20 minutes' }
};

export default function RevenueCalculator() {
  const [patientCount, setPatientCount] = useState(100);
  const [ccmParticipation, setCcmParticipation] = useState(50);
  const [rpmParticipation, setRpmParticipation] = useState(35);
  
  const [add20MinPercentage, setAdd20MinPercentage] = useState(20);
  const [add20MinTwicePercentage, setAdd20MinTwicePercentage] = useState(10);
  const [complexCCMPercentage, setComplexCCMPercentage] = useState(3);
  const [complexCCMAddPercentage, setComplexCCMAddPercentage] = useState(1);
  const [completedCareRate, setCompletedCareRate] = useState(97);
  const [rpmDeviceReadingsPercentage, setRPMDeviceReadingsPercentage] = useState(75);

  const calculateMonthlyRevenue = useCallback((ccmPatients: number, rpmPatients: number) => {
    let ccmRevenue = 0;
    let rpmRevenue = 0;

    const completedCCMPatients = Math.round(ccmPatients * (completedCareRate / 100));
    const completedRPMPatients = Math.round(rpmPatients * (completedCareRate / 100));

    // CCM calculations
    ccmRevenue += completedCCMPatients * CCM_CODES['99490'].rate;
    
    const add20MinPatients = Math.round(completedCCMPatients * (add20MinPercentage / 100));
    ccmRevenue += add20MinPatients * CCM_CODES['99439'].rate;
    
    const add20MinTwicePatients = Math.round(completedCCMPatients * (add20MinTwicePercentage / 100));
    ccmRevenue += add20MinTwicePatients * CCM_CODES['99439'].rate * 2;
    
    const complexCCMPatients = Math.round(completedCCMPatients * (complexCCMPercentage / 100));
    ccmRevenue += complexCCMPatients * CCM_CODES['99487'].rate;
    
    const complexCCMAddPatients = Math.round(completedCCMPatients * (complexCCMAddPercentage / 100));
    ccmRevenue += complexCCMAddPatients * CCM_CODES['99489'].rate;

    // RPM calculations
    rpmRevenue += completedRPMPatients * RPM_CODES['99453'].rate;
    const rpmDevicePatients = Math.round(completedRPMPatients * (rpmDeviceReadingsPercentage / 100));
    rpmRevenue += rpmDevicePatients * RPM_CODES['99454'].rate;
    rpmRevenue += completedRPMPatients * RPM_CODES['99457'].rate;
    const rpmAdd20MinPatients = Math.round(completedRPMPatients * (add20MinPercentage / 100));
    rpmRevenue += rpmAdd20MinPatients * RPM_CODES['99458'].rate;

    return { ccmRevenue, rpmRevenue, totalRevenue: ccmRevenue + rpmRevenue };
  }, [add20MinPercentage, add20MinTwicePercentage, complexCCMPercentage, complexCCMAddPercentage, 
      completedCareRate, rpmDeviceReadingsPercentage]);

  const revenue = useMemo(() => {
    const ccmPatients = Math.round(patientCount * (ccmParticipation / 100));
    const rpmPatients = Math.round(patientCount * (rpmParticipation / 100));
    const { ccmRevenue, rpmRevenue, totalRevenue } = calculateMonthlyRevenue(ccmPatients, rpmPatients);
    const annualRevenue = totalRevenue * 12;

    return {
      ccmPatients,
      rpmPatients,
      ccmRevenue,
      rpmRevenue,
      monthlyRevenue: totalRevenue,
      annualRevenue,
    };
  }, [patientCount, ccmParticipation, rpmParticipation, calculateMonthlyRevenue]);

  const chartData = useMemo(() => {
    const rampRates = [0.1, 0.25, 0.5, 0.75, 1];
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const rampRate = rampRates[Math.min(Math.floor(i / 2), 4)];
      const ccmPatients = Math.round(patientCount * (ccmParticipation / 100) * rampRate);
      const rpmPatients = Math.round(patientCount * (rpmParticipation / 100) * rampRate);
      const { totalRevenue } = calculateMonthlyRevenue(ccmPatients, rpmPatients);
      return {
        month: `Month ${month}`,
        revenue: totalRevenue,
      };
    });
  }, [patientCount, ccmParticipation, rpmParticipation, calculateMonthlyRevenue]);

  const handleContactUs = () => {
    window.location.href = '/contact';
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-full">
              Advanced Revenue Calculator
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive CCM & RPM Revenue Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced calculator using actual Medicare billing codes and realistic practice patterns 
            to project your revenue from Chronic Care Management and Remote Patient Monitoring programs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Basic Inputs */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calculator className="h-6 w-6" />
                Basic Practice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label htmlFor="patients" className="text-sm font-semibold text-foreground mb-2 block">
                  Total Medicare Patients
                </Label>
                <Input
                  id="patients"
                  type="number"
                  value={patientCount}
                  onChange={(e) => setPatientCount(Number(e.target.value))}
                  className="text-lg h-12"
                />
              </div>

              <div>
                <Label htmlFor="ccm-participation" className="text-sm font-semibold text-foreground mb-2 block">
                  CCM Participation Rate (%)
                </Label>
                <Input
                  id="ccm-participation"
                  type="number"
                  value={ccmParticipation}
                  onChange={(e) => setCcmParticipation(Number(e.target.value))}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="rpm-participation" className="text-sm font-semibold text-foreground mb-2 block">
                  RPM Participation Rate (%)
                </Label>
                <Input
                  id="rpm-participation"
                  type="number"
                  value={rpmParticipation}
                  onChange={(e) => setRpmParticipation(Number(e.target.value))}
                  className="h-12"
                />
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
                  ${revenue.monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-white/80">
                  <p>CCM: ${revenue.ccmRevenue.toFixed(2)} ({revenue.ccmPatients} patients)</p>
                  <p>RPM: ${revenue.rpmRevenue.toFixed(2)} ({revenue.rpmPatients} patients)</p>
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
                  ${revenue.annualRevenue.toLocaleString()}
                </div>
                <div className="text-white/80">
                  Based on Medicare billing codes and completion rates
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Advanced Configuration */}
        <Card className="mt-12 shadow-xl border-0 bg-white">
          <CardHeader className="bg-slate-100 rounded-t-lg">
            <CardTitle className="text-xl text-foreground">Advanced Calculation Factors</CardTitle>
            <CardDescription>Fine-tune your revenue projections with realistic practice patterns</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Additional 20 min (%)</Label>
                <Input
                  type="number"
                  value={add20MinPercentage}
                  onChange={(e) => setAdd20MinPercentage(Number(e.target.value))}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Additional 20 min twice (%)</Label>
                <Input
                  type="number"
                  value={add20MinTwicePercentage}
                  onChange={(e) => setAdd20MinTwicePercentage(Number(e.target.value))}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Complex CCM (%)</Label>
                <Input
                  type="number"
                  value={complexCCMPercentage}
                  onChange={(e) => setComplexCCMPercentage(Number(e.target.value))}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Complex CCM additional (%)</Label>
                <Input
                  type="number"
                  value={complexCCMAddPercentage}
                  onChange={(e) => setComplexCCMAddPercentage(Number(e.target.value))}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Completed Care Rate (%)</Label>
                <Input
                  type="number"
                  value={completedCareRate}
                  onChange={(e) => setCompletedCareRate(Number(e.target.value))}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">RPM Device Readings (%)</Label>
                <Input
                  type="number"
                  value={rpmDeviceReadingsPercentage}
                  onChange={(e) => setRPMDeviceReadingsPercentage(Number(e.target.value))}
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="mt-12 shadow-xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">12-Month Revenue Projection</CardTitle>
            <CardDescription>
              Revenue ramp-up based on typical enrollment patterns:
              Months 1-2: 10%, Months 3-4: 25%, Months 5-6: 50%, Months 7-8: 75%, Months 9-12: 100%
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Medicare Billing Codes Reference */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg text-foreground">CCM Medicare Billing Codes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(CCM_CODES).map(([code, info]) => (
                  <div key={code} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-primary">{code}</div>
                      <div className="text-sm text-muted-foreground">{info.name}</div>
                    </div>
                    <div className="font-bold text-foreground">${info.rate}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-lg text-foreground">RPM Medicare Billing Codes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(RPM_CODES).map(([code, info]) => (
                  <div key={code} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-secondary">{code}</div>
                      <div className="text-sm text-muted-foreground">{info.name}</div>
                    </div>
                    <div className="font-bold text-foreground">${info.rate}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="mt-12 shadow-xl border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Implement These Programs?</h3>
            <p className="text-lg mb-8 text-green-50 max-w-3xl mx-auto">
              Lynk Health provides turnkey CCM and RPM services with zero upfront costs. 
              Our licensed nurses handle all patient care, documentation, and billing compliance 
              so you can focus on what you do best - providing excellent patient care.
            </p>
            <Button 
              onClick={handleContactUs}
              className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-4 text-lg rounded-lg shadow-lg"
            >
              Contact Us to Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}