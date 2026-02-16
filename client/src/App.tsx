import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
import PrimaryCarePage from "@/pages/who-we-work-with/primary-care";
import SpecialtyPracticesPage from "@/pages/who-we-work-with/specialty-practices";
import HospitalsPage from "@/pages/who-we-work-with/hospitals";
import FQHCsPage from "@/pages/who-we-work-with/fqhcs";
import SNFPage from "@/pages/who-we-work-with/snf";
import HomeHealthPage from "@/pages/who-we-work-with/home-health";
import AdminLogin from "@/pages/admin/login";
import AdminForgotPassword from "@/pages/admin/forgot-password";
import AdminResetPassword from "@/pages/admin/reset-password";
import AdminDashboard from "@/pages/admin/dashboard";
import ClinicalLayout from "@/pages/clinical/layout";
import ClinicalDashboard from "@/pages/clinical/dashboard";
import PatientList from "@/pages/clinical/patients";
import PatientChart from "@/pages/clinical/patient-chart";
import Worklists from "@/pages/clinical/worklists";
import TaskManagement from "@/pages/clinical/tasks";
import Schedule from "@/pages/clinical/schedule";
import CarePlanTemplates from "@/pages/clinical/templates";
import UserManagement from "@/pages/clinical/users";
import ClinicalForms from "@/pages/clinical/forms";
import ClinicalEraEob from "@/pages/clinical/era-eob";


function Router() {
  useScrollToTop();
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  const isClinical = location.startsWith("/clinical");

  if (isClinical) {
    return (
      <ClinicalLayout>
        <Switch>
          <Route path="/clinical/dashboard" component={ClinicalDashboard} />
          <Route path="/clinical/patients" component={PatientList} />
          <Route path="/clinical/patients/:id" component={PatientChart} />
          <Route path="/clinical/worklists" component={Worklists} />
          <Route path="/clinical/worklists/:programType" component={Worklists} />
          <Route path="/clinical/tasks" component={TaskManagement} />
          <Route path="/clinical/schedule" component={Schedule} />
          <Route path="/clinical/templates" component={CarePlanTemplates} />
          <Route path="/clinical/forms" component={ClinicalForms} />
          <Route path="/clinical/era-eob" component={ClinicalEraEob} />

          <Route path="/clinical/users" component={UserManagement} />
          <Route path="/clinical">{() => { window.location.href = "/clinical/dashboard"; return null; }}</Route>
        </Switch>
      </ClinicalLayout>
    );
  }

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/forgot-password" component={AdminForgotPassword} />
        <Route path="/admin/reset-password" component={AdminResetPassword} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/:rest*" component={AdminDashboard} />
      </Switch>
    );
  }
  
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
          <Route path="/primary-care" component={PrimaryCarePage} />
          <Route path="/specialty-practices" component={SpecialtyPracticesPage} />
          <Route path="/hospitals" component={HospitalsPage} />
          <Route path="/fqhcs" component={FQHCsPage} />
          <Route path="/snf" component={SNFPage} />
          <Route path="/home-health" component={HomeHealthPage} />
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
