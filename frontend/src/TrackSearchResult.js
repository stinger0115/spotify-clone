import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./TrackSearchResult.css";

const TrackSearchResult = ({ track, chooseTrack }) => {
  const handlePlay = () => {
    chooseTrack(track);
  };

  // console.log(track);
  return (
    <div className="track_search_result_container">
      <div
        className="track_search_result"
        onClick={handlePlay}
      >
        <img
          className="img-fluid"
          src={track.albumUrl}
          alt="not available"
        />

        <div className="list">
          <h5>{track.title}</h5>
          <p className="">{track.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default TrackSearchResult;
