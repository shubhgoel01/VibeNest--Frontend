import React from "react";

const CommentCard = ({ comment }) => {
  const user = comment.ownerDetails;
  const userAvatar = user?.avatar?.url ?? "/personPlaceHolder.png"

  return (
    <div className="border-b border-gray-600 py-2 px-1">
      <div className="flex items-center gap-3">
        <img
          src={userAvatar}
          alt="Avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
        <h3 className="text-white font-medium text-sm opacity-55">{user.userName}</h3>
      </div>
      <p className="text-sm text-white ml-11 mt-1">{comment.content}</p>
    </div>
  );
};

export default CommentCard;