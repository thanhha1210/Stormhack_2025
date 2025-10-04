# Lecture Notes App

## Overview
The Lecture Notes App is a web application designed to assist students in managing their lecture notes effectively. It provides features for analyzing, summarizing, and combining notes, as well as creating quizzes to enhance learning.

## Features
- **User Authentication**: Secure login functionality using NextAuth.js.
- **Note Analysis**: Upload and analyze pictures of lecture notes.
- **Note Summarization**: Automatically summarize lecture notes for quick review.
- **Note Combination**: Merge multiple student notes into a single document.
- **Quiz Creation**: Create quizzes and track correct/incorrect answers for better learning.
- **Course Tracking**: Keep track of current topics and courses using the SFU Course API.
- **Database Integration**: Store and manage user data and notes efficiently.

## Technologies Used
- **Frontend**: React.js, Next.js
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Custom database service for CRUD operations
- **API Integration**: SFU Course API for course data

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd lecture-notes-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables for authentication and database configuration.
5. Run the development server:
   ```
   npm run dev
   ```
6. Open your browser and go to `http://localhost:3000` to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.