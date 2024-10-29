import React from 'react';
import { Star, MessageCircle } from 'lucide-react';

const AgentList = () => {
  // Simulated data
  const agents = [
    {
      id: 'AGT001',
      name: 'Sarah Johnson',
      specialization: 'Life Insurance',
      rating: 4.8,
      experience: '8 years',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      id: 'AGT002',
      name: 'Michael Chen',
      specialization: 'Health Insurance',
      rating: 4.9,
      experience: '10 years',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      id: 'AGT003',
      name: 'Emily Rodriguez',
      specialization: 'Property Insurance',
      rating: 4.7,
      experience: '6 years',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Insurance Agents</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={agent.imageUrl}
                  alt={agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.specialization}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{agent.rating} Rating</span>
                </div>
                <p className="text-sm text-gray-500">{agent.experience} Experience</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => console.log('Contact agent:', agent.id)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;