import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import PlaylistCard from "./PlaylistCard";
import SongsList from "./SongsList";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Library.css";



const Library = ({ code, accessToken, chooseTrackLibrary }) => {
  const [playlist_data, setData] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playerTrack, setPlayerTrack] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("Recently Played");

  const spotifyapi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "b4600204fc574bbb8c17cd3efe063665",
    clientSecret: "be03e0df55d441b38ea36b0d59c7e451",
    accessToken: accessToken,
  });

  //getting the users playlists
  useEffect(() => {
    spotifyapi
      .getUserPlaylists()
      .then((data) => {
        // console.log(data.body);
        setData(
          data.body.items.map((curr) => {
            return {
              title: curr.name,
              id: curr.id,
              images: curr.images,
              key: curr.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error occurred while reading playlist: ", err);
      });
    
  }, []);

  useEffect(() => {
    //it is for initial when the page is refreshed the playlist id is empty so it will throw an error if not used this condition
    if (playlistId === "") return;
    // console.log("playlist id: ", playlistId);

    //THIS IS FOR SETTING UP PLAYLIST TITLE
    //YOU CAN ALSO PASS THE TITLE ALONG WITH PLAYLIST ID
    //BUT AS CODE WAS COMPLEX SO HERE I DECIDED TO CALL THIS FUNCTION AND GET THE INFO ABOUT PLAYLIST
    spotifyapi.getPlaylist(playlistId).then((title) => {
      setPlaylistTitle(title.body.name);
    }).catch((err) => {
      console.log("Error while setting playlist title ", err)
    });


    spotifyapi
      .getPlaylistTracks(playlistId)
      .then((tracks) => {
        // console.log(tracks.body.items);
        setPlaylistTracks(
          tracks.body.items.map((curr) => {
            return {
              name: curr.track.name,
              uri: curr.track.uri,
              artists: curr.track.artists,
              image: curr.track.album.images[0].url,
              key:curr.track.id,
            }
          })
        )
      })
      .catch((err) => {
        console.log("Error while fetching playlist tracks ", err);
      });
  }, [playlistId])


  useEffect(() => {
    spotifyapi.getMyRecentlyPlayedTracks({
      limit:10
    }).then((tracks) => {
      // console.log(tracks.body);
      setPlaylistTracks(
        tracks.body.items.map((curr) => {
          return {
            name: curr.track.name,
            uri: curr.track.uri,
            artists: curr.track.artists,
            image: curr.track.album.images[0].url,
          };
        })
      );
    }).catch((err) => {
      console.log("Error while fetching Recently Player, ", err);
    })
  }, [])


  //once the playerTrack has been set using the SongsList.js using function as prop then we will call the function in dashboard where the actual player is present and there we will set the choosen song details so that it can play in player 
  useEffect(() => {
    if (playerTrack === "") return;
    // console.log("Track choosen and it is: ", playerTrack);
    chooseTrackLibrary(playerTrack);
  }, [playerTrack])

  // console.log(playlistTracks);
  
  return (
    <div className="main_library container-fluid">
      <div className="library container-fluid d-flex">
        {playlist_data.map((data) => {
          return (
            <PlaylistCard              
              title={data.title}
              id={data.id}
              images={data.images}
              accessToken={accessToken}
              key={data.id}
              change_id={data_id => setPlaylistId(data_id)}
            />
          );
        })} 
      </div>

      <div className="playlist_songs">
        <h3 className="mb-2">{playlistTitle}</h3>
        <div className="">
        {
          // here we have used chooseTrack so that we can set the setPlayerTrack useState in library.js using the info we get from SongList.js i.e when we select any playlist then SongList.js calls the chooseTrack function which is passed to it as a prop then it will setPlaylistTrack from there
          //we are sending title name and artist name along with track so that it will be helpful for finding the lyrics
          playlistTracks.map((curr) => {
            return <SongsList
              title={curr.name}
              image_url={curr.image}
              artists={curr.artists}
              uri={curr.uri}
              key={curr.key}
              accessToken={accessToken}
              chooseTrack={track => setPlayerTrack({uri:track.uri,name:track.title,artist:track.artists[0].name,image:track.image_url})}
            />
          })
          }
          </div>
      </div>
    </div>
  );
};

export default Library;