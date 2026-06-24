import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Hooks
import { useAuth } from './features/auth/hooks/useAuth';

// Components
import ErrorBoundary from './components/feedback/ErrorBoundary';
import ProtectedRoute from './components/routes/ProtectedRoute';

// Pages
import { Login, Register, ForgotPassword, ResetPassword } from './features/auth';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Layout
import { Layout } from './features/dashboard';

// Client Pages
import ClientList from './features/clients/pages/ClientList';
import ClientCreate from './features/clients/pages/ClientCreate';
import ClientEdit from './features/clients/pages/ClientEdit';
// import ClientDetails from './features/clients/pages/ClientDetails';

// Quote Pages
import QuoteList from './features/quotes/pages/QuoteList';
import QuoteCreate from './features/quotes/pages/QuoteCreate';
import QuoteEdit from './features/quotes/pages/QuoteEdit';
// import QuoteDetails from './features/quotes/pages/QuoteDetails';

// Dashboard
import Dashboard from './features/dashboard/Dashboard';
import NotYetDesigned from './pages/NotYetDesigned';
import JobDetails from './features/jobs/pages/JobDetails';
import OnlineBooking from './features/bookings/pages/OnlineBooking';
import JobList from './features/jobs/pages/JobList';
import EmployeeList from './features/employees/pages/EmployeeList';
import ScheduleDashboard from './features/schedule/pages/ScheduleDashboard';
import LandingPage from './pages/LandingPage';

// Onboarding Pages
import FillForm from './features/onboarding/pages/FillForm';
import OnboardingList from './features/onboarding/pages/OnboardingList';
import OnboardingAssign from './features/onboarding/pages/OnboardingAssign';

// Time Tracking Approval Pages
import TimeTrackingApproval from './features/time-tracking/pages/TimeTrackingApproval';
import VendorMessages from './features/messages/pages/VendorMessages';
import InvoiceList from './pages/invoice/InvoiceList';
import InvoicePDFView from './pages/invoice/InvoicePDFView';
import ReportsPage from './pages/reports/ReportsPage';


const AppContent = () => {
  const { loadAuthState, user } = useAuth();

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Public Onboarding Form (no auth - token-based) */}
      <Route path="/fill-form/:token" element={<FillForm />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Customer/Client Module - RESTful naming */}
        <Route path="/customers" element={<ClientList />} />
        <Route path="/customers/new" element={<ClientCreate />} />
        {/* <Route path="/customers/:id" element={<ClientDetails />} /> */}
        <Route path="/customers/:id/edit" element={<ClientEdit />} />

        {/* Quotes Module - RESTful naming */}
        <Route path="/quotes" element={<QuoteList />} />
        <Route path="/quotes/new" element={<QuoteCreate />} />
        {/* <Route path="/quotes/:id" element={<QuoteDetails />} /> */}
        <Route path="/quotes/:id/edit" element={<QuoteEdit />} />

        {/* Future Modules with RESTful naming */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        {/* <Route path="/jobs/new" element={<div>Create Job</div>} />
        <Route path="/jobs/:id" element={<div>Job Details</div>} />
        <Route path="/jobs/:id/edit" element={<div>Edit Job</div>} /> */}

        <Route path="/schedule" element={<ScheduleDashboard />} />
        {/* <Route path="/invoices" element={<div>Invoices</div>} />
        <Route path="/reports" element={<div>Reports</div>} />
        <Route path="/settings" element={<div>Settings</div>} /> */}

        <Route path="/employees" element={<EmployeeList />} />

        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/pdf-view" element={<InvoicePDFView />} />
        <Route path="/timesheets" element={<NotYetDesigned />} />
        <Route path="/online-booking" element={<OnlineBooking />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<NotYetDesigned />} />
        {/* <Route path="/test" element={<TestPage />} /> */}

        {/* Onboarding Module */}
        <Route path="/onboarding" element={<OnboardingList />} />
        <Route path="/onboarding/assign" element={<OnboardingAssign />} />

        {/* Time Tracking Approval Module */}
        <Route path="/time-tracking-approval" element={<TimeTrackingApproval />} />

        {/* Messages Module */}
        <Route path="/messages" element={<VendorMessages />} />

      </Route>

      {/* Redirects */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;