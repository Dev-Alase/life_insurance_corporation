import React, { useEffect, useState } from 'react';
import PolicyCard from '../../components/shared/PolicyCard';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PolicyHolderPolicies = () => {
  const [showNewPolicyForm, setShowNewPolicyForm] = useState(false);
  const [policies, setPolicies] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const getPolicies = async () => {
      if (!user || !user.token) return; // Ensure user is logged in with a token

      try {
        const response = await fetch("http://localhost:5000/api/policies", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch policies');
        }

        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    getPolicies();
  }, []);


  console.log(user)

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
        {policies?.map((policy) => (
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