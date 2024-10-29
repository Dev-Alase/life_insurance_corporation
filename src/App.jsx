import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PolicyHolderDashboard from './pages/PolicyHolder/Dashboard';
import AgentDashboard from './pages/Agent/Dashboard';
import PolicyHolderPolicies from './pages/PolicyHolder/Policies';
import AgentPolicies from './pages/Agent/Policies';
import Claims from './pages/Agent/Claims';
import PaymentHistory from './pages/PolicyHolder/PaymentHistory';
import AgentList from './pages/PolicyHolder/AgentList';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/policyholder" element={<Layout userType="policyholder" />}>
            <Route path="dashboard" element={<PolicyHolderDashboard />} />
            <Route path="policies" element={<PolicyHolderPolicies />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="agents" element={<AgentList />} />
          </Route>
          
          <Route path="/agent" element={<Layout userType="agent" />}>
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="policies" element={<AgentPolicies />} />
            <Route path="claims" element={<Claims />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;