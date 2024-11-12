import React, { useEffect, useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FaUserTie } from "react-icons/fa6";

const AgentList = () => {

  const {user} = useAuth()
  const [agents,setAgents] = useState([])



  useEffect(() => {

    const getAgents = async () => {

      const response = await fetch("http://localhost:5000/api/agents",{
        method : "GET",
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${user.token}`
        }
      })

      const data = await response.json();

      console.log(data);
      setAgents(data);
    }

    getAgents()

  },[])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Insurance Agents</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents?.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 gap-2">
                <FaUserTie className='text-3xl'/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.full_name}</h3>
                  {/* <p className="text-sm text-gray-500">{agent.specialization}</p> */}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{agent.rating} Rating</span>
                </div>
                <p className="text-sm text-gray-500">{agent.total_policies} Total Policies</p>
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