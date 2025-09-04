import React, { useState } from "react";

function SmallMediaPreview({ fileUrls, removeFile }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = fileUrls.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : prev));
  };

  const currentFile = fileUrls[currentIndex];

  return (
    <div className="relative rounded-md overflow-hidden w-32 h-36 bg-black mx-auto">
      {total > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1 text-white z-10">
          <button onClick={handlePrev}>
            <span className="material-symbols-outlined text-sm">arrow_left</span>
          </button>
          <button onClick={handleNext}>
            <span className="material-symbols-outlined text-sm">arrow_right</span>
          </button>
        </div>
      )}

      <button
        onClick={() => removeFile(currentIndex)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-20"
      >
        <span className="material-symbols-outlined text-xs">close</span>
      </button>

      <SmallMediaItem url={currentFile.url} />
    </div>
  );
}

function SmallMediaItem({ url }) {
  const isVideo = url.includes("video") || url.includes(".mp4");

  if (isVideo) {
    return (
      <video
        src={url}
        controls
        className="w-full h-full object-contain"
        playsInline
        muted
      />
    );
  }

  return (
    <img
      src={url}
      alt="Preview"
      className="w-full h-full object-contain"
    />
  );
}

export default SmallMediaPreview;
