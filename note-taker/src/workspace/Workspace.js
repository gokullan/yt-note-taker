import { Link, useLocation, useNavigate } from "react-router-dom";
import Editor from "../editor/Editor";
import Notes from "../notes/Notes";

function Workspace() {
    const location = useLocation();

    var videoId, youtubeId;
    const state = location.state;
    
    console.log(state);
    if (state) {
        videoId = state["videoId"];
        youtubeId = state["youtubeId"];
    }

    return(
        <div id="main">
            <Notes videoId={videoId}></Notes>
            <Editor videoId={videoId} youtubeId={youtubeId}></Editor>
        </div>
    )
}

export default Workspace;