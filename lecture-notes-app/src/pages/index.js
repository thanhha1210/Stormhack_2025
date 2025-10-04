import React from 'react';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Lecture Notes App</h1>
            <p>Your one-stop solution for managing lecture notes, quizzes, and more!</p>
            <nav>
                <ul>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/notes/analyze">Analyze Notes</a></li>
                    <li><a href="/notes/combine">Combine Notes</a></li>
                    <li><a href="/notes/summarize">Summarize Notes</a></li>
                    <li><a href="/quiz">Create Quiz</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;