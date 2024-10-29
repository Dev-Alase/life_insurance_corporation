import React from 'react';
import { Shield, Users } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const LandingPage = () => {
  const [activeForm, setActiveForm] = React.useState('login');
  const [userType, setUserType] = React.useState('policyholder');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Policy Holder Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Policy Holders</h2>
              <p className="text-gray-600 mt-2">Manage your policies and claims</p>
            </div>
            
            {userType === 'policyholder' && (
              <div className="space-y-4">
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setActiveForm('login')}
                    className={`px-4 py-2 rounded-lg ${
                      activeForm === 'login'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveForm('register')}
                    className={`px-4 py-2 rounded-lg ${
                      activeForm === 'register'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Register
                  </button>
                </div>
                {activeForm === 'login' ? (
                  <LoginForm userType="policyholder" />
                ) : (
                  <RegisterForm userType="policyholder" />
                )}
              </div>
            )}
            
            {userType === 'agent' && (
              <button
                onClick={() => setUserType('policyholder')}
                className="w-full py-3 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Switch to Policy Holder
              </button>
            )}
          </div>

          {/* Agent Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Insurance Agents</h2>
              <p className="text-gray-600 mt-2">Manage clients and policies</p>
            </div>
            
            {userType === 'agent' && (
              <div className="space-y-4">
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setActiveForm('login')}
                    className={`px-4 py-2 rounded-lg ${
                      activeForm === 'login'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveForm('register')}
                    className={`px-4 py-2 rounded-lg ${
                      activeForm === 'register'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Register
                  </button>
                </div>
                {activeForm === 'login' ? (
                  <LoginForm userType="agent" />
                ) : (
                  <RegisterForm userType="agent" />
                )}
              </div>
            )}
            
            {userType === 'policyholder' && (
              <button
                onClick={() => setUserType('agent')}
                className="w-full py-3 px-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Switch to Agent
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;