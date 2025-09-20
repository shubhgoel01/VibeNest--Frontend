import React, { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import HomePostCard from "../cards/HomePostCard";
import { useAuth } from "../hooks/useAuth";
import CreatePostDialog from "../dialogs/CreatePostDialog";

// Main home page component that displays the feed of posts
// Handles pagination, post creation, and displays all posts from followed users
function Home() {
  // Get authentication status from our custom hook
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  // State for managing posts and UI
  const [allPosts, setAllPosts] = useState([]); // All posts currently loaded
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error messages to display
  const [hasMore, setHasMore] = useState(true); // Whether there are more posts to load
  const [showCreateDialog, setShowCreateDialog] = useState(false); // Create post dialog visibility

  // Pagination states for cursor-based infinite scroll
  const [lastCreatedAt, setLastCreatedAt] = useState(null); // Timestamp of last post loaded
  const [lastPostId, setLastPostId] = useState(null); // ID of last post loaded

  // Function to fetch posts from the API with pagination
  const fetchPosts = async () => {
    // Don't fetch if user isn't logged in, already loading, or no more posts
    if (!isLoggedIn || loading || !hasMore) return;

    try {
      setLoading(true); // Show loading spinner
      setError(null); // Clear any previous errors

      // Call the API with our pagination cursors
      const response = await getPosts({
        lastCreatedAt, // Where to start loading from
        lastPostId, // Secondary cursor for posts with same timestamp
      });

      const posts = response?.result || []; // Get the actual posts array
      const metaData = response?.metaData || {}; // Get pagination metadata

      if (posts.length > 0) {
        // Process posts to add boolean flags for UI state
        // The backend returns IDs, but we need booleans for the frontend
        const processedPosts = posts.map(post => ({
          ...post,
          isLiked: !!post.likeId, // Convert ID to boolean
          isFollowed: !!post.followerId,
          isFollowRequestSent: !!post.requestSentId,
          isFollowRequestReceived: !!post.requestReceivedId
        }));

        // Add new posts to existing ones, but prevent duplicates
        // This is important for pagination - we don't want the same post twice
        setAllPosts((prev) => {
          const existingIds = new Set(prev.map(p => p._id));
          const newPosts = processedPosts.filter(post => !existingIds.has(post._id));
          return [...prev, ...newPosts]; // Append new posts to existing ones
        });

        // Update our pagination cursors for the next load
        setLastCreatedAt(metaData.lastCreatedAt);
        setLastPostId(metaData.lastPostId);
      }

      // Determine if there are more posts to load
      // If we got fewer posts than requested, we've reached the end
      setHasMore(posts.length >= 5); // Our page limit is 5
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false); // Always stop loading state
    }
  };

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of the list
    setAllPosts((prev) => [newPost, ...prev]);
  };

  // Initial load
  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn]);

  // Loader while checking auth
  if (authLoading) {
    return (
      <div className="w-full max-w-[600px] h-[100vh] flex items-center justify-center bg-[var(--backGround)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] h-[100vh] overflow-y-auto bg-[var(--backGround)] border-x border-[var(--borderLight)]">
      {/* Create post button */}
      <div className="p-4 border-b border-[var(--borderLight)]">
        <button
          onClick={() => setShowCreateDialog(true)}
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Create New Post
        </button>
      </div>

      
      {error && (
        <div className="p-4 text-red-400 text-center">
          Error loading posts: {error}
        </div>
      )}

      {/* Posts list */}
      {allPosts.length > 0 ? (
        allPosts.map((post, index) => (
          <HomePostCard post={post} key={`${post._id}-${index}`} />
        ))
      ) : (
        !loading && <div className="p-4 text-center text-gray-400">No posts found</div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Load more button */}
      {hasMore && !loading && allPosts.length > 0 && (
        <div className="flex justify-center p-4">
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Load More
          </button>
        </div>
      )}

      {/* Create post dialog */}
      <CreatePostDialog
        visible={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

export default Home;
