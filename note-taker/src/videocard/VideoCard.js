import { useEffect, useState } from "react";
import './videocard.css';
import { Link } from "react-router-dom";

function VideoCard({video}) {
    const youtubeId = video["youtube_id"];
    const [ytInfo, setYtInfo] = useState(null);
    useEffect(() => {
        fetch(
            `http://localhost:5000/notes/${youtubeId}`
        ).then((res) => {
            if (res.status == 200) {
                return res.json();
            }
        }).then((data) => {
            setYtInfo(data);
        })
    }, [youtubeId]); 
    return (
        <div className="videoCard">
            {
                ytInfo && 
                <div className="card-wrap">
                    <Link className="thumbnail" 
                    to="/workspace"
                    state={{
                        "videoId": video["video_id"],
                        "youtubeId": video["youtube_id"]
                    }}
                    >
                        <img src={ytInfo["thumbnails"]["medium"]["url"]} alt="" /> 
                    </Link>
                    <div className="description">
                        <h3>{ytInfo["title"]}</h3>
                    </div> 
                </div>
            }
        </div>
    )
}

export default VideoCard