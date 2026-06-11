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

const API_URL = "http://localhost:8000";

export default function AIAssistantPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<number>(1);
  const [wordInput, setWordInput] = useState("Kubernetes");
  const [message, setMessage] = useState("What should I review next?");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadWords() {
    try {
      setError("");
      const res = await fetch(`${API_URL}/words`);
      if (!res.ok) throw new Error("Failed to load words");

      const data = await res.json();
      setWords(data);

      if (data.length > 0) {
        setSelectedWordId(data[0].id);
        setWordInput(data[0].word);
      }
    } catch {
      setError("Could not load saved vocabulary words.");
    }
  }

  useEffect(() => {
    loadWords();
  }, []);

  async function explainWord() {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await fetch(`${API_URL}/ai/explain-word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: wordInput }),
      });

      if (!res.ok) throw new Error("AI explanation failed");

      const data = await res.json();
      setResult(data.explanation);
    } catch {
      setError("Could not generate AI explanation.");
    } finally {
      setLoading(false);
    }
  }

  async function generateQuiz() {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await fetch(`${API_URL}/ai/generate-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word_id: selectedWordId }),
      });

      if (!res.ok) throw new Error("Quiz generation failed");

      const data = await res.json();
      setResult(data.quiz);
    } catch {
      setError("Could not generate quiz from saved vocabulary data.");
    } finally {
      setLoading(false);
    }
  }

  async function recommendReview() {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await fetch(`${API_URL}/ai/recommend-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Review recommendation failed");

      const data = await res.json();
      setResult(data.recommendation);
    } catch {
      setError("Could not generate review recommendation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">AI Cloud Vocabulary Assistant</h1>
            <p className="text-sm text-slate-400">
              Use Claude AI with your saved vocabulary data.
            </p>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-cyan-300">
              Home
            </Link>
            <Link href="/words" className="hover:text-cyan-300">
              Words
            </Link>
            <Link href="/review" className="hover:text-cyan-300">
              Review
            </Link>
            <Link href="/ai-assistant" className="text-cyan-300">
              AI Assistant
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-4xl font-bold">🤖 AI Assistant</h2>
        <p className="mt-3 text-slate-300">
          Generate explanations, quizzes, and review recommendations using Claude AI.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-cyan-300">
              Explain a Word
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Enter any cloud vocabulary word and get a study note.
            </p>

            <input
              className="mt-4 w-full rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              placeholder="Kubernetes"
            />

            <button
              onClick={explainWord}
              className="mt-4 w-full rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Explain Word
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-purple-300">
              Generate Quiz
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Use a saved database word to generate a quiz.
            </p>

            <select
              className="mt-4 w-full rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
              value={selectedWordId}
              onChange={(e) => setSelectedWordId(Number(e.target.value))}
            >
              {words.map((word) => (
                <option key={word.id} value={word.id}>
                  {word.word}
                </option>
              ))}
            </select>

            <button
              onClick={generateQuiz}
              className="mt-4 w-full rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Generate Quiz
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-emerald-300">
              Recommend Review
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Ask AI what you should review next based on your saved data.
            </p>

            <textarea
              className="mt-4 min-h-24 w-full rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={recommendReview}
              className="mt-4 w-full rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Recommend Review
            </button>
          </div>
        </div>

        {loading && (
          <p className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-4 text-slate-300">
            AI is thinking...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg border border-red-800 bg-red-950 p-4 text-red-200">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-cyan-300">AI Result</h3>
            <pre className="mt-4 whitespace-pre-wrap text-slate-200">
              {result}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}