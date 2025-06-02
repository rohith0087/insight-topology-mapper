
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupportAuthProvider } from "@/contexts/SupportAuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SupportProtectedRoute from "@/components/support/SupportProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "@/components/auth/AuthPage";
import Index from "./pages/Index";
import SupportLogin from "./pages/SupportLogin";
import SupportPortal from "./pages/SupportPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SupportAuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/support-login" element={<SupportLogin />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/support-portal" 
                element={
                  <SupportProtectedRoute>
                    <SupportPortal />
                  </SupportProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </SupportAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
