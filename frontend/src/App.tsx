import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSettings } from './pages/AdminSettings';
import { SalesmanDashboard } from './pages/SalesmanDashboard';
import { Leads } from './pages/salesman/Leads';
import { Contacts } from './pages/salesman/Contacts';
import { Pipeline } from './pages/salesman/Pipeline';
import { Tasks } from './pages/salesman/Tasks';
import { ActivityLog } from './pages/salesman/ActivityLog';
import { Segments } from './pages/salesman/Segments';
import { Proposals } from './pages/salesman/Proposals';
import { Emails } from './pages/salesman/Emails';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/salesman" element={
            <ProtectedRoute requireAdmin={false}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SalesmanDashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="segments" element={<Segments />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="emails" element={<Emails />} />
          </Route>

          <Route path="*" element={<div className="page-container"><h2>404 - Not Found</h2></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
