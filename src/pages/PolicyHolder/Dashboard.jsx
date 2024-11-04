import React, { useEffect, useState } from 'react';
import { FileText, DollarSign, AlertCircle, Users } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import PolicyCard from '../../components/shared/PolicyCard';
import { useAuth } from '../../context/AuthContext';

const PolicyHolderDashboard = () => {

  const {user} = useAuth()
  // console.log(user)

  const [userInfo,setUserInfo] = useState({})

  // Simulated data
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

  useEffect(() => {

    const getInfo = async () => {

      const response = await fetch("http://localhost:5000/api/users/summary",{
        method : "GET",
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${user?.token}`
        }
      })
      
      const data = await response.json();

      // console.log(data)
      setUserInfo(data)

    }

    getInfo()

  },[])


  const stats = [
    { title: 'Active Policies', value: userInfo.number_of_policies || 0, icon: FileText, color: 'bg-blue-500' },
    { title: 'Total Premium', value: userInfo.total_premium || 0, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Claims', value: userInfo.number_of_claims || 0, icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'My Agents', value: userInfo.number_of_agents || 0, icon: Users, color: 'bg-purple-500' }
  ];


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Policies</h2>
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