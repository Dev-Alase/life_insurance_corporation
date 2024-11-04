import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PaymentHistory = () => {
  // Simulated data

  const {user}  = useAuth()
  const [payments,setPayments] = useState([])

  useEffect(() => {

    const getpayments = async() => {

      const response = await fetch("http://localhost:5000/api/payments",{
        method : "GET",
        headers : {
          'Content-Type' : 'application-json',
          'Authorization' : `Bearer ${user.token}`
        }
      })

      const data = await response.json();
      // console.log(data)
      setPayments(data)
    }

    getpayments()

  },[])


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Payment History</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference 
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(payment.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.policy_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center">
                      {payment.status === 'successful' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm capitalize ${
                        payment.status === 'successful' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;