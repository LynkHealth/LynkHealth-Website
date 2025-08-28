import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import CCM from "@/pages/ccm";
import Monitoring from "@/pages/monitoring";
import RTM from "@/pages/rtm";
import APCM from "@/pages/apcm";
import BHI from "@/pages/bhi";
import HowItWorks from "@/pages/how-it-works";
import Resources from "@/pages/resources";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Calculator from "@/pages/calculator";
import BlogPost from "@/pages/blog-post";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services/ccm" component={CCM} />
          <Route path="/services/monitoring" component={Monitoring} />
          <Route path="/services/rtm" component={RTM} />
          <Route path="/services/apcm" component={APCM} />
          <Route path="/services/bhi" component={BHI} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/resources" component={Resources} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
