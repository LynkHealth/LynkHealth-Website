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

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <i className="fas fa-heartbeat text-healthcare-primary text-2xl mr-2"></i>
              <span className="text-xl font-bold text-foreground">Lynk Health</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors hover:text-healthcare-primary ${
                isActive("/") ? "text-healthcare-primary" : "text-muted-foreground"
              }`}>
                Home
              </a>
            </Link>
            
            <Link href="/about">
              <a className={`text-sm font-medium transition-colors hover:text-healthcare-primary ${
                isActive("/about") ? "text-healthcare-primary" : "text-muted-foreground"
              }`}>
                About
              </a>
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
                      <Link href="/services/ccm">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Chronic Care Management</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            CMS-covered care coordination
                          </div>
                        </div>
                      </Link>
                      <Link href="/services/monitoring">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">In-Home Patient Monitoring</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Remote monitoring and RTM services
                          </div>
                        </div>
                      </Link>
                      <Link href="/services/bhi">
                        <div className="block px-4 py-3 text-sm hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="font-medium">Behavioral Health Integration</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Mental health support services
                          </div>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/how-it-works">
              <a className={`text-sm font-medium transition-colors hover:text-healthcare-primary ${
                isActive("/how-it-works") ? "text-healthcare-primary" : "text-muted-foreground"
              }`}>
                How It Works
              </a>
            </Link>
            
            <Link href="/resources">
              <a className={`text-sm font-medium transition-colors hover:text-healthcare-primary ${
                isActive("/resources") ? "text-healthcare-primary" : "text-muted-foreground"
              }`}>
                Resources
              </a>
            </Link>
            
            <Link href="/contact">
              <a className={`text-sm font-medium transition-colors hover:text-healthcare-primary ${
                isActive("/contact") ? "text-healthcare-primary" : "text-muted-foreground"
              }`}>
                Contact
              </a>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link href="/contact">
              <Button className="bg-healthcare-accent hover:bg-red-700 text-white">
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
            >
              <i className="fas fa-bars text-xl"></i>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/">
                <a className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Home
                </a>
              </Link>
              <Link href="/about">
                <a className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  About
                </a>
              </Link>
              <Link href="/services/ccm">
                <a className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Chronic Care Management
                </a>
              </Link>
              <Link href="/services/monitoring">
                <a className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  In-Home Monitoring
                </a>
              </Link>
              <Link href="/services/bhi">
                <a className="block px-3 py-2 pl-6 text-sm font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Behavioral Health
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  How It Works
                </a>
              </Link>
              <Link href="/resources">
                <a className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Resources
                </a>
              </Link>
              <Link href="/contact">
                <a className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-healthcare-primary"
                   onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </a>
              </Link>
              <div className="px-3 py-2">
                <Link href="/contact">
                  <Button className="w-full bg-healthcare-accent hover:bg-red-700 text-white"
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
