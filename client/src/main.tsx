import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializePerformanceOptimizations } from "./utils/performance";

// Initialize performance optimizations before app render
initializePerformanceOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
