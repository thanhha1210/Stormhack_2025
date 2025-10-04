import axios from 'axios';

const SFU_COURSE_API_URL = 'https://api.sfu.ca/courses'; // Replace with the actual SFU Course API URL

export const fetchCourseTopics = async (courseId) => {
    try {
        const response = await axios.get(`${SFU_COURSE_API_URL}/${courseId}/topics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course topics:', error);
        throw error;
    }
};

export const fetchCourseDetails = async (courseId) => {
    try {
        const response = await axios.get(`${SFU_COURSE_API_URL}/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course details:', error);
        throw error;
    }
};