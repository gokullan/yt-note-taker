import './Notes.css';
import Notecard from '../notecard/Notecard';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../App';

function Notes({videoId}) {
    const {allNotes, setAllNotes} = useContext(UserContext);
    const [isLoaded, setLoaded] = useState(false);
    const notesRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:5000/notes/video/fetch", {
            method: 'POST',
            body: JSON.stringify({
                videoId: videoId,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            setAllNotes(
                data.sort((a, b) => {
                    return a["timestamp_"].localeCompare(b["timestamp_"]);
                })
            );
            setLoaded(true);
        })
    }, [videoId]);

    useEffect(() => {
        // notesRef.current.scrollTop = notesRef.current.scrollHeight;
    }, [allNotes])

    return (
        <div className="Notes" ref={notesRef}>
            {
                isLoaded &&
                allNotes.map((notes) => {
                    return (
                        <Notecard key={notes["note_id"]} 
                        key_={notes["note_id"]} 
                        time={notes["timestamp_"]} 
                        note={notes["note_"]}>
                        </Notecard> 
                    );        
                })
            }
        </div>
    );
}

export default Notes;