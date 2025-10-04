import React, { useState } from 'react';

const AnalyzeNotes = () => {
    const [image, setImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAnalyze = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setAnalysisResult(data.summary);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    };

    return (
        <div>
            <h1>Analyze Lecture Notes</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleAnalyze}>Analyze</button>
            {analysisResult && (
                <div>
                    <h2>Analysis Result:</h2>
                    <p>{analysisResult}</p>
                </div>
            )}
        </div>
    );
};

export default AnalyzeNotes;