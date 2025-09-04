import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { postsAPI } from "../api/posts";
import { validation } from "../utils/validation";
import SmallMediaPreview from "./SmallMediaPreview";

const CreatePost = ({ onPostCreated }) => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const mediaTypes = [
    {
      name: "image",
      type: "file",
      accept: "image/*",
      icon: "image",
      label: "Add Image",
    },
    {
      name: "video",
      type: "file",
      accept: "video/*",
      icon: "video_file",
      label: "Add Video",
    },
  ];

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError("");
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviewUrls = [];

    files.forEach((file) => {
      const isImage = validation.isValidImageFile(file);
      const isVideo = validation.isValidVideoFile(file);

      if (isImage || isVideo) {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      } else {
        setError(
          `Invalid file: ${file.name}. Please select valid image or video files.`
        );
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError("Please write something to post");
      return false;
    }

    if (!validation.isValidPostContent(title)) {
      setError("Post content must be between 1 and 1000 characters");
      return false;
    }

    if (selectedFiles.length > 5) {
      setError("You can only upload up to 5 files");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError("");

      const postData = {
        title: title.trim(),
        media: selectedFiles,
      };

      const result = await postsAPI.createPost(postData);

      setTitle("");
      setSelectedFiles([]);
      setPreviewUrls([]);

      if (onPostCreated) {
        onPostCreated(result.data);
      }
    } catch (err) {
      console.error("Create post error:", err);
      setError(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-[var(--backGround)] border border-[var(--borderLight)] w-full px-4 py-4 rounded-lg">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* User Info and Text Input */}
      <div className="flex gap-3">
        <div>
          <img
            src={user?.avatar?.url || "/personPlaceHolder.png"}
            alt="Avatar"
            className="h-12 w-12 rounded-full object-cover mt-1"
          />
        </div>
        <div className="flex-1">
          <textarea
            name="title"
            value={title}
            onChange={handleTitleChange}
            onKeyPress={handleKeyPress}
            className="w-full text-white resize-none p-2 outline-none bg-transparent border-none focus:ring-0"
            placeholder="What's on your mind?"
            rows={2}
            maxLength={1000}
            disabled={isSubmitting}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {title.length}/1000
          </div>
        </div>
      </div>

      {/* Media Preview */}
      {previewUrls.length > 0 && (
        <div className="flex justify-center">
          <SmallMediaPreview
            fileUrls={previewUrls.map((url, i) => ({ url, file: selectedFiles[i] }))}
            removeFile={removeFile}
          />
        </div>
      )}

      <hr className="border border-[var(--borderLight)]" />

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {mediaTypes.map((item, index) => (
            <button
              key={index}
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="hidden md:block text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            isSubmitting || (!title.trim() && selectedFiles.length === 0)
          }
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isSubmitting}
      />
    </div>
  );
};

export default CreatePost;
