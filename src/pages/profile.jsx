import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPostsMerged } from '../api/posts';
import ProfilePagePostCard from '../components/ProfilePagePostCard';

function Profile() {
  const [myPosts, setMyPosts] = useState([]);
  const user = useSelector((state) => state.auth?.user);

  const fetchPostsNextPage = async () => {
    if (!user?._id) return;

    try {
      const data = await getPostsMerged({ userId: user._id, pageLimit: 100 });
      setMyPosts(data.result || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPostsNextPage();
    }
  }, [user]);

  if (!user) {
    return <div className="text-white p-6">Loading profile...</div>;
  }

  return (
    <div className="bg-[var(--backGround)] text-white w-full border-l border-gray-500 h-[100vh] overflow-y-auto">
      {/* user info */}
      <div className="flex flex-col">
        <div className="border-b border-gray-600 flex flex-col">
          <div className="h-40 bg-gray-800" />
          <div className="flex justify-between px-6 py-3 items-center">
            <div className="flex">
              <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-3xl font-bold -mt-12 border-4 border-[#0f0f0f] mr-4">
                <img
                  src={user?.avatar?.url}
                  alt=""
                  className="rounded-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">{user?.userName}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-400">{user?.createdAt}</p>
                <p className="text-sm">
                  <span className="font-bold">
                    {user?.followersCount || 0} Followers
                  </span>
                </p>
              </div>
            </div>
            <button className="h-auto md:h-12 w-auto md:w-20 p-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out">
              Edit
            </button>
          </div>
        </div>

        <div className="px-6 pt-4">
          <h3 className="text-lg font-semibold">Posts</h3>
        </div>
      </div>

      <div className="flex h-auto w-full overflow-scroll flex-wrap pb-8">
        {myPosts.map((post, index) => (
          <ProfilePagePostCard key={post._id || index} post={post} setMyPosts={setMyPosts} />
        ))}
      </div>
    </div>
  );
}

export { Profile };
