import React, { useState, useEffect } from "react";
import CommentCard from "./CommentCard";
import { useSelector } from "react-redux";
import { getComments, addComment } from "../api/posts";

const CommentDialog = ({ postId, visible, onClose, dialogTitle = "Comments" }) => {
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector((state) => state?.auth?.user);

  const onCommentChange = (e) => {
    setCommentMessage(e.target.value);
    if (errorMessage) setErrorMessage(""); // Clear error when typing
  };

  const handleSubmit = async () => {
    if (!commentMessage.trim()) return;

    try {
      const newComment = await addComment(postId, commentMessage);

      // Add user details for immediate display
      newComment.ownerDetails = {
        _id: user?._id,
        userName: user?.userName,
        avatar: user?.avatar,
      };

      setComments((prev) => [newComment, ...prev]);
      setCommentMessage("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      setErrorMessage("Something went wrong while posting the comment.");
    }
  };

  useEffect(() => {
    if (!visible) return; // Only fetch when dialog is open

    const fetchComments = async () => {
      try {
        const data = await getComments(postId);
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setErrorMessage("Failed to load comments.");
      }
    };

    fetchComments();
  }, [postId, visible]);

  if (!visible) return null;

  return (
    <div
      className="backdrop-blur-xs fixed top-0 left-0 w-[100vw] h-[100vh] justify-center items-center z-20 bg-gray-700/40 flex flex-col gap-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] md:w-[50%]"
      >
        <input
          type="text"
          value={commentMessage}
          onChange={onCommentChange}
          placeholder="Add Your Comment"
          className="w-full p-2 rounded-md border border-gray-400 bg-black text-white placeholder-gray-400"
        />
      </div>

      <div
        className="w-[90%] md:w-[50%] h-[60%] md:h-[70%] bg-black text-white rounded-lg p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2">{dialogTitle}</h2>

        {errorMessage && (
          <div className="mb-2 p-2 text-sm text-red-400 border border-red-500 rounded bg-red-500/20">
            {errorMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto border border-gray-600 rounded-md p-2 mb-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No comments yet.</p>
          ) : (
            comments.map((comment, index) => (
              <CommentCard key={comment._id || index} comment={comment} />
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            className="w-full p-2 border border-white rounded-full hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!commentMessage.trim()}
          >
            Post
          </button>
          <button
            className="w-full p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
