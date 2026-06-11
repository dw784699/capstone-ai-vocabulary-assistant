"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Word = {
  id: number;
  word: string;
  definition: string;
  chinese_meaning: string;
  example_sentence: string;
  category: string;
  status: string;
  confidence: number;
};

type Review = {
  id: number;
  word_id: number;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  ai_feedback: string;
};

const API_URL = "http://localhost:8000";

export default function ReviewPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    question: "What does this cloud vocabulary word mean?",
    user_answer: "",
    correct_answer: "",
    is_correct: true,
    ai_feedback: "",
  });

  async function loadWords() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/words`);
      if (!res.ok) throw new Error("Failed to load words");
      const data = await res.json();
      setWords(data);

      if (data.length > 0) {
        setSelectedWordId(data[0].id);
        loadReviews(data[0].id);
      }
    } catch {
      setError("Could not load words.");
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews(wordId: number) {
    try {
      setError("");
      const res = await fetch(`${API_URL}/words/${wordId}/reviews`);
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(data);
    } catch {
      setError("Could not load review logs.");
    }
  }

  useEffect(() => {
    loadWords();
  }, []);

  async function addReview(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");

      const res = await fetch(`${API_URL}/words/${selectedWordId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add review");

      setForm({
        question: "What does this cloud vocabulary word mean?",
        user_answer: "",
        correct_answer: "",
        is_correct: true,
        ai_feedback: "",
      });

      loadReviews(selectedWordId);
    } catch {
      setError("Could not save review log.");
    }
  }

  function handleWordChange(value: string) {
    const wordId = Number(value);
    setSelectedWordId(wordId);
    loadReviews(wordId);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">AI Cloud Vocabulary Assistant</h1>
            <p className="text-sm text-slate-400">
              Track your vocabulary review history.
            </p>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-cyan-300">
              Home
            </Link>
            <Link href="/words" className="hover:text-cyan-300">
              Words
            </Link>
            <Link href="/review" className="text-cyan-300">
              Review
            </Link>
            <Link href="/ai-assistant" className="hover:text-cyan-300">
              AI Assistant
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-4xl font-bold">📝 Review Practice</h2>
        <p className="mt-3 text-slate-300">
          Save review answers and track whether you understand each word.
        </p>

        {loading && <p className="mt-6 text-slate-300">Loading...</p>}
        {error && <p className="mt-6 text-red-300">{error}</p>}

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <label className="text-sm text-slate-300">Choose a word</label>
          <select
            className="mt-2 w-full rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            value={selectedWordId}
            onChange={(e) => handleWordChange(e.target.value)}
          >
            {words.map((word) => (
              <option key={word.id} value={word.id}>
                {word.word}
              </option>
            ))}
          </select>
        </div>

        <form
          onSubmit={addReview}
          className="mt-6 grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />

          <textarea
            className="min-h-24 rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            placeholder="Your answer"
            value={form.user_answer}
            onChange={(e) => setForm({ ...form, user_answer: e.target.value })}
            required
          />

          <textarea
            className="min-h-24 rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            placeholder="Correct answer"
            value={form.correct_answer}
            onChange={(e) =>
              setForm({ ...form, correct_answer: e.target.value })
            }
            required
          />

          <textarea
            className="min-h-24 rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            placeholder="AI feedback or teacher feedback"
            value={form.ai_feedback}
            onChange={(e) => setForm({ ...form, ai_feedback: e.target.value })}
          />

          <label className="flex items-center gap-3 text-slate-300">
            <input
              type="checkbox"
              checked={form.is_correct}
              onChange={(e) =>
                setForm({ ...form, is_correct: e.target.checked })
              }
            />
            My answer was correct
          </label>

          <button
            type="submit"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Save Review Log
          </button>
        </form>

        <div className="mt-8 grid gap-4">
          <h3 className="text-2xl font-bold">Review History</h3>

          {reviews.length === 0 && (
            <p className="text-slate-400">No review logs yet.</p>
          )}

          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="font-semibold text-cyan-300">
                Question: {review.question}
              </p>
              <p className="mt-2 text-slate-300">
                Your answer: {review.user_answer}
              </p>
              <p className="mt-2 text-slate-300">
                Correct answer: {review.correct_answer}
              </p>
              <p className="mt-2 text-sm">
                Result:{" "}
                <span
                  className={
                    review.is_correct ? "text-emerald-300" : "text-red-300"
                  }
                >
                  {review.is_correct ? "Correct" : "Needs more practice"}
                </span>
              </p>
              <p className="mt-2 text-purple-300">
                Feedback: {review.ai_feedback}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}