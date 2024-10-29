import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, FileText, DollarSign, Users, ClipboardList, LogOut } from 'lucide-react';

const Layout = ({ userType }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = userType === 'policyholder' 
    ? [
        { icon: Home, label: 'Home', path: 'dashboard' },
        { icon: FileText, label: 'Policies', path: 'policies' },
        { icon: DollarSign, label: 'Payments', path: 'payments' },
        { icon: Users, label: 'Agents', path: 'agents' },
      ]
    : [
        { icon: Home, label: 'Home', path: 'dashboard' },
        { icon: FileText, label: 'Policies', path: 'policies' },
        { icon: ClipboardList, label: 'Claims', path: 'claims' },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800 capitalize">
                  {userType} Portal
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map(({ icon: Icon, label, path }) => (
                  <Link
                    key={path}
                    to={`/${userType}/${path}`}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;