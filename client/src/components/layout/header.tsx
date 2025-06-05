import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const services = [
    {
      title: "Chronic Care Management",
      href: "/ccm",
      description: "CMS-covered care coordination for chronic conditions",
    },
    {
      title: "In-Home Patient Monitoring",
      href: "/monitoring", 
      description: "Remote monitoring and RTM services",
    },
    {
      title: "Behavioral Health Integration",
      href: "/bhi",
      description: "Mental health support services",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">Lynk Health</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive('/') ? 'text-blue-600' : ''}`}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/about">
                <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive('/about') ? 'text-blue-600' : ''}`}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                  {services.map((service) => (
                    <li key={service.title}>
                      <Link href={service.href}>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{service.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {service.description}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/how-it-works">
                <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive('/how-it-works') ? 'text-blue-600' : ''}`}>
                  How It Works
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/resources">
                <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive('/resources') ? 'text-blue-600' : ''}`}>
                  Resources
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/contact">
                <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive('/contact') ? 'text-blue-600' : ''}`}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <Link href="/contact">
            <Button className="bg-red-600 hover:bg-red-700">
              Partner With Us
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  About
                </Button>
              </Link>
              
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm font-semibold">Services</div>
                {services.map((service) => (
                  <Link key={service.title} href={service.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start pl-6 text-sm">
                      {service.title}
                    </Button>
                  </Link>
                ))}
              </div>
              
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  How It Works
                </Button>
              </Link>
              <Link href="/resources" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Resources
                </Button>
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Contact
                </Button>
              </Link>
              
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-red-600 hover:bg-red-700 mt-4">
                  Partner With Us
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
