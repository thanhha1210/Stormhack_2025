import React, { useState, useEffect } from 'react';
import QuizService from '../components/Quiz/QuizService';

const QuizPage = () => {
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchQuizQuestions = async () => {
            const questions = await QuizService.getQuizQuestions();
            setQuizQuestions(questions);
        };
        fetchQuizQuestions();
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers({
            ...userAnswers,
            [questionId]: answer,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const score = await QuizService.submitAnswers(userAnswers);
        setResults(score);
    };

    return (
        <div>
            <h1>Create a Quiz</h1>
            <form onSubmit={handleSubmit}>
                {quizQuestions.map((question) => (
                    <div key={question.id}>
                        <label>{question.text}</label>
                        {question.options.map((option) => (
                            <div key={option}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    onChange={() => handleAnswerChange(question.id, option)}
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">Submit Quiz</button>
            </form>
            {results && <div>Your score: {results}</div>}
        </div>
    );
};

export default QuizPage;