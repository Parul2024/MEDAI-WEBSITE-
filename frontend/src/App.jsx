import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadPrescription from "./pages/UploadPrescription";
import Reminders from "./pages/Reminders";
import Wellness from "./pages/Wellness";

function App() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "999px" } }} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPrescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wellness"
          element={
            <ProtectedRoute>
              <Wellness />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
