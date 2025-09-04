import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createPost } from "../api/posts";
import { validation } from "../utils/validation";
import SmallMediaPreview from "../components/SmallMediaPreview";

const CreatePostDialog = ({ visible, onClose, onPostCreated }) => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
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
      setError("Title is required");
      return false;
    }

    if (!description.trim()) {
      setError("Description is required");
      return false;
    }

    if (!validation.isValidPostContent(title)) {
      setError("Title must be between 1 and 1000 characters");
      return false;
    }

    if (!validation.isValidPostContent(description)) {
      setError("Description must be between 1 and 1000 characters");
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
        description: description.trim(),
        media: selectedFiles,
      };

      const result = await createPost(postData);

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFiles([]);
      setPreviewUrls([]);

      if (onPostCreated) {
        onPostCreated(result);
      }

      onClose();
    } catch (err) {
      console.error("Create post error:", err);
      setError(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setTitle("");
      setDescription("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setError("");
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="backdrop-blur-xs fixed top-0 left-0 w-[100vw] h-[100vh] flex flex-col justify-center items-center z-20 bg-gray-700/40"
      onClick={handleClose}
    >
      <div
        className="h-[80%] w-[90%] md:w-[60%] lg:w-[50%] flex flex-col bg-[var(--backGround)] text-white rounded-lg gap-4 border border-[var(--borderLight)]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--borderLight)]">
          <h2 className="text-xl font-semibold">Create New Post</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* User Info */}
          <div className="flex gap-3 items-center">
            <img
              src={user?.avatar?.url || "/personPlaceHolder.png"}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-white font-medium">{user?.userName}</span>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title..."
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="text-right text-xs text-gray-400">
              {title.length}/1000
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your post..."
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="text-right text-xs text-gray-400">
              {description.length}/1000
            </div>
          </div>

          {/* Media Preview */}
          {previewUrls.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Media Preview
              </label>
              <div className="flex justify-center">
                <SmallMediaPreview
                  fileUrls={previewUrls.map((url, i) => ({ url, file: selectedFiles[i] }))}
                  removeFile={removeFile}
                />
              </div>
            </div>
          )}

          {/* File Upload Buttons */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Add Media (Optional)
            </label>
            <div className="flex gap-4">
              {mediaTypes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:text-blue-500 hover:border-blue-500 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-[var(--borderLight)]">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 p-2 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || 
              !title.trim() || 
              !description.trim()
            }
            className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-full font-medium transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
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
    </div>
  );
};

export default CreatePostDialog;
