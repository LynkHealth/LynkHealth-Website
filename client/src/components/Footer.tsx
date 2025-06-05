import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-heartbeat text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold">Lynk Health</span>
            </div>
            <p className="text-slate-400 mb-4">
              Professional nurse-led care coordination services for Medicare patients with chronic conditions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/services/ccm" className="hover:text-white transition-colors">Chronic Care Management</Link></li>
              <li><Link href="/services/monitoring" className="hover:text-white transition-colors">In-Home Monitoring</Link></li>
              <li><Link href="/services/bhi" className="hover:text-white transition-colors">Behavioral Health Integration</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-slate-400">
              <div>partnerships@lynkhealth.com</div>
              <div>(555) 123-LYNK</div>
              <div className="text-sm">123 Healthcare Drive<br />Medical City, MC 12345</div>
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
