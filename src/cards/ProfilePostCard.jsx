import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike as toggleLikeApi } from "../api/posts";
import ProfileSection from "../components/ProfileSection";

const ProfilePostCard = ({ post, onPostUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);


  const handleToggleLike = async () => {
    try {
      await toggleLikeApi(post._id);
      
      // Optimistic update
      if (isLiked) {
        setLikesCount(prev => prev - 1);
      } else {
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };



  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--backGround)] border-[var(--borderLight)] w-full border-t border-b h-auto">
      <ProfileSection 
        user={post.ownerDetails} 
        isFollowed={post.isFollowed}
      />

      <div className="text-white">{post.title}</div>

      <SimpleMediaCard fileUrl={post.fileUrl} />

      <hr className="border-t border-[var(--borderLight)]" />

      <div className="flex items-center text-gray-400 text-sm gap-6">
        <div className="flex gap-1">
          <span className="material-symbols-outlined">mode_comment</span>
          <p>{post.commentsCount}</p>
        </div>
        
        <div className="flex gap-1">
          <span
            className="material-symbols-outlined cursor-pointer transition-colors hover:scale-110"
            style={{
              color: isLiked ? "red" : "grey",
              fontVariationSettings: `${isLiked ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : ""}`,
            }}
            onClick={handleToggleLike}
          >
            favorite
          </span>
          <p>{likesCount}</p>
        </div>
        
        <span className="material-symbols-outlined">forward</span>
      </div>
    </div>
  );
};

const SimpleMediaCard = ({ fileUrl }) => {
  // Handle empty or undefined fileUrl
  if (!fileUrl || !Array.isArray(fileUrl) || fileUrl.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-gray-800 w-full h-[300px]">
        <div className="text-center text-gray-400">
          <span className="material-symbols-outlined text-4xl mb-2">image</span>
          <p>No media attached</p>
        </div>
      </div>
    );
  }

  const [currentVisibleMedia, setCurrentVisibleMedia] = useState(0);
  const totalMedia = fileUrl.length - 1;

  return (
    <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-black w-full h-[300px]">
      {/* Navigation Arrows */}
      {fileUrl.length > 1 && (
        <div className="absolute z-10 flex justify-between w-full px-2 text-white">
          <span
            className="cursor-pointer hover:bg-black/50 rounded-full p-1 transition-colors"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.max(0, curr - 1))
            }
          >
            <span className="material-symbols-outlined">arrow_left</span>
          </span>
          <span
            className="cursor-pointer hover:bg-black/50 rounded-full p-1 transition-colors"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.min(curr + 1, totalMedia))
            }
          >
            <span className="material-symbols-outlined">arrow_right</span>
          </span>
        </div>
      )}

      {/* Media Display */}
      <SimpleMedia url={fileUrl[currentVisibleMedia]?.url} />

      {/* Media Indicators */}
      {fileUrl.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {fileUrl.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentVisibleMedia ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SimpleMedia = ({ url }) => {
  // Handle undefined or empty URL
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <span className="material-symbols-outlined text-4xl">broken_image</span>
      </div>
    );
  }

  const mediaType = url.includes("video") ? "video" : "image";

  if (mediaType === "image") {
    return (
      <img
        src={url}
        alt="Post Media"
        className="w-full h-full object-contain"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  if (mediaType === "video") {
    return (
      <video
        controls
        muted
        playsInline
        className="w-full h-full object-scale-down"
        loop
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};

export default ProfilePostCard;