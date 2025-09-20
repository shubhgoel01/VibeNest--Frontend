import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleMuted } from "../features/video/muted.js";
import { toggleLike as toggleLikeApi } from "../api/posts";
import ProfileSection from "../components/ProfileSection";
import CommentDialog from "../components/CommentDialog.jsx";


// This component displays individual posts in the home feed
// It handles likes, comments, and media display for each post
const HomePostCard = ({ post, onPostUpdate }) => {
  // State for comment dialog visibility
  const [isCommentDialogVisible, setIsCommentDialogVisible] = useState(false);
  const [comments, setComments] = useState([]); // Comments for this specific post
  const onAddComment = (comment) => {
    post.commentsCount += 1
  }
  
  // Like state - we keep local state for immediate UI updates
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  // Handle like/unlike functionality with optimistic updates
  // This means the UI updates immediately, even before the API call completes
  const handleToggleLike = async () => {
    try {
      // Make the API call to toggle the like
      await toggleLikeApi(post._id);

      // Update the UI immediately (optimistic update)
      if (isLiked) {
        setLikesCount((prev) => prev - 1); // Decrease count if unliking
      } else {
        setLikesCount((prev) => prev + 1); // Increase count if liking
      }
      setIsLiked(!isLiked); // Toggle the like state
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // In a real app, you might want to revert the optimistic update here
    }
  };



  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--backGround)] border-[var(--borderLight)] w-full border-t border-b h-auto">
      {/* Comment Dialog */}
      {isCommentDialogVisible && (
        <CommentDialog
          postId={post._id}
          visible={isCommentDialogVisible}
          onClose={() => setIsCommentDialogVisible(false)}
          comments={comments}
          onAddComment={onAddComment}
        />
      )}

      {/* Profile Section */}
      <ProfileSection
        user={post.ownerDetails}
        isFollowed={post.isFollowed}
      />

      {/* Post Title */}
      <div className="text-white">{post.title}</div>

      {/* Media */}
      <MediaCard fileUrl={post.fileUrl} />

      <hr className="border-t border-[var(--borderLight)]" />

      {/* Action Buttons */}
      <div className="flex items-center text-gray-400 text-sm gap-6">
        {/* Comments */}
        <div className="flex gap-1">
          <span
            className="material-symbols-outlined cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => setIsCommentDialogVisible(true)}
          >
            mode_comment
          </span>
          <p>{post.commentsCount}</p>
        </div>

        {/* Likes */}
        <div className="flex gap-1">
          <span
            className="material-symbols-outlined cursor-pointer transition-colors hover:scale-110"
            style={{
              color: isLiked ? "red" : "grey",
              fontVariationSettings: `${
                isLiked
                  ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  : ""
              }`,
            }}
            onClick={handleToggleLike}
          >
            favorite
          </span>
          <p>{likesCount}</p>
        </div>

        {/* Share */}
        <span className="material-symbols-outlined cursor-pointer hover:text-green-500 transition-colors">
          forward
        </span>
      </div>
    </div>
  );
};

// Component for displaying media (images/videos) in posts
// Handles multiple media files with navigation between them
const MediaCard = ({ fileUrl }) => {
  // Handle posts that don't have any media attached
  if (!fileUrl || !Array.isArray(fileUrl) || fileUrl.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-gray-800 w-full h-[450px]">
        <div className="text-center text-gray-400">
          <span className="material-symbols-outlined text-6xl mb-2">image</span>
          <p>No media attached</p>
        </div>
      </div>
    );
  }

  // Calculate total media count (for navigation)
  const totalMedia = fileUrl.length - 1;
  const [currentVisibleMedia, setCurrentVisibleMedia] = useState(0); // Which media is currently shown

  return (
    <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-black w-full h-[450px]">
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
      <Media url={fileUrl[currentVisibleMedia]?.url} />

      {/* Media Indicators */}
      {fileUrl.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {fileUrl.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentVisibleMedia ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Media = ({ url }) => {
  // Handle undefined or empty URL
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <span className="material-symbols-outlined text-6xl">broken_image</span>
      </div>
    );
  }

  const mediaType = url.includes("video") ? "video" : "image";
  const isMuted = useSelector((state) => state.mute.value);
  const dispatch = useDispatch();

  const handleVolumeChange = (e) => {
    if (e.target.muted !== isMuted) {
      dispatch(toggleMuted());
    }
  };

  if (mediaType === "image") {
    return (
      <img
        src={url}
        alt="Post Media"
        className="w-full h-full object-contain"
        id="IMAGE"
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
        muted={isMuted}
        playsInline
        onVolumeChange={handleVolumeChange}
        className="w-full h-full object-scale-down"
        id="VIDEO"
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

export default HomePostCard;
