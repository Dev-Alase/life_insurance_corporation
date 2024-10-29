import React, { useState } from 'react';
import PolicyCard from '../../components/shared/PolicyCard';
import { Plus } from 'lucide-react';

const PolicyHolderPolicies = () => {
  const [showNewPolicyForm, setShowNewPolicyForm] = useState(false);

  // Simulated data
  const policies = [
    {
      id: 'POL001',
      type: 'Life Insurance',
      status: 'active',
      premium: 150,
      expiryDate: '2025-12-31'
    },
    {
      id: 'POL002',
      type: 'Health Insurance',
      status: 'active',
      premium: 200,
      expiryDate: '2025-06-30'
    },
    {
      id: 'POL003',
      type: 'Vehicle Insurance',
      status: 'pending',
      premium: 180,
      expiryDate: '2025-08-15'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">My Policies</h1>
        <button
          onClick={() => setShowNewPolicyForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onAction={(policy) => console.log('Policy action:', policy)}
            actionLabel={policy.status === 'active' ? 'Pay Premium' : 'View Details'}
          />
        ))}
      </div>

      {showNewPolicyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Request New Policy</h2>
            {/* Add form fields here */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowNewPolicyForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Submit new policy request');
                  setShowNewPolicyForm(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyHolderPolicies;