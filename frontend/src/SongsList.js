import React, { useState, useEffect } from "react";
import "./SongList.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";


function SongsList({ title, image_url, uri, artists, key, accessToken, chooseTrack }) {
  const [track_to_play, setTrackToPlay] = useState();

  const play = () => {
      setTrackToPlay(uri);
      chooseTrack({ uri, title,artists,image_url});
  };
  useEffect(() => {
    if (track_to_play === "") return;
    // console.log("changed");
  }, [track_to_play]);
 
  return (
      <div className="songslist pt-2" onClick={play}>
        <img className="img-fluid mx-2" src={image_url} alt="songs_image" />

        <div className="mx-2">
          <h5 className="song_details">{title}</h5>
          <p>{artists[0].name}</p>
        </div>
      </div>
  );
}

export default SongsList;
