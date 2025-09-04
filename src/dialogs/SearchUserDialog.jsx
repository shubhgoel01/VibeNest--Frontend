import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { getUser } from "../api/users";
// import { 
//   acceptRequest, 
//   rejectRequest, 
//   createRequest, 
//   removeFollower, 
//   removeRequest 
// } from "../api/followers";
import { acceptRequest, rejectRequest, createRequest, removeFollower, removeRequest } from "../api/follow";

const UserCard = ({ data, buttonText, onClick, onReject = null }) => {
  return (
    <div className="w-full max-w-[590px] h-auto px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={data?.avatar?.url || "/personPlaceHolder.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-white object-cover"
          />
          <div>
            <h2 className="font-semibold text-base text-white">{data?.userName}</h2>
            <p className="text-sm text-gray-400">@{data?.fullName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {buttonText && (
            <button
              onClick={onClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition-colors"
            >
              {buttonText}
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchUserDialog = ({ visible, onClose, dialogTitle = "Search User" }) => {
  const [searchUserDetail, setSearchUserDetail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const loggedinUser = useSelector((state) => state?.auth?.user);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearchUserDetail(value);
    setError(null);
    
    // Clear search results when input is empty
    if (!value.trim()) {
      setSearchedUser(null);
      return;
    }
  };

  const handleSubmit = async () => {
    if (!searchUserDetail.trim()) {
      setError("Please enter a username or userId");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSearchedUser(null);

      const data = await getUser(searchUserDetail);

      if (!data || !data) {
        setError("User not found");
        return;
      }


      setSearchedUser(data);
    } catch (err) {
      console.error("Search error:", err);

      setError(err.message || "Failed to search user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFollower = async () => {
  try {
    await removeFollower(searchedUser?.followerId, loggedinUser._id);
  } catch (err) {
    console.error("Remove follower error:", err);
  }
};

const handleSendFollowRequest = async () => {
  try {
    await createRequest(searchedUser?._id);
  } catch (err) {
    console.error("Send follow request error:", err);
  }
};

const handleAcceptRequest = async () => {
  try {
    await acceptRequest(searchedUser?.requestReceivedId, loggedinUser._id);
  } catch (err) {
    console.error("Accept request error:", err);
  }
};

const handleRejectRequest = async () => {
  try {
    await rejectRequest(searchedUser?.requestReceivedId, loggedinUser._id);
  } catch (err) {
    console.error("Reject request error:", err);
  }
};

const handleRemoveRequest = async () => {
  try {
    await removeRequest(searchedUser?.requestSentId, loggedinUser._id);
  } catch (err) {
    console.error("Remove request error:", err);
  }
};

  const renderUserCard = () => {
    if (!searchedUser) return null;

    if (searchedUser.followerId) {
      return <UserCard data={searchedUser} buttonText={"Unfollow"} onClick={handleRemoveFollower} />;
    }

    if (searchedUser.requestSentId) {
      return <UserCard data={searchedUser} buttonText={"Cancel Request"} onClick={handleRemoveRequest} />;
    }

    if (searchedUser.requestReceivedId) {
      return <UserCard data={searchedUser} buttonText={"Accept"} onClick={handleAcceptRequest} onReject={handleRejectRequest} />;
    }

    return <UserCard data={searchedUser} buttonText={"Follow"} onClick={handleSendFollowRequest} />;
  };

  if (!visible) return null;

  return (
    <div
      className="backdrop-blur-xs fixed top-0 left-0 w-[100vw] h-[100vh] justify-center items-center z-20 bg-gray-700/40 flex flex-col gap-3"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90%] md:w-[50%]">
        <input
          type="text"
          value={searchUserDetail}
          onChange={handleOnChange}
          placeholder="Enter userName or userId"
          className="w-full p-2 rounded-md border border-gray-400 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <div
        className="w-[90%] md:w-[50%] h-[60%] md:h-[70%] bg-black text-white rounded-lg p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2">{dialogTitle}</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Searched User */}
        {!isLoading && renderUserCard()}

        {/* Footer Actions */}
        <div className="flex gap-3 mt-auto">
          <button
            className="w-full p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="w-full p-2 border border-blue-500 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isLoading || !searchUserDetail.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchUserDialog;