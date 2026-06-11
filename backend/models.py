from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class VocabularyWord(Base):
    __tablename__ = "vocabulary_words"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False, index=True)
    definition = Column(Text, nullable=True)
    chinese_meaning = Column(Text, nullable=True)
    example_sentence = Column(Text, nullable=True)
    category = Column(String, default="cloud")
    status = Column(String, default="learning")
    confidence = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reviews = relationship(
        "ReviewLog",
        back_populates="word",
        cascade="all, delete-orphan"
    )


class ReviewLog(Base):
    __tablename__ = "review_logs"

    id = Column(Integer, primary_key=True, index=True)
    word_id = Column(Integer, ForeignKey("vocabulary_words.id"), nullable=False)
    question = Column(Text, nullable=True)
    user_answer = Column(Text, nullable=True)
    correct_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, default=False)
    ai_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    word = relationship("VocabularyWord", back_populates="reviews")