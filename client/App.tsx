import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";
import Category from "./pages/Category.jsx";
// import DateTasks from "./pages/DateTasks.jsx";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/test" element={<div style={{padding: '100px', textAlign: 'center', background: 'lightgreen'}}><h1>TEST ROUTE WORKS!</h1><p>Basic routing is functional</p></div>} />
          <Route path="/date/:date" element={<div style={{padding: '100px', textAlign: 'center', background: 'lightblue'}}><h1>DATE ROUTE WORKS!</h1><p>Date: {window.location.pathname.split('/')[2]}</p></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
