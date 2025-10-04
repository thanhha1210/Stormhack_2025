import React, { useState } from 'react';
import NotesService from '../../components/LectureNotes/NotesService';

const Summarize = () => {
    const [notes, setNotes] = useState('');
    const [summary, setSummary] = useState('');

    const handleSummarize = async () => {
        const summarizedNotes = await NotesService.summarizeNotes(notes);
        setSummary(summarizedNotes);
    };

    return (
        <div>
            <h1>Summarize Lecture Notes</h1>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your lecture notes here..."
                rows="10"
                cols="50"
            />
            <button onClick={handleSummarize}>Summarize</button>
            {summary && (
                <div>
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default Summarize;