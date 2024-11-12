import React, { useEffect, useState } from 'react';
import PolicyCard from '../../components/shared/PolicyCard';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NewPolicyDialog from '../../components/dialogs/NewPolicyDialog';

const PolicyHolderPolicies = () => {
  const [showNewPolicyForm, setShowNewPolicyForm] = useState(false);
  const [policies, setPolicies] = useState([]);
  const { user } = useAuth();

  const fetchPolicies = async () => {
    if (!user || !user.token) return;

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

  useEffect(() => {
    fetchPolicies();
  }, [user]);

  const handlePolicyAction = () => {
    fetchPolicies();
  };

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
            onAction={handlePolicyAction}
          />
        ))}
      </div>

      {showNewPolicyForm && (
        <NewPolicyDialog
          onClose={() => setShowNewPolicyForm(false)}
          onSuccess={() => {
            setShowNewPolicyForm(false);
            fetchPolicies();
          }}
        />
      )}
    </div>
  );
};

export default PolicyHolderPolicies;