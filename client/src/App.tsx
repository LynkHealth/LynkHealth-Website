import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Import pages directly instead of lazy loading to avoid issues
import Home from "@/pages/home";
import About from "@/pages/about";
import CCM from "@/pages/ccm";
import Monitoring from "@/pages/monitoring";
import RTM from "@/pages/rtm";
import APCM from "@/pages/apcm";
import BHI from "@/pages/bhi";
import OvernightOnCall from "@/pages/overnight-on-call";
import ChronicWoundManagement from "@/pages/chronic-wound-management";
import HowItWorks from "@/pages/how-it-works";
import Resources from "@/pages/resources";
import Privacy from "@/pages/privacy";
import Calculator from "@/pages/calculator";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  // Scroll to top when navigating between pages
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/ccm" component={CCM} />
          <Route path="/monitoring" component={Monitoring} />
          <Route path="/rtm" component={RTM} />
          <Route path="/apcm" component={APCM} />
          <Route path="/bhi" component={BHI} />
          <Route path="/overnight-on-call" component={OvernightOnCall} />
          <Route path="/chronic-wound-management" component={ChronicWoundManagement} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/resources" component={Resources} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;