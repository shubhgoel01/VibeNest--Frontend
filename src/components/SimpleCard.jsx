import { React, useState } from "react";

function SimpleMediaCard({ fileUrls}) {
  const totalMedia = fileUrls.length - 1;
  const [currentVisibleMedia, setCurrentVisibleMedia] = useState(0);

  return (
    <div className="relative rounded-lg overflow-hidden flex justify-center items-center bg-black w-full h-[250px]">
            {fileUrls.length > 1 && (
        <div className="absolute z-10 flex justify-between w-full px-2 text-white">
          <span
            className="cursor-pointer"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.max(0, curr - 1))
            }
          >
            <span className="material-symbols-outlined">arrow_left</span>
          </span>
          <span
            className="cursor-pointer"
            onClick={() =>
              setCurrentVisibleMedia((curr) => Math.min(curr + 1, totalMedia))
            }
          >
            <span className="material-symbols-outlined">arrow_right</span>
          </span>
        </div>
      )}

      {/* Media Display */}
      <SimpleCardMedia2 url={fileUrls[currentVisibleMedia].url} />
    </div>
  );
}

function SimpleCardMedia2({ url }) {
  const mediaType = url.includes("video") ? "video" : "image";

  if (mediaType === "image") {
    return (
      <img
        src={url}
        alt="Post Media"
        className="w-full h-full object-contain"
        id="IMAGE"
      />
    );
  }

  if (mediaType === "video") {
    return (
      <video playsInline className="w-full h-full object-scale-down" id="VIDEO">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
}

export { SimpleMediaCard };