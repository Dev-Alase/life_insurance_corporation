import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Claims = () => {

  const { user } = useAuth()
  const [claims,setClaims] = useState([])

  // Simulated data
  // const claims = [
  //   {
  //     id: 'CLM001',
  //     policyId: 'POL002',
  //     clientName: 'John Doe',
  //     type: 'Health Insurance',
  //     amount: 5000,
  //     status: 'pending',
  //     submittedDate: '2024-03-15'
  //   },
  //   {
  //     id: 'CLM002',
  //     policyId: 'POL004',
  //     clientName: 'Jane Smith',
  //     type: 'Vehicle Insurance',
  //     amount: 3500,
  //     status: 'approved',
  //     submittedDate: '2024-03-10'
  //   },
  //   {
  //     id: 'CLM003',
  //     policyId: 'POL007',
  //     clientName: 'Mike Johnson',
  //     type: 'Property Insurance',
  //     amount: 15000,
  //     status: 'rejected',
  //     submittedDate: '2024-03-05'
  //   }
  // ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  useEffect(() => {

    const getClaims = async() => {

      const response = await fetch("http://localhost:5000/api/claims",{
        method : "GET",
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${user.token}`
        }
      })

      const data = await response.json()
      console.log(data)
      setClaims(data)
    }

    getClaims()

  },[])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Claims Management</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Claim ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {claim.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {claim.policyholder_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {claim.policy_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${claim.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(claim.status)}
                    <span className="ml-2 text-sm text-gray-500 capitalize">
                      {claim.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => console.log('View claim:', claim.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Claims;