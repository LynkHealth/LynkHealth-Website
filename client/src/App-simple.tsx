import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Simple minimal components to test deployment
function SimpleHome() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Lynk Health</h1>
      <p className="text-lg text-gray-600">Healthcare Care Coordination Platform</p>
    </div>
  );
}

function SimpleAbout() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">About Lynk Health</h1>
      <p className="text-lg text-gray-600">Leading Medicare care coordination services.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={SimpleHome} />
        <Route path="/about" component={SimpleAbout} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;