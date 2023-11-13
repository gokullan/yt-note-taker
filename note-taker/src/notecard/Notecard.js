import './notecard.css';
import { UserContext } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faCancel } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState, useContext } from 'react';
import parse from 'html-react-parser';

// markdown editor setup
var md = require('markdown-it')(),
    mk = require('markdown-it-katex');
md.use(mk);

function Notecard({key_, note, time}) {
    const [editable, setEditable] = useState(false);
    const [noteState, setNoteState] = useState(note);
    
    const noteRef = useRef(null);

    const { player, setPlayer } = useContext(UserContext);
    const { allNotes, setAllNotes } = useContext(UserContext);

    useEffect(() => {
        if (editable) {
            noteRef.current.innerText = noteState;
            noteRef.current.focus();
        }
        else {
            noteRef.current.innerHTML = md.render(noteState);
        }
    }, [editable]);

    function edit() {
        setEditable(true);
        player.pause();
    }

    function cancel() {
        setEditable(false);
    }

    async function remove() {
        await fetch("http://localhost:5000/notes/video/delete", {
            method: "POST",
            body: JSON.stringify({
                noteId: key_,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        setAllNotes(oldNotes => {
            return oldNotes.filter((note) => {
                return note["note_id"] != key_;
            })
        });
    }

    function seek() {
        player.seek(
            time.split(':').reduce((acc,time) => (60 * acc) + +time)
        );
        player.pause();
    }

    async function update() {
        await fetch("http://localhost:5000/notes/video/update", {
            method: "POST",
            body: JSON.stringify({
                noteId: key_,
                note: noteRef.current.innerText
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        setAllNotes(allNotes.map((note) => {
            if (note["note_id"] == key_) {
                return {
                    ...note, "note_": noteRef.current.innerText
                }
            }
            return note;
        }));
        setNoteState(noteRef.current.innerText);
        setEditable(false);
    }

    return(
        <div className="Notecard">
            <div className='time-wrap' onClick={seek}>
                <span className='time'>{time}</span>
            </div>
            <div className='note-display'>
                <div ref={noteRef} contentEditable={editable} className='note-content'>
                        {/* {!editable && parse(md.render(noteState))}
                        {editable && noteState} */}
                    {/* {!editable && parse(md.render(note))}
                    {editable && note} */}
                </div>
                {
                    editable &&
                    <div className='update-options'>
                    <span className='icon-wrapper'>
                        <FontAwesomeIcon icon={faCheck} onClick={update} size='1x'/>
                    </span>
                    <span className='icon-wrapper'>
                        <FontAwesomeIcon icon={faCancel} onClick={cancel} size='1x'/>
                    </span>
                </div>
                }
                {
                    !editable &&
                    <div className='update-options'>
                    <span className='icon-wrapper'>
                        <FontAwesomeIcon icon={faPen} onClick={edit} size='1x'/>
                    </span>
                    <span className='icon-wrapper'>
                        <FontAwesomeIcon icon={faTrash} onClick={remove} size='1x'/>
                    </span>
                    </div>
                }
            </div>
            <hr />
        </div>
    );
}

export default Notecard;