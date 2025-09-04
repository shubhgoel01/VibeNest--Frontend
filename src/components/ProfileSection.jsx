import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileSection = ({ user, isFollowed }) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    try {
      navigate(`/user/${user._id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="flex justify-between w-full md:w-1/2">
      <div className="profile flex gap-3">
        <img
          src={user.avatar.url}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 
            className="text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
            onClick={handleUserClick}
          >
            {user.userName}
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
