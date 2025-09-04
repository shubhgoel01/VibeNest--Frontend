import React, { useEffect, useState } from 'react'
import { TrendCard } from './TrendCard.jsx';
import DialogForm from './DialogForm.jsx';

// Import API functions
import { fetchTrending, searchTrend, createTrend } from '../api/trending';

function Trending() {
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedTrend, setSearchedTrend] = useState(null);
  const [activeTab, setActiveTab] = useState("trending"); // 'trending' or 'searched'
  const [createNewTrendTag, setCreateNewTrendTag] = useState(null);

  const handleOnChange = (e) => {
    setSearch(e.target.value);
  };

  const onSearchClick = async (e) => {
    e.preventDefault();
    if (!search || search[0] !== "#") {
      alert("Enter Valid Tag");
      return;
    }

    const tagWithoutHash = search.slice(1);

    try {
      setCreateNewTrendTag(null);
      const data = await searchTrend(tagWithoutHash); // Search for trend

      // if (!data) {
      //   alert("Search Operation could not be completed");
      //   return;
      // }

      setSearchedTrend(data);
      setActiveTab("searched");

      if (!data) setCreateNewTrendTag(search); // suggest creating new
      setSearch("");

    } catch (err) {
      console.error("Search error:", err);
      alert("Network error");
    }
  };

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrending(); // Get trending data
        if (!data) {
          alert("Something went wrong");
          return;
        }
        setTrending(data);
      } catch (error) {
        console.error("Error fetching trends:", error);
        alert("Network error");
      }
    };

    loadTrending();
  }, []);

  return (
    <div className="hidden md:flex w-[350px] flex-col gap-4 p-4 bg-[var(--backGround)] text-white h-[100vh]">
      <form onSubmit={onSearchClick}>
        <input
          type="text"
          name="search"
          className="w-full border h-[30px] rounded-full p-2 text-white"
          value={search}
          onChange={handleOnChange}
          placeholder="Search or create new trend..."
        />
      </form>

      {/* Tabs */}
      <div className="flex justify-between mt-2">
        <button
          className={`text-sm font-medium ${activeTab === "trending" ? "underline" : "opacity-50"}`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
        <button
          className={`text-sm font-medium ${activeTab === "searched" ? "underline" : "opacity-50"}`}
          onClick={() => setActiveTab("searched")}
        >
          Searched
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 h-full">
        {activeTab === "trending" && <TrendingTab trending={trending} />}
        {activeTab === "searched" && (
          <SearchedTab
            searchedTrend={searchedTrend}
            createNewTrendTag={createNewTrendTag}
            setCreateNewTrendTag={setCreateNewTrendTag}
            setTrending={setTrending}
            trending={trending}
          />
        )}
      </div>
    </div>
  );
}

export default Trending;

function TrendingTab({ trending }) {
  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">What's Trending</h2>

      {/* Scrollable List Container */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-2 your-container">
        {trending.length === 0 ? (
          <p>Create a New Trend</p>
        ) : (
          trending.map((item, index) => (
            <div key={index} className="w-full">
              <TrendCard trend={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SearchedTab({ searchedTrend, createNewTrendTag, setCreateNewTrendTag, setTrending, trending }) {
  const [isDialogFormVisible, setIsDialogFormVisible] = useState(false);

  const fields = [
    {
      label: "trend name",
      type: "text",
      name: "trend",
      value: createNewTrendTag,
      disabled: true,
    },
  ];

  const onNext = async () => {
    try {
      const tag = createNewTrendTag.slice(1);
      const response = await createTrend(tag); // Create new trend

      alert("New trend created");

      setTrending([...trending, response]);
      setCreateNewTrendTag(null);
      setIsDialogFormVisible(false);
    } catch (error) {
      console.error("Create trend error:", error);
      alert("Request cannot be completed");
    }
  };

  return (
    <>
      {isDialogFormVisible && (
        <DialogForm
          tag={"Create a new trend"}
          visible={isDialogFormVisible}
          onClose={() => {
            setIsDialogFormVisible(false);
          }}
          fields={fields}
          onConfirm={onNext}
        />
      )}
      <h2 className="text-lg font-bold">Search Results</h2>
      {searchedTrend ? (
        <div className="flex flex-col w-full h-full your-container">
          <TrendCard trend={searchedTrend} />
        </div>
      ) : (
        <p>Search or create a new trend</p>
      )}
      {createNewTrendTag && (
        <p
          className="text-red-500 cursor-pointer"
          onClick={() => {
            setIsDialogFormVisible(true);
          }}
        >
          create a new trending named {createNewTrendTag}
        </p>
      )}
    </>
  );
}
