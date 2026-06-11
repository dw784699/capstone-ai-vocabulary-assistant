from typing import Optional, List
from pydantic import BaseModel


class VocabularyWordBase(BaseModel):
    word: str
    definition: Optional[str] = None
    chinese_meaning: Optional[str] = None
    example_sentence: Optional[str] = None
    category: Optional[str] = "cloud"
    status: Optional[str] = "learning"
    confidence: Optional[int] = 1


class VocabularyWordCreate(VocabularyWordBase):
    pass


class VocabularyWordUpdate(BaseModel):
    word: Optional[str] = None
    definition: Optional[str] = None
    chinese_meaning: Optional[str] = None
    example_sentence: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    confidence: Optional[int] = None


class ReviewLogCreate(BaseModel):
    question: Optional[str] = None
    user_answer: Optional[str] = None
    correct_answer: Optional[str] = None
    is_correct: Optional[bool] = False
    ai_feedback: Optional[str] = None


class ReviewLogOut(ReviewLogCreate):
    id: int
    word_id: int

    class Config:
        from_attributes = True


class VocabularyWordOut(VocabularyWordBase):
    id: int
    reviews: List[ReviewLogOut] = []

    class Config:
        from_attributes = True


class AIWordRequest(BaseModel):
    word: str


class AIQuizRequest(BaseModel):
    word_id: int


class AIReviewRequest(BaseModel):
    message: str