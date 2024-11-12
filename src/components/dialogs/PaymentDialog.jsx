import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

const PaymentDialog = ({ policy, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const paidPremiums = policy.payments?.filter(p => p.status === 'successful').length || 0;
  const remainingPremiums = policy.total_premiums - paidPremiums;
  const totalDue = policy.premium * remainingPremiums;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          policy_id: policy.id,
          amount: policy.premium
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Premium Payment</h2>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Policy #{policy.id}</p>
            <p className="font-medium">{policy.type}</p>
            <div className="mt-2 space-y-2">
              <p className="text-sm">Premium Amount: <span className="font-semibold">${policy.premium}</span></p>
              <p className="text-sm">Payment Frequency: <span className="font-semibold capitalize">{policy.payment_frequency}</span></p>
              <p className="text-sm">Remaining Premiums: <span className="font-semibold">{remainingPremiums}</span></p>
              <p className="text-sm">Total Due: <span className="font-semibold">${totalDue}</span></p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm">Payment successful!</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading || success}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Paid
                </>
              ) : (
                'Pay Premium'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;