import React from 'react';
import { FileText, DollarSign, AlertCircle, Users } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import PolicyCard from '../../components/shared/PolicyCard';

const PolicyHolderDashboard = () => {
  // Simulated data
  const stats = [
    { title: 'Active Policies', value: '3', icon: FileText, color: 'bg-blue-500' },
    { title: 'Total Premium', value: '$450/month', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Claims', value: '1', icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'My Agents', value: '2', icon: Users, color: 'bg-purple-500' }
  ];

  const recentPolicies = [
    {
      id: 'POL001',
      type: 'Life Insurance',
      status: 'active',
      premium: 150,
      expiryDate: '2025-12-31',
      claimStatus: null
    },
    {
      id: 'POL002',
      type: 'Health Insurance',
      status: 'active',
      premium: 200,
      expiryDate: '2025-06-30',
      claimStatus: 'processing'
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onAction={(policy) => console.log('Policy action:', policy)}
              actionLabel="View Details"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyHolderDashboard;