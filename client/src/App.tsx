import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { lazy, Suspense } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const CCM = lazy(() => import("@/pages/ccm"));
const Monitoring = lazy(() => import("@/pages/monitoring"));
const RTM = lazy(() => import("@/pages/rtm"));
const APCM = lazy(() => import("@/pages/apcm"));
const BHI = lazy(() => import("@/pages/bhi"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const Resources = lazy(() => import("@/pages/resources"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Calculator = lazy(() => import("@/pages/calculator"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function Router() {
  // Scroll to top when navigating between pages
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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
