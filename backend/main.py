from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import VocabularyWord, ReviewLog
from schemas import (
    VocabularyWordCreate,
    VocabularyWordUpdate,
    VocabularyWordOut,
    ReviewLogCreate,
    ReviewLogOut,
    AIWordRequest,
    AIQuizRequest,
    AIReviewRequest,
)
from ai import explain_word_with_ai, generate_quiz_with_ai, recommend_review_with_ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Cloud Vocabulary Learning Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "AI Cloud Vocabulary Learning Assistant API is running"
    }


# -------------------------
# Vocabulary CRUD endpoints
# -------------------------

@app.get("/words", response_model=list[VocabularyWordOut])
def get_words(db: Session = Depends(get_db)):
    return db.query(VocabularyWord).order_by(VocabularyWord.id.desc()).all()


@app.post("/words", response_model=VocabularyWordOut)
def create_word(word: VocabularyWordCreate, db: Session = Depends(get_db)):
    db_word = VocabularyWord(**word.model_dump())
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word


@app.get("/words/{word_id}", response_model=VocabularyWordOut)
def get_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(VocabularyWord).filter(VocabularyWord.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")
    return db_word


@app.patch("/words/{word_id}", response_model=VocabularyWordOut)
def update_word(
    word_id: int,
    word_update: VocabularyWordUpdate,
    db: Session = Depends(get_db),
):
    db_word = db.query(VocabularyWord).filter(VocabularyWord.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")

    update_data = word_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_word, key, value)

    db.commit()
    db.refresh(db_word)
    return db_word


@app.delete("/words/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(VocabularyWord).filter(VocabularyWord.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")

    db.delete(db_word)
    db.commit()

    return {"message": "Word deleted successfully"}


# -------------------------
# Review Log endpoints
# -------------------------

@app.get("/words/{word_id}/reviews", response_model=list[ReviewLogOut])
def get_reviews_for_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(VocabularyWord).filter(VocabularyWord.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")

    return db.query(ReviewLog).filter(ReviewLog.word_id == word_id).all()


@app.post("/words/{word_id}/reviews", response_model=ReviewLogOut)
def create_review_for_word(
    word_id: int,
    review: ReviewLogCreate,
    db: Session = Depends(get_db),
):
    db_word = db.query(VocabularyWord).filter(VocabularyWord.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")

    db_review = ReviewLog(
        word_id=word_id,
        **review.model_dump()
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


# -------------------------
# AI endpoints
# -------------------------

@app.post("/ai/explain-word")
def ai_explain_word(request: AIWordRequest):
    return explain_word_with_ai(request.word)


@app.post("/ai/generate-quiz")
def ai_generate_quiz(request: AIQuizRequest, db: Session = Depends(get_db)):
    db_word = db.query(VocabularyWord).filter(VocabularyWord.id == request.word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")

    word_data = {
        "word": db_word.word,
        "definition": db_word.definition,
        "chinese_meaning": db_word.chinese_meaning,
        "example_sentence": db_word.example_sentence,
    }

    return generate_quiz_with_ai(word_data)


@app.post("/ai/recommend-review")
def ai_recommend_review(request: AIReviewRequest, db: Session = Depends(get_db)):
    words = db.query(VocabularyWord).all()
    reviews = db.query(ReviewLog).all()

    word_data = [
        {
            "id": word.id,
            "word": word.word,
            "definition": word.definition,
            "chinese_meaning": word.chinese_meaning,
            "status": word.status,
            "confidence": word.confidence,
        }
        for word in words
    ]

    review_data = [
        {
            "id": review.id,
            "word_id": review.word_id,
            "question": review.question,
            "user_answer": review.user_answer,
            "is_correct": review.is_correct,
            "ai_feedback": review.ai_feedback,
        }
        for review in reviews
    ]

    return recommend_review_with_ai(word_data, review_data, request.message)