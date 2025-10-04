import axios from 'axios';

const API_URL = '/api/quiz';

const QuizService = {
    createQuiz: async (quizData) => {
        try {
            const response = await axios.post(`${API_URL}/create`, quizData);
            return response.data;
        } catch (error) {
            throw new Error('Error creating quiz: ' + error.message);
        }
    },

    trackAnswer: async (quizId, questionId, isCorrect) => {
        try {
            const response = await axios.post(`${API_URL}/track`, { quizId, questionId, isCorrect });
            return response.data;
        } catch (error) {
            throw new Error('Error tracking answer: ' + error.message);
        }
    },

    getQuizResults: async (quizId) => {
        try {
            const response = await axios.get(`${API_URL}/results/${quizId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching quiz results: ' + error.message);
        }
    }
};

export default QuizService;