import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CustomerFormPage from "./pages/CustomerFormPage.jsx";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AgentWorkspace from "./pages/AgentWorkspace.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agents" element={<AgentWorkspace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
