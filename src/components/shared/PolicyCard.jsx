import React, { useState } from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import PaymentDialog from '../dialogs/PaymentDialog';
import ClaimDialog from '../dialogs/ClaimDialog';

const PolicyCard = ({ policy, onAction, actionLabel }) => {
  const { user } = useAuth();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  const handlePaymentSuccess = () => {
    if (onAction) onAction(policy);
  };

  const handleClaimSuccess = () => {
    if (onAction) onAction(policy);
  };

  const paidPremiums = policy.payments?.filter(p => p.status === 'successful').length || 0;
  const remainingPremiums = policy.total_premiums - paidPremiums;

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
            Valid until: {format(new Date(policy.expiry_date), 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Premium: ${policy.premium}/{policy.payment_frequency}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Premiums Paid: {paidPremiums}/{policy.total_premiums}
          </span>
        </div>
        
        {policy.claims && policy.claims.length > 0 && (
          <div className="flex items-center text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Latest Claim: {policy.claims[0].status}
            </span>
          </div>
        )}
      </div>

      {user.user.type === "policyholder" && policy.status === 'active' && (
        <div className="flex gap-4 mt-4">
          {remainingPremiums > 0 && (
            <button
              onClick={() => setShowPaymentDialog(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 transition-colors border-2 border-blue-600"
            >
              Pay Premium
            </button>
          )}
          <button
            onClick={() => setShowClaimDialog(true)}
            className="w-full px-4 py-2 bg-pink-800 text-white rounded-md hover:bg-white hover:text-pink-800 transition-colors border-2 border-pink-800"
          >
            File Claim
          </button>
        </div>
      )}

      {showPaymentDialog && (
        <PaymentDialog
          policy={policy}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {showClaimDialog && (
        <ClaimDialog
          policy={policy}
          onClose={() => setShowClaimDialog(false)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
};

export default PolicyCard;