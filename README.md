# AI Cloud Vocabulary Learning Assistant

This is my Capstone Project for the Full Stack course.

The app helps students learn important English vocabulary used in cloud computing. Users can add vocabulary words, save Chinese meanings, write example sentences, track review history, and use Claude AI to generate explanations, quizzes, and personalized review recommendations based on saved vocabulary data.

## Project Purpose

Many students learning cloud computing also need to learn technical English words such as Kubernetes, container, deployment, API, database, and orchestration. This app helps students manage those words and practice them with AI support.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Database: PostgreSQL
- ORM: SQLAlchemy
- AI: Claude API
- Deployment / Local Demo: Docker Compose

## Main Features

### Frontend

- Home page
- Vocabulary management page
- Review practice page
- AI assistant page
- Shared navigation across pages
- Responsive layout
- Loading and error states

### Backend

The backend provides REST API endpoints for vocabulary words, review logs, and AI-powered study features.

### Database Models

This project uses two database models with a relationship:

1. VocabularyWord
   - Stores the vocabulary word, definition, Chinese meaning, example sentence, category, status, and confidence level.

2. ReviewLog
   - Stores review answers, correct answers, correctness, and AI feedback.
   - Each review log belongs to one vocabulary word.

## API Endpoints

### Vocabulary CRUD

- GET `/words`
- POST `/words`
- GET `/words/{word_id}`
- PATCH `/words/{word_id}`
- DELETE `/words/{word_id}`

### Review Logs

- GET `/words/{word_id}/reviews`
- POST `/words/{word_id}/reviews`

### AI Endpoints

- POST `/ai/explain-word`
  - Generates a clear AI explanation for a vocabulary word.

- POST `/ai/generate-quiz`
  - Uses a saved database word to generate a quiz question.

- POST `/ai/recommend-review`
  - Uses saved vocabulary and review history to recommend what the student should review next.

## AI Integration

The AI feature is meaningful because it does not act as a generic chatbot. It uses the user's saved application data.

Examples:

- The quiz generator uses a saved vocabulary word from the database.
- The review recommendation feature reads the user's vocabulary status, confidence level, and review history.
- The explanation feature helps students understand cloud vocabulary in simple English and Chinese.

## How to Run the Project

Create a `.env` file in the project root with:

```env
ANTHROPIC_API_KEY=your_api_key_here