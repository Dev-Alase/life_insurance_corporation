import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AgentDialog = ({ agent, onClose }) => {


  const {user} = useAuth()
  const [message, setMessage] = useState("");

  const sendEmail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/agents/${agent.id}/send-email`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization' :  `Bearer ${user.token}`
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to send email");
        return;
      }

      toast.success("Email sent successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Server error while sending email");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">Contact Agent: {agent.full_name}</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          className="w-full h-32 border border-gray-300 rounded-md p-2"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={sendEmail}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            disabled={!message.trim()}
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDialog;
