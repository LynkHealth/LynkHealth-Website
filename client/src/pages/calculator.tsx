import { SEOHead } from "@/components/SEOHead";
import RevenueCalculator from "@/components/RevenueCalculator";

export default function Calculator() {
  return (
    <>
      <SEOHead
        title="Medicare Care Management Revenue Calculator | Lynk Health"
        description="Calculate your potential revenue from Medicare's CCM, RPM, RTM, APCM, and BHI programs. Free calculator with 2025 reimbursement rates showing up to $2,457 annual savings per patient."
        keywords="Medicare revenue calculator, CCM calculator, RPM calculator, RTM calculator, APCM calculator, chronic care management revenue, remote patient monitoring revenue"
      />
      
      <div className="pt-16">
        <RevenueCalculator />
      </div>
    </>
  );
}