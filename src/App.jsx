import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/FireBaseConfig";

// Context
import { SkillProvider } from "./context/SkillContext"; 

// Pages
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import IndustryTrends from "./pages/IndustryTrends";
import LearningPath from "./pages/LearningPath";
import ProgressTracking from "./pages/ProgressTracking";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Practice from "./pages/Practice";

// Layout
import Navbar from "./components/Navbar";

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
      } else {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

// ================= DASHBOARD LAYOUT =================
const DashboardLayout = ({ children }) => {
  return (
    <div style={{ flex: 1 }}>
      <Navbar />
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
};

// ================= DASHBOARD ROUTE WRAPPER =================
const DashboardRoute = ({ element }) => (
  <ProtectedRoute>
    <DashboardLayout>{element}</DashboardLayout>
  </ProtectedRoute>
);

// ================= APP =================
function App() {
  return (
    <SkillProvider>   {/* 👈 Wrap everything with SkillProvider */}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardRoute element={<Dashboard />} />} />
          <Route path="/skills" element={<DashboardRoute element={<Skills />} />} />
          <Route path="/skill-gap-analysis" element={<DashboardRoute element={<SkillGapAnalysis />} />} />
          <Route path="/industry-trends" element={<DashboardRoute element={<IndustryTrends />} />} />
          <Route path="/learning-path" element={<DashboardRoute element={<LearningPath />} />} />
          <Route path="/progress-tracking" element={<DashboardRoute element={<ProgressTracking />} />} />
          <Route path="/reports" element={<DashboardRoute element={<Reports />} />} />
          <Route path="/settings" element={<DashboardRoute element={<Settings />} />} />
          <Route path="/notifications" element={<DashboardRoute element={<Notifications />} />} />
          <Route path="/practice" element={<DashboardRoute element={<Practice />} />} />
          {/* 404 Page */}
          <Route path="*" element={<div style={{ textAlign: "center", marginTop: "100px" }}><h1>404</h1><p>Page not found</p><a href="/">Go home</a></div>} />
        </Routes>
      </BrowserRouter>
    </SkillProvider>
  );
}

export default App;