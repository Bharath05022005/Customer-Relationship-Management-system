// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import SalesmanDashboard from './SalesmanDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Dashboard Route */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Salesman Dashboard Route */}
        <Route path="/salesman/*" element={<SalesmanDashboard />} />

        {/* Fallback Route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
