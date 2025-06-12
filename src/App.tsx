import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { SupportAuthProvider } from './contexts/SupportAuthContext';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import DocumentationPage from './pages/DocumentationPage';
import NotFound from './pages/NotFound';
import SupportSetup from './pages/SupportSetup';
import SupportLogin from './pages/SupportLogin';
import SupportPortal from './pages/SupportPortal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SupportProtectedRoute from './components/support/SupportProtectedRoute';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <SupportAuthProvider>
          <QueryClient client={queryClient}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/support-setup" element={<SupportSetup />} />
              <Route path="/support-login" element={<SupportLogin />} />
              <Route path="/support" element={
                <SupportProtectedRoute>
                  <SupportPortal />
                </SupportProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </QueryClient>
        </SupportAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
