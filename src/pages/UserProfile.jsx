import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../api/users";
import { getPostsMerged } from "../api/posts";
import { 
  createRequest, 
  removeRequest, 
  acceptRequest, 
  rejectRequest, 
  removeFollower 
} from "../api/follow";
import ProfilePagePostCard from "../components/ProfilePagePostCard";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);
  
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({
    isFollowRequestReceived: false,
    isFollowRequestSent: false,
    isFollowed: false
  });

  // Load user data and posts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get user data and posts
        const [userData, postsData] = await Promise.all([
          getUser(userId),
          getPostsMerged({ userId, pageLimit: 100 }) // Get all user posts
        ]);
        
        setUser(userData);
        
        // Add follow status to posts
        const posts = postsData.result || [];
        const processedPosts = posts.map(post => ({
          ...post,
          isLiked: !!post.likeId,
          isFollowed: !!post.followerId,
          isFollowRequestSent: !!post.requestSentId,
          isFollowRequestReceived: !!post.requestReceivedId
        }));
        
        setUserPosts(processedPosts);
        
        // Set follow status from user data
        setFollowStatus({
          isFollowRequestReceived: !!userData.requestReceivedId,
          isFollowRequestSent: !!userData.requestSentId,
          isFollowed: !!userData.followerId
        });
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFollowAction = async () => {
    if (followLoading || !user) return;
    
    setFollowLoading(true);
    try {
      if (followStatus.isFollowRequestReceived) {
        // Accept follow request
        await acceptRequest(user._id, currentUser._id);
        setFollowStatus({
          isFollowRequestReceived: false,
          isFollowRequestSent: false,
          isFollowed: true
        });
      } else if (followStatus.isFollowRequestSent) {
        // Cancel follow request
        await removeRequest(user._id, currentUser._id);
        setFollowStatus({
          isFollowRequestReceived: false,
          isFollowRequestSent: false,
          isFollowed: false
        });
      } else if (followStatus.isFollowed) {
        // Unfollow user
        await removeFollower(user._id, currentUser._id);
        setFollowStatus({
          isFollowRequestReceived: false,
          isFollowRequestSent: false,
          isFollowed: false
        });
      } else {
        // Send follow request
        await createRequest(user._id);
        setFollowStatus({
          isFollowRequestReceived: false,
          isFollowRequestSent: true,
          isFollowed: false
        });
      }
    } catch (error) {
      console.error("Failed to perform follow action:", error);
      setError(error.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (followLoading || !user) return;
    
    setFollowLoading(true);
    try {
      await rejectRequest(user._id, currentUser._id);
      setFollowStatus({
        isFollowRequestReceived: false,
        isFollowRequestSent: false,
        isFollowed: false
      });
    } catch (error) {
      console.error("Failed to reject request:", error);
      setError(error.message || "Failed to reject request");
    } finally {
      setFollowLoading(false);
    }
  };

  const getFollowButtonText = () => {
    if (followLoading) return "Loading...";
    if (followStatus.isFollowRequestReceived) return "Accept";
    if (followStatus.isFollowRequestSent) return "Requested";
    if (followStatus.isFollowed) return "Following";
    return "Follow";
  };

  const getFollowButtonClass = () => {
    const baseClass = "px-6 py-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed";
    
    if (followLoading) {
      return `${baseClass} bg-gray-600 text-white opacity-50`;
    }
    
    if (followStatus.isFollowRequestReceived) {
      return `${baseClass} bg-green-600 hover:bg-green-700 text-white`;
    }
    
    if (followStatus.isFollowRequestSent) {
      return `${baseClass} bg-gray-600 hover:bg-gray-700 text-white`;
    }
    
    if (followStatus.isFollowed) {
      return `${baseClass} bg-red-600 hover:bg-red-700 text-white`;
    }
    
    return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`;
  };

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center bg-[var(--backGround)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[var(--backGround)] text-white">
        <div className="text-red-400 text-center mb-4">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center bg-[var(--backGround)] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-gray-400 mb-4">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="bg-[var(--backGround)] text-white w-full border-l border-gray-500 h-[100vh] overflow-y-auto">
      {/* User Info Header */}
      <div className="flex flex-col">
        <div className="border-b border-gray-600 flex flex-col">
          <div className="h-40 bg-gray-800" />
          <div className="flex justify-between px-6 py-3 items-center">
            <div className="flex">
              <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-3xl font-bold -mt-12 border-4 border-[var(--backGround)] mr-4">
                <img
                  src={user?.avatar?.url || "/personPlaceHolder.png"}
                  alt=""
                  className="rounded-full object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">{user?.userName}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-400">
                  Joined {new Date(user?.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-bold">
                    {user?.followersCount || 0} Followers
                  </span>
                  {" • "}
                  <span className="font-bold">
                    {user?.followingCount || 0} Following
                  </span>
                </p>
              </div>
            </div>
            
            {/* Follow button */}
            {!isOwnProfile && (
              <div className="flex gap-2">
                {followStatus.isFollowRequestReceived && (
                  <button
                    onClick={handleRejectRequest}
                    disabled={followLoading}
                    className="px-4 py-2 border border-red-500 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={handleFollowAction}
                  disabled={followLoading}
                  className={getFollowButtonClass()}
                >
                  {getFollowButtonText()}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pt-4">
          <h3 className="text-lg font-semibold">Posts ({userPosts.length})</h3>
        </div>
      </div>

      {/* User posts */}
      <div className="flex h-auto w-full overflow-scroll flex-wrap pb-8">
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <ProfilePagePostCard 
              key={post._id || index} 
              post={post} 
              setMyPosts={setUserPosts}
            />
          ))
        ) : (
          <div className="w-full p-6 text-center text-gray-400">
            <p>No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
