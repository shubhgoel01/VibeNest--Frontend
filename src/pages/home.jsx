import React, { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import HomePostCard from "../cards/HomePostCard";
import { useAuth } from "../hooks/useAuth";
import CreatePostDialog from "../dialogs/CreatePostDialog";

function Home() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Pagination states
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);

  // Load posts
  const fetchPosts = async () => {
    if (!isLoggedIn || loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getPosts({
        lastCreatedAt,
        lastPostId,
      });

      const posts = response?.result || [];
      const metaData = response?.metaData || {};

      if (posts.length > 0) {
        // Add follow status to posts
        const processedPosts = posts.map(post => ({
          ...post,
          isLiked: !!post.likeId,
          isFollowed: !!post.followerId,
          isFollowRequestSent: !!post.requestSentId,
          isFollowRequestReceived: !!post.requestReceivedId
        }));

        // Prevent duplicates by checking if post already exists
        setAllPosts((prev) => {
          const existingIds = new Set(prev.map(p => p._id));
          const newPosts = processedPosts.filter(post => !existingIds.has(post._id));
          return [...prev, ...newPosts];
        });

        // Update pagination cursor
        setLastCreatedAt(metaData.lastCreatedAt);
        setLastPostId(metaData.lastPostId);
      }

      // Check if there are more posts based on the number returned
      setHasMore(posts.length >= 5); // Since pageLimit is 5
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
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

      {/* Error message */}
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
