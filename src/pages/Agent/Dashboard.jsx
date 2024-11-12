import React, { useEffect, useState } from 'react';
import { Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { useAuth } from '../../context/AuthContext';
import ApprovalCard from '../../components/shared/ApprovalCard';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [currAgent, setCurrAgent] = useState({});
  const [pendingPolicies, setPendingPolicies] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);

  useEffect(() => {
    const getAgentInfo = async () => {
      const response = await fetch("http://localhost:5000/api/users/summary", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      // console.log(data);
      setCurrAgent(data);
    };

    const getApprovals = async () => {
      const response = await fetch("http://localhost:5000/api/agents/approvals", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        }
      });

      const data = await response.json();
      setPendingPolicies(data.pendingPolicies);
      setPendingClaims(data.pendingClaims);
    };

    getAgentInfo();
    getApprovals();
  }, [user.token]);

  const stats = [
    { title: 'Total Clients', value: currAgent.number_of_policyholders, icon: Users, color: 'bg-blue-500' },
    { title: 'Active Policies', value: currAgent.number_of_policies, icon: FileText, color: 'bg-green-500' },
    { title: 'Pending Claims', value: currAgent.number_of_claims, icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'Monthly Revenue', value: currAgent.total_premium * 0.075, icon: TrendingUp, color: 'bg-purple-500' }
  ];

  console.log(pendingPolicies);
  console.log(pendingClaims);

  return (
    <div className="space-y-6">
      <div>
        <p className='text-4xl font-semibold'> Hello, {user.user.fullName} </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {pendingPolicies.length > 0 &&  <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingPolicies?.map((policy) => (
            <ApprovalCard
              key={policy.id}
              item={policy} 
              onAction={(policy) => console.log('Policy action:', policy)}
              actionLabel="Review & Approve"
            />
          ))}
        </div>
      </div>}

      { pendingClaims.length > 0 && <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Claims</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingClaims?.map((claim) => (
            <ApprovalCard
              key={claim.id}
              item={claim}
              onAction={(claim) => console.log('Claim action:', claim)}
              actionLabel="Review & Approve"
            />
          ))}
        </div>
      </div>}


    </div>
  );
};

export default AgentDashboard;
