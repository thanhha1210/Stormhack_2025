import React, { useState } from 'react';

const CombineNotes = () => {
    const [notes, setNotes] = useState([]);
    const [combinedNote, setCombinedNote] = useState('');

    const handleNoteChange = (e) => {
        const { value } = e.target;
        setCombinedNote(value);
    };

    const handleAddNote = () => {
        if (combinedNote) {
            setNotes([...notes, combinedNote]);
            setCombinedNote('');
        }
    };

    const handleCombineNotes = () => {
        // Logic to combine notes can be implemented here
        alert('Notes combined: ' + notes.join('\n'));
    };

    return (
        <div>
            <h1>Combine Student Notes</h1>
            <textarea
                value={combinedNote}
                onChange={handleNoteChange}
                placeholder="Type or paste your note here..."
            />
            <button onClick={handleAddNote}>Add Note</button>
            <button onClick={handleCombineNotes}>Combine Notes</button>
            <h2>Added Notes:</h2>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </div>
    );
};

export default CombineNotes;