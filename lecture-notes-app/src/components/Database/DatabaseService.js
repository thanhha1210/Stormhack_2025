import { db } from '../../lib/db'; // Assuming you have a database connection setup

const DatabaseService = {
    createNote: async (noteData) => {
        try {
            const result = await db.collection('notes').add(noteData);
            return result.id;
        } catch (error) {
            throw new Error('Error creating note: ' + error.message);
        }
    },

    getNotes: async () => {
        try {
            const snapshot = await db.collection('notes').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            throw new Error('Error fetching notes: ' + error.message);
        }
    },

    updateNote: async (noteId, updatedData) => {
        try {
            await db.collection('notes').doc(noteId).update(updatedData);
        } catch (error) {
            throw new Error('Error updating note: ' + error.message);
        }
    },

    deleteNote: async (noteId) => {
        try {
            await db.collection('notes').doc(noteId).delete();
        } catch (error) {
            throw new Error('Error deleting note: ' + error.message);
        }
    }
};

export default DatabaseService;