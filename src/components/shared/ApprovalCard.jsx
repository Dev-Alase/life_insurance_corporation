import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ApprovalCard = ({ item, onAction }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isClaim = 'policy_id' in item;

  const handleApproval = async (approved) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = isClaim
        ? `http://localhost:5000/api/claims/${item.id}`
        : `http://localhost:5000/api/policies/${item.id}`;
        
      const status = isClaim ? (approved ? 'approved' : 'rejected') : approved ? 'active' : 'cancelled';  // Update status dynamically

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Action failed');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onAction(item); // Notify parent to refresh the list
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold">
        {isClaim ? `Claim Request #${item.id}` : `Policy Request #${item.id}`}
      </h3>
      <p className="text-sm text-gray-500">
        {isClaim ? `Policy #${item.policy_id}` : item.type}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Amount:</span> ${isClaim ? item.amount : item.premium}
      </p>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md mb-4">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md mb-4">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm">Action completed successfully!</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => handleApproval(true)}
          disabled={loading || success}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Approve'}
        </button>
        <button
          onClick={() => handleApproval(false)}
          disabled={loading || success}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default ApprovalCard;