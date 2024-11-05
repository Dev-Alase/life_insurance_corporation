import React from 'react';
import { Calendar, DollarSign, AlertCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';

const ApprovalCard = ({ item, onAction, actionLabel }) => {
    if (!item) {
        return null; // Return nothing if item is undefined or null
      }

  const isPolicy = item.hasOwnProperty('premium'); // Detect if the item is a policy or claim

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isPolicy ? item.type : `Claim for Policy #${item.policy_id}`}
          </h3>
          <p className="text-sm text-gray-500">
            {isPolicy ? `Policy #${item.id}` : `Claim #${item.id}`}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          item.status === 'approved' ? 'bg-green-100 text-green-800' :
          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Created on: {format(new Date(item.created_at), 'MMM dd, yyyy')}
          </span>
        </div>

        {isPolicy ? (
          <>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Premium: ${item.premium}/month
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Expires on: {format(new Date(item.expiry_date), 'MMM dd, yyyy')}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Claim Amount: ${item.amount}
              </span>
            </div>
            <div className="text-gray-600">
              <AlertCircle className="w-4 h-4 mr-2 inline-block" />
              <span className="text-sm">
                {item.description}
              </span>
            </div>
          </>
        )}
      </div>

      {onAction && (
        <button
          onClick={() => onAction(item)}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ApprovalCard;
