# AI Cloud Vocabulary Learning Assistant

This is my Capstone Project

The app helps students learn important English vocabulary used in cloud computing. Users can add vocabulary words, save Chinese meanings, write examples, track review history, and use Claude AI to generate explanations, quizzes, and review recommendations based on their saved vocabulary data.

## Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: FastAPI
- Database: PostgreSQL with SQLAlchemy
- AI: Claude API
- Deployment: Docker Compose

## Main Features

- Vocabulary word CRUD
- Review log tracking
- AI word explanation
- AI quiz generation
- AI review recommendation
- Full stack Docker Compose setup

## Database Models

1. VocabularyWord
2. ReviewLog

A VocabularyWord can have many ReviewLogs.

## Run Project

```bash
docker compose up --build