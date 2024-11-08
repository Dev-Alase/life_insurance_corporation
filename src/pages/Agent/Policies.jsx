import React, { useEffect, useState } from 'react';
import PolicyCard from '../../components/shared/PolicyCard';
import { useAuth } from '../../context/AuthContext';

const AgentPolicies = () => {

  const { user } = useAuth()
  const [policies,setPolicies] = useState([])
  // Simulated data
  // const policies = [
  //   {
  //     id: 'POL001',
  //     type: 'Life Insurance',
  //     status: 'active',
  //     premium: 150,
  //     expiry_date: '2025-12-31',
  //     clientName: 'John Doe'
  //   },
  //   {
  //     id: 'POL002',
  //     type: 'Health Insurance',
  //     status: 'active',
  //     premium: 200,
  //     expiry_date: '2025-06-30',
  //     clientName: 'Jane Smith'
  //   },
  //   {
  //     id: 'POL003',
  //     type: 'Vehicle Insurance',
  //     status: 'pending',
  //     premium: 180,
  //     expiry_date: '2025-08-15',
  //     clientName: 'Mike Johnson'
  //   }
  // ];

  useEffect(() => {

    const getPolicies = async() => {

        const response  = await fetch("http://localhost:5000/api/policies",{
          method : "GET",
          headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${user.token}`
          }
        })

        const data = await response.json()
        setPolicies(data)
    }

    getPolicies()

  },[])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Managed Policies</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onAction={(policy) => console.log('Policy action:', policy)}
            actionLabel="View Details"
          />
        ))}
      </div>
    </div>
  );
};

export default AgentPolicies;