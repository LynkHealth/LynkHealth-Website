import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiLinkedin, SiX, SiFacebook } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/images/LOGO-Lynk_Health_1749182161866.png" 
                alt="Lynk Health Logo" 
                className="h-8 w-auto"
                style={{filter: 'brightness(0) invert(1)'}}
              />
            </div>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Professional nurse-led care coordination services for Medicare patients with chronic conditions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <SiX className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Who We Work With */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Who We Work With</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/primary-care" className="hover:text-white transition-colors" data-testid="link-footer-primary-care">
                  Primary Care Practices
                </Link>
              </li>
              <li>
                <Link href="/specialty-practices" className="hover:text-white transition-colors" data-testid="link-footer-specialty-practices">
                  Specialty Practices
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-white transition-colors" data-testid="link-footer-hospitals">
                  Hospitals & Health Systems
                </Link>
              </li>
              <li>
                <Link href="/fqhcs" className="hover:text-white transition-colors" data-testid="link-footer-fqhcs">
                  FQHCs
                </Link>
              </li>
              <li>
                <Link href="/snf" className="hover:text-white transition-colors" data-testid="link-footer-snf">
                  Skilled Nursing Facilities
                </Link>
              </li>
              <li>
                <Link href="/home-health" className="hover:text-white transition-colors" data-testid="link-footer-home-health">
                  Home Health Agencies
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/ccm" className="hover:text-white transition-colors">
                  Chronic Care Management
                </Link>
              </li>
              <li>
                <Link href="/monitoring" className="hover:text-white transition-colors">
                  Remote Patient Monitoring
                </Link>
              </li>
              <li>
                <Link href="/rtm" className="hover:text-white transition-colors">
                  Remote Therapeutic Monitoring
                </Link>
              </li>
              <li>
                <Link href="/apcm" className="hover:text-white transition-colors">
                  Advanced Primary Care Management
                </Link>
              </li>
              <li>
                <Link href="/bhi" className="hover:text-white transition-colors">
                  Behavioral Health Integration
                </Link>
              </li>
              <li>
                <Link href="/chronic-wound-management" className="hover:text-white transition-colors">
                  Chronic Wound Management
                </Link>
              </li>
              <li>
                <Link href="/overnight-on-call" className="hover:text-white transition-colors">
                  Overnight On-Call Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Resources
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <a href="tel:+16018594342" className="hover:text-white transition-colors">(601) 859-4342</a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <a href="mailto:info@lynkhealthcare.com" className="hover:text-white transition-colors">info@lynkhealthcare.com</a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-primary mt-1" />
                <span>200 Trace Colony Park Dr, Suite C<br />Ridgeland, MS 39157</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 Lynk Health. All rights reserved.
            </div>
            <div className="text-slate-400 text-xs text-center md:text-right max-w-2xl">
              Lynk Health is not a provider. We partner with licensed medical professionals to deliver CMS-covered care coordination services.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
