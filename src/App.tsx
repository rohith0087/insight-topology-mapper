
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SupportAuthProvider } from "./contexts/SupportAuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import SupportLogin from "./pages/SupportLogin";
import SupportSetup from "./pages/SupportSetup";
import SupportPortal from "./pages/SupportPortal";
import SupportProtectedRoute from "./components/support/SupportProtectedRoute";
import AuthPage from "./components/auth/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SupportAuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/app" element={<Index />} />
              <Route path="/support-login" element={<SupportLogin />} />
              <Route path="/support-setup" element={<SupportSetup />} />
              <Route 
                path="/support-portal" 
                element={
                  <SupportProtectedRoute>
                    <SupportPortal />
                  </SupportProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SupportAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
