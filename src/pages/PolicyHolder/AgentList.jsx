import React, { useEffect, useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FaUserTie } from "react-icons/fa6";
import AgentDialog from '../../components/dialogs/AgentDialog';
import { toast } from 'react-toastify';

const AgentList = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [contactAgent, setContactAgent] = useState(null);
  const [ratingAgent, setRatingAgent] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const getAgents = async () => {
      const response = await fetch("http://localhost:5000/api/agents", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      setAgents(data);
    };

    getAgents();
  }, [user.token]);

  const submitRating = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/agents/${ratingAgent}/rate`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to submit rating');
        return;
      }

      setSuccessMessage('Rating submitted successfully');
      setRatingAgent(null); // Close the modal
      setRating(0);
    } catch (error) {
      console.error(error);
      setErrorMessage('Server error while submitting rating');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Insurance Agents</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents?.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 gap-2">
                <FaUserTie className='text-3xl' />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.full_name}</h3>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{agent.rating} Rating</span>
                </div>
                <p className="text-sm text-gray-500">{agent.total_policies} Total Policies</p>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => setContactAgent(agent)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Agent
                </button>
                <button
                  onClick={() => setRatingAgent(agent.id)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Rate Agent
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      {ratingAgent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">Rate Agent</h3>
            <p>Provide a rating for the agent:</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    (hoveredRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setRatingAgent(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                disabled={!rating}
              >
                Submit
              </button>
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
          </div>
        </div>
      )}

      {/* Contact Agent Dialog */}
      {contactAgent && (
        <AgentDialog
          agent={contactAgent}
          onClose={() => setContactAgent(null)}
        />
      )}
    </div>
  );
};

export default AgentList;
