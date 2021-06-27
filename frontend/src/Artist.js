import React from 'react'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './Artist.css';

function Artist({ id, imgsrc, name, changeId }) {

    const setArtist = () => {        
        changeId({ id:id,name:name });
    }

    return (
        <div
            className="artist_tile mx-2 pt-2"
            onClick={setArtist}
        >
            <img className="img-fluid artist_img" src={imgsrc} alt="artist_image"/>
            <h5 className="text-center">{name}</h5>
      </div>
    );
}

export default Artist
