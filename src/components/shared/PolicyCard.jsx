import React from 'react';
import { Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const PolicyCard = ({ policy, onAction, actionLabel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{policy.type}</h3>
          <p className="text-sm text-gray-500">Policy #{policy.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          policy.status === 'active' ? 'bg-green-100 text-green-800' :
          policy.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {policy.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {/* Valid until: {format(new Date(policy.expiryDate), 'MMM dd, yyyy')} */}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Premium: ${policy.premium}/month
          </span>
        </div>
        
        {policy.claimStatus && (
          <div className="flex items-center text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Claim Status: {policy.claimStatus}
            </span>
          </div>
        )}
      </div>

      {onAction && (
        <button
          onClick={() => onAction(policy)}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PolicyCard;