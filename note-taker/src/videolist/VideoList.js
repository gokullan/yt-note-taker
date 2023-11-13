import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import VideoCard from '../videocard/VideoCard';
import './videolist.css';

function VideoList({usernameProp}) {
    const [videoList, setVideoList] = useState(null);

    var username;
    const navigate = useNavigate();
    const location = useLocation();
    if (location.state) {
        username = location.state["username"];
    }
    // usernameProp is defined for testing purposes
    else {
        username = usernameProp;
    }
    const url = `http://localhost:5000/notes/${username}/list`;

    useEffect(() => {
        fetch(url, {
            headers: {
                "Authorization": localStorage.getItem("texjwt")
            }
        }).then((res) => {
            if (res.ok) {
                return res.json()
            }
        }).then((data) => {
            setVideoList(data);
        })
    }, []);

    async function checkURL(e) {
       if (e.keyCode == 13) {
        const youtubeId = e.target.value.split('?')[0].slice(-11);
        const res = await fetch(
            `http://localhost:5000/notes/${youtubeId}`,
        );
        if (res.status == 200) {
            const res_ = await fetch(
                `http://localhost:5000/notes/${username}/new`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        "youtubeId": youtubeId,
                        "username": username,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const test = await res_.json();;
            const videoId = test[0]["video_id"];
            navigate("/workspace", {
                state: {
                    "videoId": videoId,
                    "youtubeId": youtubeId
                }
            })
        }
       }
    }

    async function download(video) {
        const res = await fetch("http://localhost:5000/download/test", {
                                method: "POST",
                                body: JSON.stringify({
                                    "videoId": video["video_id"]
                                }),
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
        const blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'notes.pdf';
                    a.click();
    }

    return (
        <div className="VideoDisplay">
            <div id='search'>
                <input type="text" 
                placeholder='Enter Youtube Share URL'
                name="yt-url-input" 
                id='yt-url-input'
                onKeyUp={checkURL}
                />
            </div>
            {
                videoList &&
                videoList.map(video => (
                    <div key={video["video_id"]}>
                        <VideoCard video={video}></VideoCard>
                        <button onClick={() => download(video)}>Download</button>
                        <hr />
                    </div>
                ))
            }
        </div>
    )
}

export default VideoList;