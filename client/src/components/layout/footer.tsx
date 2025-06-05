import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-heartbeat text-healthcare-primary text-2xl mr-2"></i>
              <span className="text-xl font-bold">Lynk Health</span>
            </div>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Professional nurse-led care coordination services for Medicare patients with chronic conditions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-healthcare-primary transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-healthcare-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-healthcare-primary transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/services/ccm">
                  <a className="hover:text-white transition-colors">Chronic Care Management</a>
                </Link>
              </li>
              <li>
                <Link href="/services/monitoring">
                  <a className="hover:text-white transition-colors">In-Home Monitoring</a>
                </Link>
              </li>
              <li>
                <Link href="/services/bhi">
                  <a className="hover:text-white transition-colors">Behavioral Health Integration</a>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <a className="hover:text-white transition-colors">How It Works</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about">
                  <a className="hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="hover:text-white transition-colors">Resources</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-white transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="hover:text-white transition-colors">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center">
                <i className="fas fa-phone mr-3 text-healthcare-primary"></i>
                <span>(555) 123-LYNK</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3 text-healthcare-primary"></i>
                <span>partners@lynkhealth.com</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt mr-3 text-healthcare-primary mt-1"></i>
                <span>123 Healthcare Drive<br />Medical City, MC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
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
