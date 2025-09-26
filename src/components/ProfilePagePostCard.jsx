import React, { useState, useEffect } from "react";
import { deletePost } from "../api/posts";

function ProfilePagePostCard({post, setMyPosts}) {
  const [currentVisibleMedia, setCurrentVisibleMedia] = useState(0);
  const fileList = post?.fileUrl || [];
  const totalMedia = Math.max(0, fileList.length - 1);

  // If file list changes, ensure current index is within bounds
  useEffect(() => {
    if (currentVisibleMedia > totalMedia) {
      setCurrentVisibleMedia(totalMedia);
    }
  }, [fileList.length, currentVisibleMedia, totalMedia]);

  const handleDelete = async() => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    try {
      await deletePost(post._id);
      setMyPosts((prev) => prev.filter((item) => item._id !== post._id));
    } catch (error) {
      console.error("Unable to delete post:", error);
      alert("Something went wrong while deleting the post");
    }
  }

  return (
    <div className="relative border-2 border-white w-[120px] h-[120px] md:w-[220px] md:h-[220px] mx-7 rounded-lg overflow-hidden mt-4">
      {/* Media Display with Navigation */}
      <div className="relative w-full h-full bg-black">
        {/* Navigation Arrows */}
  {fileList.length > 1 && (
          <div className="absolute z-20 flex justify-between w-full px-2 text-white top-1/2 transform -translate-y-1/2">
            <button
              className="cursor-pointer bg-black/70 hover:bg-black/90 rounded-full p-2 transition-all duration-200 flex items-center justify-center"
              onClick={() =>
                setCurrentVisibleMedia((curr) => Math.max(0, curr - 1))
              }
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              className="cursor-pointer bg-black/70 hover:bg-black/90 rounded-full p-2 transition-all duration-200 flex items-center justify-center"
              onClick={() =>
                setCurrentVisibleMedia((curr) => Math.min(curr + 1, totalMedia))
              }
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        )}

        {/* Media Display */}
  <SimpleMedia url={fileList[currentVisibleMedia]?.url} />

        {/* Media Indicators */}
  {fileList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {fileList.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === currentVisibleMedia ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Simple Stats Display (no hover effect) */}
        <div className="absolute bottom-1 left-1 flex gap-2 text-white text-xs font-bold">
          <span>❤️ {post.likesCount}</span>
          <span>🗨️ {post.commentsCount}</span>
        </div>
      </div>

      {/* Delete Icon */}
      <span
        className="absolute top-1 right-1 z-10 text-white bg-red-600/80 rounded-full p-1 cursor-pointer"
        onClick={handleDelete}
        title="Delete post"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </span>
    </div>
  );
}

const SimpleMedia = ({ url }) => {
  if (!url) return null;

  const mediaType = url.includes("video") ? "video" : "image";

  if (mediaType === "image") {
    return (
      <img
        src={url}
        alt="Post Media"
        className="w-full h-full object-cover"
      />
    );
  }

  if (mediaType === "video") {
    return (
      <video
        controls
        muted
        playsInline
        className="w-full h-full object-cover"
        loop
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};

export default ProfilePagePostCard;