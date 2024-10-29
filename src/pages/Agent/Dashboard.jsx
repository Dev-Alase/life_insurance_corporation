import React from 'react';
import { Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import PolicyCard from '../../components/shared/PolicyCard';

const AgentDashboard = () => {
  // Simulated data
  const stats = [
    { title: 'Total Clients', value: '24', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Policies', value: '45', icon: FileText, color: 'bg-green-500' },
    { title: 'Pending Claims', value: '3', icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'Monthly Revenue', value: '$5,240', icon: TrendingUp, color: 'bg-purple-500' }
  ];

  const pendingPolicies = [
    {
      id: 'POL003',
      type: 'Vehicle Insurance',
      status: 'pending',
      premium: 180,
      expiryDate: '2025-08-15',
      clientName: 'John Doe'
    },
    {
      id: 'POL004',
      type: 'Property Insurance',
      status: 'pending',
      premium: 250,
      expiryDate: '2025-09-30',
      clientName: 'Jane Smith'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Approvals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onAction={(policy) => console.log('Policy action:', policy)}
              actionLabel="Review & Approve"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;