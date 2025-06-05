export default function Privacy() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lynk Health ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or otherwise interact with us.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                As a healthcare technology company providing care coordination services, we adhere to the highest standards of data protection, including compliance with the Health Insurance Portability and Accountability Act (HIPAA) and other applicable privacy regulations.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may collect the following types of personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Contact information (name, email address, phone number, mailing address)</li>
                <li>Professional information (organization, title, role)</li>
                <li>Communication preferences and inquiry details</li>
                <li>Website usage data and analytics information</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">Protected Health Information (PHI)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Through our care coordination services, we may have access to protected health information as defined by HIPAA. All PHI is handled in accordance with HIPAA regulations and our Business Associate Agreements with covered entities.
              </p>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Providing and improving our care coordination services</li>
                <li>Responding to inquiries and providing customer support</li>
                <li>Communicating about our services and updates</li>
                <li>Compliance with legal and regulatory requirements</li>
                <li>Analytics and service optimization</li>
                <li>Marketing and business development (with your consent)</li>
              </ul>
            </div>

            {/* HIPAA Compliance */}
            <div className="mb-12 bg-healthcare-primary/5 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">HIPAA Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Lynk Health is committed to full compliance with the Health Insurance Portability and Accountability Act (HIPAA) and its implementing regulations. We maintain comprehensive policies and procedures to ensure the privacy and security of protected health information.
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-3">Our HIPAA Safeguards Include:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Administrative safeguards including workforce training and access controls</li>
                <li>Physical safeguards to protect electronic systems and equipment</li>
                <li>Technical safeguards including encryption and audit controls</li>
                <li>Business Associate Agreements with all partners handling PHI</li>
                <li>Regular risk assessments and security evaluations</li>
              </ul>
            </div>

            {/* CMS Compliance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">CMS Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our care coordination services are designed to meet all Centers for Medicare & Medicaid Services (CMS) requirements for reimbursable care coordination programs, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Chronic Care Management (CCM) program requirements</li>
                <li>Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) regulations</li>
                <li>Behavioral Health Integration (BHI) service standards</li>
                <li>Documentation and billing compliance requirements</li>
                <li>Quality reporting and outcome measurement standards</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>With healthcare providers as necessary for care coordination services</li>
                <li>With authorized business associates under appropriate agreements</li>
                <li>As required by law or regulation</li>
                <li>To protect our rights, property, or safety</li>
                <li>With your explicit consent</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement comprehensive security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>End-to-end encryption for all data transmission and storage</li>
                <li>Multi-factor authentication and access controls</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee training on privacy and security practices</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to request deletion of your information</li>
                <li>Right to opt-out of marketing communications</li>
                <li>Right to file a complaint with regulatory authorities</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-slate-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Privacy Officer</strong></p>
                <p>Lynk Health</p>
                <p>123 Healthcare Drive</p>
                <p>Medical City, MC 12345</p>
                <p>Email: privacy@lynkhealth.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>

            {/* Updates */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Policy Updates</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-muted-foreground italic">
                <strong>Disclaimer:</strong> This privacy policy is a template and should be reviewed by legal counsel to ensure compliance with all applicable laws and regulations. Lynk Health is not a healthcare provider. We partner with licensed medical professionals to deliver CMS-covered care coordination services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
