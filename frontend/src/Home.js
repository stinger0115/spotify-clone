import React, { useState, useEffect } from "react";
import "./Home.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from "spotify-web-api-node";
import Artist from "./Artist";

function Home({ accessToken, chooseTrackLibrary }) {
  const [topArtists, setTopArtists] = useState([]);
  const [artistId, setArtistId] = useState("");
  const [artistTracks, setArtistTracks] = useState([]);
  const [artistSelected, setArtistSelected] = useState(false);
  const [currentSelect, setCurrentSelect] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [newReleases, setNewReleases] = useState();
  const [playlist, setPlaylist] = useState("");
  const [releasesTracks, setReleasesTracks] = useState([]);

  const spotifyapi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "b4600204fc574bbb8c17cd3efe063665",
    clientSecret: "be03e0df55d441b38ea36b0d59c7e451",
    accessToken: accessToken,
  });

  //it is for getting the top 5 artist
  useEffect(() => {
    if (accessToken === "") return;
    spotifyapi
      .getMyTopArtists()
      .then((data) => {
        // console.log(data);
        setTopArtists(
          data.body.items.map((data) => {
            return {
              name: data.name,
              image: data.images[0].url,
              id: data.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error while getting top artists is: ", err);
      });

    //getting the top tracks of the user
    spotifyapi
      .getMyTopTracks({ limit: 10 })
      .then((data) => {
        // console.log(data);
        setTopTracks(
          data.body.items.map((data) => {
            return {
              name: data.name,
              id: data.id,
              image: data.album.images[0].url,
              uri: data.uri,
              artist: data.artists[0].name,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error while getting Top Tracks");
      });

    //this is for getting the new released playlist and then using the id of those playlists we fetch there songs and choose to play if we want to
    spotifyapi
      .getNewReleases({
        limit: 10,
        country: "IN",
      })
      .then((data) => {
        return data.body.albums;
      })
      .then((curr) => {
        // console.log(curr);
        setNewReleases(
          curr.items.map((album) => {
            return {
              name: album.name,
              image: album.images[0].url,
              artist: album.artists[0].name,
              id: album.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error while getting new Releases ", err);
      });
  }, [accessToken]);

  //it is getting the tracks of the selected artist
  useEffect(() => {
    if (artistId === "") return;
    spotifyapi
      .getArtistTopTracks(artistId.id, "IN")
      .then((data) => {
        // console.log(data);
        setArtistSelected(true);
        setArtistTracks(
          data.body.tracks.map((curr) => {
            return {
              name: curr.name,
              id: curr.id,
              image: curr.album.images[0].url,
              uri: curr.uri,
              artist: curr.name,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error while getting the Artist top Tracks: ", err);
      });
  }, [artistId]);

  //this useEffect is for sending the info of selected song to the Dashboard inorder to play the songs
  useEffect(() => {
    if (currentSelect === "") return;
    console.log(currentSelect);
    chooseTrackLibrary(currentSelect);
  }, [currentSelect]);

  //this useEffect will be for the tracks of the playlist you choose from the new Releases playlist
  useEffect(() => {
    if (playlist == "") return;
    // console.log(playlist);
    spotifyapi
      .getAlbumTracks(playlist.id)
      .then((data) => {
        // console.log(data);
        return data.body;
      })
      .then((curr) => {
        // console.log(curr);
        setReleasesTracks(
          curr.items.map((temp) => {
            return {
              name: temp.name,
              id: temp.id,
              image: playlist.image,
              uri: temp.uri,
              artist: temp.name,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error while getting New Releases playlist tracks ", err);
      });
  }, [playlist]);

  // console.log(topArtists);
  // console.log(artistId);
  // console.log(artistTracks);
  // console.log(topTracks);
  // console.log(newReleases);
  // console.log(releasesTracks);

  return (
    <div className="home">
      {/* THIS CONTAINER IS FOR YOUR TOP 5 ARTISTS */}
      <div className="top_artists mt-3">
        <h2 className="mx-3">YOUR TOP 5 ARTISTS</h2>

        <div className="artists mt-3 mx-3">
          {topArtists.map((data) => {
            return (
              <Artist
                imgsrc={data.image}
                id={data.id}
                name={data.name}
                changeId={(data) => setArtistId(data)}
              />
            );
          })}
        </div>
        <hr />
      </div>
      <div> 
        {/* THIS CONTAINER WILL ONLY BE VISIBLE WHEN YOU SELECT ANY ARTIST AND WILL DISPLAY THE TOP TRACKS BY THE ARTIST */}
        {/* <h1>THIS IS SECOND CONTAINER</h1> */}
        {artistSelected === true ? (
          <div className="artist_tracks_list mb-4 container-fluid">
            <h3 className="my-2 text-center">Top Tracks Of {artistId.name}</h3>

            <div className="my-2 artist_songs_container">
              {artistTracks.map((data) => {
                return (
                  <div className="actual_track_container">
                    <div
                      className="actual_track py-2"
                      onClick={() => setCurrentSelect(data)}
                    >
                      <img
                        className="img-fluid mx-2"
                        src={data.image}
                        alt={data.name + "image"}
                      />
                      <h5 className="text-center my-2 px-1">{data.name}</h5>
                    </div>
                  </div>
                );
              })}
            </div>
            <hr />
          </div>
        ) : (
          <div></div>
        )}
      </div>

      {/* THIS CONTAINER IS FOR YOUR TOP TRACKS */}
      <div className="m-3 top_tracks ">
        <h5>YOUR TOP TRACKS</h5>
        <div className="top_tracks_list mt-1">
          {topTracks.map((curr) => {
            return (
              <div className="top_track_container pt-2">
                <div
                  className="top_tracks_tile mx-2"
                  onClick={() => setCurrentSelect(curr)}
                >
                  <img
                    className="img-fluid"
                    src={curr.image}
                    alt="track_image"
                  />
                  <h5 className="text-center mt-2">{curr.name}</h5>
                </div>
              </div>
            );
          })}
        </div>
        <hr />
      </div>

      {newReleases && (
        <div className="new_releases mx-3">
          <h5>NEW RELEASES</h5>
          <div className="releases_playlist">
            {newReleases.map((curr) => {
              return (
                <div className="top_track_container pt-2">
                  <div
                    className="top_tracks_tile mx-2"
                    onClick={() => setPlaylist(curr)}
                  >
                    <img
                      className="img-fluid"
                      src={curr.image}
                      alt="track_image"
                    />
                    <h5 className="text-center mt-2">{curr.name}</h5>
                  </div>
                </div>
              );
            })}
          </div>
          <hr />
          {
            //it will only show the playlist tracks once it is clicked
            playlist && (
              <div className="release_playlist_tracks mx-3">
                <h5>{playlist.name} Tracks</h5>
                <p>- {playlist.artist}</p>
                <div className="playlist_details">
                  {releasesTracks.map((curr) => {
                    return (
                      <div className="playlist_tile_container">
                        <div
                          className="playlist_tile"
                          onClick={()=> setCurrentSelect(curr)}
                        >
                          <img
                            className="img-fluid p-2"
                            src={curr.image}
                            alt="track_image"
                          />
                          <h5 className="mx-1">{curr.name}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}

export default Home;
