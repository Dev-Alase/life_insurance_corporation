import React from 'react';
import { Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ClaimCard = ({ claim, onAction, actionLabel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{claim.policy_type}</h3>
          <p className="text-sm text-gray-500">Claim #{claim.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {claim.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Created on: {format(new Date(claim.created_at), 'MMM dd, yyyy')}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Claim Amount: ${claim.amount}
          </span>
        </div>

        <div className="text-gray-600">
          <AlertCircle className="w-4 h-4 mr-2 inline-block" />
          <span className="text-sm">
            {claim.description}
          </span>
        </div>
      </div>


    </div>
  );
};

export default ClaimCard;
