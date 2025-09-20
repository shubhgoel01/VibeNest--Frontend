import React from 'react';

const FollowActionDialog = ({ 
  isOpen, 
  onClose, 
  followStatus, 
  onAccept, 
  onReject, 
  onUnfollow, 
  onCancelRequest,
  isLoading 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getDialogContent = () => {
    if (followStatus.isFollowRequestReceived) {
      return {
        title: "Follow Request Received",
        message: "This user has sent you a follow request. What would you like to do?",
        actions: [
          {
            text: "Reject",
            onClick: onReject,
            className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          },
          {
            text: "Accept",
            onClick: onAccept,
            className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          }
        ]
      };
    }

    if (followStatus.isFollowRequestSent) {
      return {
        title: "Cancel Follow Request",
        message: "You have sent a follow request to this user. Would you like to cancel it?",
        actions: [
          {
            text: "Keep Request",
            onClick: onClose,
            className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          },
          {
            text: "Cancel Request",
            onClick: onCancelRequest,
            className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          }
        ]
      };
    }

    if (followStatus.isFollowed) {
      return {
        title: "Unfollow User",
        message: "Are you sure you want to unfollow this user? You will no longer see their posts in your feed.",
        actions: [
          {
            text: "Keep Following",
            onClick: onClose,
            className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          },
          {
            text: "Unfollow",
            onClick: onUnfollow,
            className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          }
        ]
      };
    }

    return null;
  };

  const content = getDialogContent();
  if (!content) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--backGround)] border border-[var(--borderLight)] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">{content.title}</h3>
        <p className="text-gray-300 mb-6">{content.message}</p>
        
        <div className="flex gap-3 justify-end">
          {content.actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={isLoading}
              className={`${action.className} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Loading..." : action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowActionDialog;
