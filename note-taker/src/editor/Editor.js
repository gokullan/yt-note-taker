import './Editor.css';
import { UserContext } from '../App'
import { useContext, useEffect, useRef, useState } from 'react';
import retrieveImageFromClipboardAsBase64 from './base64';
import { useIntersection } from './useIntersection';

// markdown editor setup
var md = require('markdown-it')(),
    mk = require('markdown-it-katex');
md.use(mk);

// youtube player
const YTPlayer = require('yt-player');

function Editor({videoId, youtubeId}) {

    const playerDivRef = useRef(null);
    const editorRef = useRef(null);
    const previewRef = useRef(null);
    
    const isPlayerDivVisible = useIntersection(playerDivRef, "0px");
    const { player, setPlayer, allNotes, setAllNotes } = useContext(UserContext);

    const [pasteDone, setPasteDone] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [img, setImg] = useState(null);
    const [note, setNote] = useState(null);
    const [preview, setPreview] = useState(false);

    // create YT player once the wrapper is visible
    useEffect(() => {
        if (isPlayerDivVisible) {
            setPlayer(new YTPlayer('#ytplayer'));
        }
      }, [isPlayerDivVisible]);

    // load video if player is not null
    useEffect(() => {
        if (player) {
            player.load(youtubeId);
        }
    }, [player]);

    useEffect(() => {
        if (preview) {
            previewRef.current.innerHTML = md.render(note);
        }
        else {
            editorRef.current.innerText = note;
        }
    }, [preview])

    function togglePreview() {
        if (!preview) {
            setNote(editorRef.current.innerText);
        }
        setPreview(!preview);
    }

    function pasteHandler(event) {
        event.preventDefault();
        const src = retrieveImageFromClipboardAsBase64(event, function(imageDataBase64){
            if(imageDataBase64){
                // data:image/png;base64,iVBORw0KGgoAAAAN......
                setImg(imageDataBase64);
            }
        });
        setPasteDone(true);
        setImgSrc(src);
    }

    function pauseVideo() {
        player.pause();
    }

    async function save() {
        var note_id;
        const timestamp = new Date(player.getCurrentTime() * 1000).toISOString().slice(11, 19);
        if (img || editorRef.current.innerText) {
            var formData = new FormData();
            if (img) {
                formData.append("file", img);
            }
            formData.append("videoId", videoId);
            formData.append("timestamp", timestamp);
            formData.append("note", editorRef.current.innerText);
            note_id = await fetch("http://localhost:5000/notes/video/write", {
                method: "POST",
                body: formData,
            });
            note_id = await note_id.json();
            console.log(note_id);
        }
        setPasteDone(false);
        setImg(null);
        setImgSrc("");
        setAllNotes([
            ...allNotes,
            {
                "note_id": note_id[0]["note_id"],
                "note_": editorRef.current.innerText,
                "timestamp_": timestamp,
            }
        ].sort((a, b) => {
            return a["timestamp_"].localeCompare(b["timestamp_"]);
        }))
        editorRef.current.innerHTML = "";
    }

    return (
        <div className='Editor'>
            <div id="player-wrapper">
                <div ref={playerDivRef} id="ytplayer">
                </div>
            </div>
            {/* editor */}
            <div id="edit-and-preview">
                {
                    !preview &&
                    <div id="type-area" ref={editorRef} 
                    onClick={pauseVideo} onDoubleClick={togglePreview} 
                    contentEditable="true">
                    </div>
                }
                {
                    preview &&
                    <div id="preview-area" ref={previewRef} 
                    onDoubleClick={togglePreview} 
                    >
                </div>
                }

                <div id="paste-area">
                    {
                        !pasteDone &&
                        <textarea id="paste-before" onPaste={pasteHandler}
                        placeholder='Paste image here (if any)'
                        >
                        </textarea>
                    }
                    {
                        pasteDone &&
                        <img onDoubleClick={() => {setPasteDone(false)}} src={imgSrc} id="image-note" />
                    }
                </div>
            </div>

            <div className='button-wrap'>
                <button onClick={save}>Save</button>
            </div>

        </div>
    )
}

export default Editor;