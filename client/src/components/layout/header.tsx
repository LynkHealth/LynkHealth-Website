import { useState } from "react";
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
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Home
              </Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  About
              </Link>
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
