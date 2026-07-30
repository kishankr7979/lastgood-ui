import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Events from "./pages/Events";
import Rewind from "./pages/Rewind";
import EventDetail from "./pages/EventDetail";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import OAuthCallback from "./pages/OAuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import Services from "./pages/Services";
import { ToastContainer } from "./components/ui/Toast";
import useHelpLoom from "./hooks/useHelpLoom";

// Simple Auth Guard
const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useHelpLoom()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/signup/complete-profile" element={<CompleteProfile />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/rewind" replace />} />
          <Route path="rewind" element={<Rewind />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="services" element={<Services />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
