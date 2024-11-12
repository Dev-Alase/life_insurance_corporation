import React, { useEffect, useState } from 'react';
import { FileText, DollarSign, AlertCircle, Users } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import PolicyCard from '../../components/shared/PolicyCard';
import { useAuth } from '../../context/AuthContext';
import ClaimCard from '../../components/shared/CliamCard';

const PolicyHolderDashboard = () => {
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState({});
  const [claims, setClaims] = useState([]);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      console.error("User token not found!");
      return;
    }

    const getInfo = async () => {
      try {
        setLoadingUserInfo(true);
        const response = await fetch("http://localhost:5000/api/users/summary", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        // console.log("Fetched userInfo:", data);
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoadingUserInfo(false);
      }
    };

    const getClaims = async () => {
      try {
        setLoadingClaims(true);
        const response = await fetch("http://localhost:5000/api/claims", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch claims");
        }

        const data = await response.json();
        // console.log("Fetched claims:", data);
        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoadingClaims(false);
      }
    };

    getInfo();
    getClaims();
  }, [user?.token]);

  const stats = [
    { title: 'Active Policies', value: userInfo?.number_of_policies || 0, icon: FileText, color: 'bg-blue-500' },
    { title: 'Total Premium', value: userInfo?.total_premium || 0, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Claims', value: userInfo?.number_of_claims || 0, icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'My Agents', value: userInfo?.number_of_agents || 0, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-4xl font-semibold">
          Hello, {user?.user?.fullName || 'Guest'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingUserInfo ? (
          <p>Loading stats...</p>
        ) : stats.length > 0 ? (
          stats?.map((stat, index) => (
            <StatsCard key={stat.title || index} {...stat} />
          ))
        ) : (
          <p>No stats available</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Claims</h2>
        {loadingClaims ? (
          <p>Loading claims...</p>
        ) : claims?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claims?.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                onAction={(claim) => console.log("Claim action:", claim)}
                actionLabel="View Details"
              />
            ))}
          </div>
        ) : (
          <p>No claims available</p>
        )}
      </div>
    </div>
  );
};

export default PolicyHolderDashboard;