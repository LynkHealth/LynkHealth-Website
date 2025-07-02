import { SEOHead } from "@/components/SEOHead";
import RevenueCalculator from "@/components/RevenueCalculator";

export default function Calculator() {
  return (
    <>
      <SEOHead
        title="CCM & RPM Revenue Calculator | Lynk Health"
        description="Calculate your potential revenue from Medicare's Chronic Care Management and Remote Patient Monitoring programs. Free calculator with 2025 reimbursement rates."
        keywords="CCM calculator, RPM calculator, Medicare revenue, chronic care management calculator, remote patient monitoring revenue"
      />
      
      <div className="pt-16">
        <RevenueCalculator />
      </div>
    </>
  );
}