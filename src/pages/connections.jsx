import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getFollowers,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  removeFollower,
  removeRequest,
} from '../api/follow';

// User card component
const UserCard = ({ data, buttonText, onClick, onReject = null }) => {
  return (
    <div className="w-full max-w-[590px] h-auto px-4 py-2 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={data?.userDetails?.avatar?.url ?? "/personPlaceHolder.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-white object-cover"
          />
          <div>
            <h2 className="font-semibold text-base text-white">
              {data?.userDetails?.userName}
            </h2>
            <p className="text-sm text-gray-400">@{data?.userDetails?._id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {buttonText && (
            <button
              onClick={() => onClick(data)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              {buttonText}
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(data)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Followers list component
const Followers = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const data = await getFollowers(userId);
        setFollowers(data || []);
      } catch (err) {
        console.error('Error fetching followers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [userId]);

  const handleRemove = async (follower) => {
    await removeFollower(follower._id, userId);
    setFollowers((prev) => prev.filter((f) => f._id !== follower._id));
  };

  if (loading) return <div className="text-gray-400 p-4">Loading followers...</div>;

  return followers.length > 0 ? (
    <div className="overflow-y-auto h-[calc(100vh-50px)] p-4 flex flex-col gap-2">
      {followers.map((follower) => (
        <UserCard
          key={follower._id}
          data={follower}
          buttonText="Remove"
          onClick={handleRemove}
        />
      ))}
    </div>
  ) : (
    <div className="text-gray-400 p-4">No followers found.</div>
  );
};

// Sent requests component
const RequestsSent = ({ userId }) => {
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const fetchSent = async () => {
      try {
        const data = await getSentRequests(userId);
        setSentRequests(data || []);
      } catch (err) {
        console.error('Error fetching sent requests:', err);
      }
    };
    fetchSent();
  }, [userId]);

  const handleCancel = async (request) => {
    await removeRequest(request._id, userId);
    setSentRequests((prev) => prev.filter((r) => r._id !== request._id));
  };

  return sentRequests.length > 0 ? (
    <div className="overflow-y-auto h-[calc(100vh-50px)] p-4 flex flex-col gap-2">
      {sentRequests.map((request) => (
        <UserCard
          key={request._id}
          data={request}
          buttonText="Cancel"
          onClick={handleCancel}
        />
      ))}
    </div>
  ) : (
    <div className="text-gray-400 p-4">No sent requests.</div>
  );
};

// Received requests component
const RequestsReceived = ({ userId }) => {
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    const fetchReceived = async () => {
      try {
        const data = await getReceivedRequests(userId);
        setReceivedRequests(data || []);
      } catch (err) {
        console.error('Error fetching received requests:', err);
      }
    };
    fetchReceived();
  }, [userId]);

  const handleAccept = async (request) => {
    await acceptRequest(request._id, userId);
    setReceivedRequests((prev) => prev.filter((r) => r._id !== request._id));
  };

  const handleReject = async (request) => {
    await rejectRequest(request._id, userId);
    setReceivedRequests((prev) => prev.filter((r) => r._id !== request._id));
  };

  return receivedRequests.length > 0 ? (
    <div className="overflow-y-auto h-[calc(100vh-50px)] p-4 flex flex-col gap-2">
      {receivedRequests.map((request) => (
        <UserCard
          key={request._id}
          data={request}
          buttonText="Accept"
          onClick={handleAccept}
          onReject={handleReject}
        />
      ))}
    </div>
  ) : (
    <div className="text-gray-400 p-4">No received requests.</div>
  );
};

// Main connections page
export default function SocialTabsPage() {
  const userArray = useSelector((state) => state.auth?.user);
  const loggedinUser = Array.isArray(userArray) ? userArray[0] : userArray;
  const [activeTab, setActiveTab] = useState('followers');

  const renderActiveComponent = () => {
    if (!loggedinUser?._id) {
      return <div className="text-gray-400 p-4">Loading user...</div>;
    }

    switch (activeTab) {
      case 'followers':
        return <Followers userId={loggedinUser._id} />;
      case 'sent':
        return <RequestsSent userId={loggedinUser._id} />;
      case 'received':
        return <RequestsReceived userId={loggedinUser._id} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-black h-[100vh] border border-gray-500 p-2 overflow-auto">
      <div className="w-full max-w-[600px] relative h-full">
        {/* Tab navigation */}
        <div className="w-full bg-black border-b border-gray-700 flex">
          {['followers', 'sent', 'received'].map((tab) => (
            <div
              key={tab}
              className={`w-[33%] text-white p-2 flex justify-center items-center cursor-pointer 
              ${activeTab === tab ? 'border-b-2 border-blue-500 font-semibold' : 'bg-black'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {renderActiveComponent()}
      </div>
    </div>
  );
}
