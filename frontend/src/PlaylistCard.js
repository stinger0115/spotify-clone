import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./PlaylistCard.css";



function PlaylistCard({ title, id, images, accessToken ,change_id}) {

  return (
    <div>
      <div
        className="playlist_card d-flex flex-column mx-3 mt-4"
        onClick={()=>change_id(id)}
      >
        <img src={images[0].url} className="img-fluid" alt="playlist logo" />
        <h5 className="text-center title mt-2">{title}</h5>
          </div>
    </div>
  );
}

export default PlaylistCard;