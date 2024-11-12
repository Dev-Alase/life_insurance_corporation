import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

const POLICY_TYPES = [
  'Bima Jyoti',
  'Jeevan Umang',
  'Jeevan Lakshya',
  'Endowment Plan',
  'Jeevan Anand',
  'Jeevan Shanti',
  'Adhar Stambha',
  'Dhan Sanchay'
];

const PAYMENT_FREQUENCIES = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
];

const NewPolicyDialog = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [agents, setAgents] = useState([]);

  // Form fields
  const [type, setType] = useState('');
  const [agentId, setAgentId] = useState('');
  const [premium, setPremium] = useState('');
  const [totalPremiums, setTotalPremiums] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [files, setFiles] = useState(null);

  // Calculate Maximum Claim Amount dynamically
  const calculateClaimAmount = () => {
    const frequencyMultiplier = {
      monthly: 12,
      quarterly: 4,
      yearly: 1,
    };

    const multiplier = frequencyMultiplier[paymentFrequency] || 1;
    const totalAmount = premium * totalPremiums ;
    const claimFactor = 1.5; // Example factor for maximum claim calculation

    return totalAmount * claimFactor;
  };

  // Calculate Expiry Date dynamically
  const calculateExpiryDate = () => {
    const frequencyInMonths = {
      monthly: 1,
      quarterly: 3,
      yearly: 12,
    };

    const startDate = new Date();
    const monthsToAdd =
      (frequencyInMonths[paymentFrequency] || 1) * (totalPremiums || 0);
    const expiryDate = new Date(
      startDate.setMonth(startDate.getMonth() + monthsToAdd)
    );

    return expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/agents', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch agents');
        const data = await response.json();
        setAgents(data);
      } catch (err) {
        setError('Failed to load agents');
      }
    };

    fetchAgents();
  }, [user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('type', type);
    formData.append('agentId', agentId);
    formData.append('premium', premium);
    formData.append('totalPremiums', totalPremiums);
    formData.append('paymentFrequency', paymentFrequency);
    formData.append('claimAmount', calculateClaimAmount());
    formData.append('expiryDate', calculateExpiryDate());

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('documents', file);
      });
    }

    try {
      const response = await fetch('http://localhost:5000/api/policies/new', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create policy');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request New Policy</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a policy type</option>
                {POLICY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Agent
              </label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select an agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name} ({agent.license_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Premium Amount
              </label>
              <input
                type="number"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
                placeholder="Enter premium amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency
              </label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {PAYMENT_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Premiums
              </label>
              <input
                type="number"
                value={totalPremiums}
                onChange={(e) => setTotalPremiums(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                placeholder="Enter total number of premiums"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Claim Amount
            </label>
            <p className="p-2 border rounded-md bg-gray-50 text-gray-800">
              {isNaN(calculateClaimAmount()) ? 'N/A' : calculateClaimAmount().toFixed(2)} INR
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                type="file"
                onChange={(e) => setFiles(e.target.files)}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload documents
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PDF, JPG, PNG up to 10MB each
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Policy created successfully
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPolicyDialog;
