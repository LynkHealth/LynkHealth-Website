import { Link } from "wouter";
import { Heart, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold">Lynk Health</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Professional nurse-led care coordination services for Medicare patients with chronic conditions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <Link href="/ccm" className="hover:text-white transition-colors">
                  Chronic Care Management
                </Link>
              </li>
              <li>
                <Link href="/monitoring" className="hover:text-white transition-colors">
                  In-Home Monitoring
                </Link>
              </li>
              <li>
                <Link href="/bhi" className="hover:text-white transition-colors">
                  Behavioral Health Integration
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-slate-400">
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
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
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
            <h4 className="font-semibold mb-6">Contact</h4>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center">
                <i className="fas fa-phone mr-3 text-blue-600"></i>
                <span>(555) 123-LYNK</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3 text-blue-600"></i>
                <span>partners@lynkhealth.com</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt mr-3 text-blue-600 mt-1"></i>
                <span>
                  123 Healthcare Drive<br />
                  Medical City, MC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2024 Lynk Health. All rights reserved.
            </div>
            <div className="text-slate-400 text-sm text-center md:text-right max-w-2xl">
              <strong>Disclaimer:</strong> Lynk Health is not a provider. We partner with licensed medical professionals to deliver CMS-covered care coordination services.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
