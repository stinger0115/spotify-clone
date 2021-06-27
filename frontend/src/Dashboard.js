import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import Home from "./Home";
// import Categories from "./Categories";
import Library from "./Library";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";



const spotifyApi = new SpotifyWebApi({
  clientId: "b4600204fc574bbb8c17cd3efe063665",
});

function Dashboard({ code }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setlyrics] = useState("");
  const [song_chosen, setSongChosen] = useState(false);
  const [comp_code, setCompCode] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState();

  const accessToken = useAuth(code);

  const chooseTrack = (track) => {
    setCurrentPlaying({ imgsrc: track.albumUrl, title: track.title });
    console.log(track);
    setPlayingTrack(track);
    setSearch("");
    setlyrics("");
  };

  const chooseTrackLibrary = (track) => {
    console.log(track);
    setCurrentPlaying({ imgsrc: track.image, title: track.name });
    setPlayingTrack(track);
    setlyrics("");
  };

  //for lyrics
  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setlyrics(res.data.lyrics);
        setSongChosen(true);
      });    
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    //some request may come faster and some may come slower so what we will do is we will cancel the previous request every time the search bar or accesstoken changes
    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;

      setSearchResults(
        res.body.tracks.items.map((track) => {
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[0].url,
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);

  const update = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="dashboard_container bg-dark">
      <div className="dashboard">
        <div className="left_container">
          {/* SIDEBAR ALWAYS FIXED */}
          <div className="sidebar d-flex flex-column">
            <div className="logo">
              <img
                src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
                className="img-fluid"
                alt="spotify logo"
              />
            </div>

            <div className="links d-flex flex-column mt-2 mx-1">
              {/* HOME*/}
              <div>
                <button
                  onClick={() => setCompCode(0)}
                  className={"pt-2 btn " + (comp_code === 0 ? "current" : "")}
                >
                  <span className="d-flex btn_items text-white">
                    <HomeIcon className="mx-2" />
                    Home
                  </span>
                </button>
              </div>

              {/* SEARCH */}
              <div>
                <button
                  onClick={() => setCompCode(1)}
                  className={"pt-2 btn " + (comp_code === 1 ? "current" : "")}
                >
                  <span className="d-flex btn_items text-white">
                    <SearchIcon className="mx-2" />
                    Search
                  </span>
                </button>
              </div>

              {/* YOUR LIBRARY */}
              <div>
                <button
                  onClick={() => setCompCode(2)}
                  className={"pt-2 btn " + (comp_code === 2 ? "current" : "")}
                >
                  <span className="d-flex btn_items text-white">
                    <LibraryMusicIcon className="mx-2" />
                    Library
                  </span>
                </button>
              </div>

              {/* CATEGORIES */}
              {/* <div>
                <button
                  onClick={() => setCompCode(3)}
                  className={"pt-2 btn " + (comp_code === 3 ? "current" : "")}
                >
                  <span className="d-flex btn_items text-white">
                    <RadioIcon className="mx-2" />
                    Categories
                  </span>
                </button>
              </div> */}
              <hr />
            </div>

            <div className="mx-1 current_playing mb-1">
              {currentPlaying && (
                <div className="">
                  <h5 className="text-white text-center">CURRENTLY PLAYING</h5>
                  <div className="playing_container ">
                    <img
                      src={currentPlaying.imgsrc}
                      classsName="img-fluid pt-2"
                      alt="current playing track"
                    />
                    <h5 className="text-center mt-1 text-white ">
                      {currentPlaying.title}
                    </h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* we are using the comp_code for giving the class to right container so as to change the background color according the comp_code */}
        <div
          className={
            "right_container " +
            (comp_code === 0
              ? "right_container_first"
              : comp_code === 1
              ? "right_container_second"
              : comp_code === 2
              ? "right_container_third"
              : "right_container_fourth")
          }
        >
          {comp_code === 1 ? (
            <div>
              {/* it will contain songs and player */}
              <div className="searchbar">
                <input
                  type="search"
                  placeholder="Enter the Songs/Artists"
                  onChange={update}
                />
              </div>

              <div className="songs_list ml-2" style={{ overflowY: "auto" }}>
                {searchResults.map((track) => {
                  // console.log(track);
                  return (
                    <TrackSearchResult
                      track={track}
                      chooseTrack={chooseTrack}
                    />
                  );
                })}
 
                {/* it is for displaying the lyrics i.e when searchResults is 0 then display the lyrics as after selecting the song we have cleared the searchResult */}
                {searchResults.length === 0 && song_chosen === true && (
                  <div className="lyrics_container">
                    <h1 className="display-4 text-center mt-4 ">LYRICS</h1>
                    <hr />
                    <div className="lyrics">
                      <h5 className="text-center">{lyrics}</h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : comp_code === 0 ? (
            <Home
              accessToken={accessToken}
              chooseTrackLibrary={chooseTrackLibrary}
            />
            ) :
              // comp_code === 3 ? (
              //   <Categories
              //     accessToken={accessToken}
              //     chooseTrackLibrary={chooseTrackLibrary}
              //   />
              // ) :
                (
            <Library
              code={code}
              accessToken={accessToken}
              chooseTrackLibrary={chooseTrackLibrary}
            />
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer mt-1 fixed-bottom">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </div>
  );
}

export default Dashboard;
