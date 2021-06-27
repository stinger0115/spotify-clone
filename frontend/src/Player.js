import React,{useState,useEffect} from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './Player.css';
 


function Player({ accessToken, trackUri }) {
    
    const [play, setPlay] = useState(true);

    useEffect(() => {
        setPlay(true);
    }, [trackUri])



    if (!accessToken) return null;
    return (
      <div className="player">
        {/* this callback is used such that when we select any song it directly plays rather then we have to click the play  button from the player */}
        <SpotifyPlayer
          styles={{
            color: "white",
            bgColor: "black",
            sliderColor: "green",
            sliderHandleColor: "white",
            trackNameColor: "white",
            sliderTrackColor: "grey",
          }}
          token={accessToken}
          initialVolume="30"
          showSaveIcon
          syncExternalDevice={true}
          callback={(state) => {
            if (!state.isPlaying) setPlay(false);
          }}
          play={play}
          uris={trackUri ? [trackUri] : []}
        />
      </div>
    );
} 

export default Player;