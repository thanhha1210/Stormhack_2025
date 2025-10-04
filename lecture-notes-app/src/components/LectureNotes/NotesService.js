import axios from 'axios';

const NotesService = {
    analyzeNotes: async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await axios.post('/api/notes/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Error analyzing notes: ' + error.message);
        }
    },

    summarizeNotes: async (notesText) => {
        try {
            const response = await axios.post('/api/notes/summarize', { text: notesText });
            return response.data;
        } catch (error) {
            throw new Error('Error summarizing notes: ' + error.message);
        }
    },

    combineNotes: async (notesArray) => {
        try {
            const response = await axios.post('/api/notes/combine', { notes: notesArray });
            return response.data;
        } catch (error) {
            throw new Error('Error combining notes: ' + error.message);
        }
    },
};

export default NotesService;