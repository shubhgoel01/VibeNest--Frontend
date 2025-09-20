import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileSection = ({ user, isFollowed }) => {
  const navigate = useNavigate();

  // Handle undefined user or missing properties
  if (!user) {
    return (
      <div className="flex justify-between w-full md:w-1/2">
        <div className="profile flex gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-white text-lg">?</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  const handleUserClick = () => {
    try {
      if (user._id) {
        navigate(`/user/${user._id}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Get avatar URL with fallback
  const avatarUrl = user.avatar?.url || "/personPlaceHolder.png";
  const userName = user.userName || "Unknown User";

  return (
    <div className="flex justify-between w-full md:w-1/2">
      <div className="profile flex gap-3">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 
            className="text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
            onClick={handleUserClick}
          >
            {userName}
          </h3>
          {isFollowed && (
            <span className="text-xs text-gray-400">Following</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
