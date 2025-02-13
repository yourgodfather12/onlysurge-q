import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toast } from './components/ui/Toast';
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { DashboardLayout } from './components/DashboardLayout';
import { Content } from './pages/Content';
import { Schedule } from './pages/Schedule';
import { Messages } from './pages/Messages';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Automation } from './pages/Automation';
import { Verification } from './pages/Verification';
import { Subscribers } from './pages/Subscribers';
import { Help } from './pages/Help';
import { Legal } from './pages/Legal';
import { Affiliate } from './pages/Affiliate';
import { Blog } from './pages/Blog';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Integrations } from './pages/Integrations';
import { Billing } from './pages/Billing';
import { Subscription } from './pages/Subscription';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/signin" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <LoadingProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/help" element={<Help />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/affiliate" element={<Affiliate />} />
              
              {/* Auth Routes */}
              <Route
                path="/signin"
                element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="content" element={<Content />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="messages" element={<Messages />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="automation" element={<Automation />} />
                <Route path="settings" element={<Settings />} />
                <Route path="verification" element={<Verification />} />
                <Route path="subscribers" element={<Subscribers />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="billing" element={<Billing />} />
                <Route path="subscription" element={<Subscription />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toast />
          </LoadingProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;