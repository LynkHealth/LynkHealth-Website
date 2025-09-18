import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Heart, ChevronDown, Menu } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
  ];

  const serviceLinks = [
    { href: "/services/ccm", label: "Chronic Care Management", description: "CCM services for chronic conditions" },
    { href: "/services/monitoring", label: "Remote Patient Monitoring", description: "RPM physiological monitoring" },
    { href: "/services/rtm", label: "Remote Therapeutic Monitoring", description: "RTM non-physiological monitoring" },
    { href: "/services/apcm", label: "Advanced Primary Care Management", description: "APCM comprehensive care coordination" },
    { href: "/services/bhi", label: "Behavioral Health Integration", description: "Mental health support services" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="text-2xl font-bold text-primary">
                <Heart className="mr-2" size={20} />
                Lynk Health
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Services Dropdown */}
              <div className="relative group">
                <button className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  Services <ChevronDown className="ml-1 text-xs group-hover:rotate-180 transition-transform" size={12} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      <div className="font-medium">{service.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{service.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Partner With Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-primary p-2"
            >
              <Menu className="text-xl" size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              <div className="font-medium text-slate-900 mb-2 px-3">Services</div>
              {serviceLinks.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="block py-1 pl-6 text-slate-600 text-sm hover:text-primary"
                >
                  {service.label}
                </Link>
              ))}
            </div>
            <div className="px-3 py-2">
              <Link
                href="/contact"
                className="block bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium text-center hover:bg-accent/90 transition-colors"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
