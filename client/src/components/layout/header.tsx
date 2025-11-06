import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import lynkHealthLogo from "@assets/LOGO-Lynk_Health_1749182161866.png";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img 
                src={lynkHealthLogo} 
                alt="Lynk Health Logo" 
                className="h-16 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link href="/" className={`text-sm font-semibold tracking-wide transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}>
                Home
            </Link>
            
            <Link href="/about" className={`text-sm font-semibold tracking-wide transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-foreground"
              }`}>
                About
            </Link>

            {/* Who We Work With Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Who We Work With
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-72 p-2">
                      <Link href="/primary-care" data-testid="link-primary-care">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Primary Care Practices</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Comprehensive care coordination solutions
                          </div>
                        </div>
                      </Link>
                      <Link href="/specialty-practices" data-testid="link-specialty-practices">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Specialty Practices</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Cardiology, endocrinology, podiatry & more
                          </div>
                        </div>
                      </Link>
                      <Link href="/hospitals" data-testid="link-hospitals">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Hospitals & Health Systems</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Reduce readmissions and improve outcomes
                          </div>
                        </div>
                      </Link>
                      <Link href="/fqhcs" data-testid="link-fqhcs">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">FQHCs</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Serve underserved populations effectively
                          </div>
                        </div>
                      </Link>
                      <Link href="/snf" data-testid="link-snf">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Skilled Nursing Facilities</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Post-acute and long-term care support
                          </div>
                        </div>
                      </Link>
                      <Link href="/home-health" data-testid="link-home-health">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Home Health Agencies</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            In-home coordination and monitoring
                          </div>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Services Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-72 p-2">
                      <Link href="/ccm">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Chronic Care Management</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            CMS-covered care coordination
                          </div>
                        </div>
                      </Link>
                      <Link href="/monitoring">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Remote Patient Monitoring</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            FDA-approved device monitoring
                          </div>
                        </div>
                      </Link>
                      <Link href="/rtm">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Remote Therapeutic Monitoring</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Non-physiological therapy monitoring
                          </div>
                        </div>
                      </Link>
                      <Link href="/apcm">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Advanced Primary Care Management</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            CMS's newest 2025 program
                          </div>
                        </div>
                      </Link>
                      <Link href="/bhi">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Behavioral Health Integration</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Mental health support services
                          </div>
                        </div>
                      </Link>
                      <Link href="/overnight-on-call">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Overnight On-Call Coverage</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Remote nocturnist and after-hours coverage
                          </div>
                        </div>
                      </Link>
                      <Link href="/chronic-wound-management">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Chronic Wound Management</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Referral-driven wound care network
                          </div>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/how-it-works" className={`text-sm font-semibold tracking-wide transition-colors hover:text-primary ${
                isActive("/how-it-works") ? "text-primary" : "text-foreground"
              }`}>
                How It Works
            </Link>
            
            <Link href="/resources" className={`text-sm font-semibold tracking-wide transition-colors hover:text-primary ${
                isActive("/resources") ? "text-primary" : "text-foreground"
              }`}>
                Resources
            </Link>
            
            <Link href="/calculator" className={`text-sm font-semibold tracking-wide transition-colors hover:text-primary ${
                isActive("/calculator") ? "text-primary" : "text-foreground"
              }`}>
                Calculator
            </Link>
            

          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Partner With Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 fixed left-0 right-0 top-20 bottom-0 overflow-y-auto z-40">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Home
              </Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  About
              </Link>
              <div className="px-3 py-2 text-sm font-semibold text-slate-900">Who We Work With</div>
              <Link href="/primary-care" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-primary-care">
                  Primary Care Practices
              </Link>
              <Link href="/specialty-practices" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-specialty-practices">
                  Specialty Practices
              </Link>
              <Link href="/hospitals" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-hospitals">
                  Hospitals & Health Systems
              </Link>
              <Link href="/fqhcs" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-fqhcs">
                  FQHCs
              </Link>
              <Link href="/snf" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-snf">
                  Skilled Nursing Facilities
              </Link>
              <Link href="/home-health" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-home-health">
                  Home Health Agencies
              </Link>
              <div className="px-3 py-2 text-sm font-semibold text-slate-900 mt-2">Services</div>
              <Link href="/ccm" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Chronic Care Management
              </Link>
              <Link href="/monitoring" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Remote Patient Monitoring
              </Link>
              <Link href="/rtm" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Remote Therapeutic Monitoring
              </Link>
              <Link href="/apcm" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Advanced Primary Care Management
              </Link>
              <Link href="/bhi" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Behavioral Health Integration
              </Link>
              <Link href="/overnight-on-call" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Overnight On-Call Coverage
              </Link>
              <Link href="/chronic-wound-management" className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Chronic Wound Management
              </Link>
              <Link href="/how-it-works" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  How It Works
              </Link>
              <Link href="/resources" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Resources
              </Link>
              <Link href="/calculator" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Calculator
              </Link>
              <div className="px-3 py-2">
                <Link href="/contact">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white"
                          onClick={() => setMobileMenuOpen(false)}>
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
