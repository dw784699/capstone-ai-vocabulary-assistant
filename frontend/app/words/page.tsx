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

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    word: "",
    definition: "",
    chinese_meaning: "",
    example_sentence: "",
    category: "cloud",
    status: "learning",
    confidence: 1,
  });

  async function loadWords() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/words`);
      if (!res.ok) throw new Error("Failed to load words");
      const data = await res.json();
      setWords(data);
    } catch {
      setError("Could not load vocabulary words.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWords();
  }, []);

  async function addWord(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      const res = await fetch(`${API_URL}/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add word");

      setForm({
        word: "",
        definition: "",
        chinese_meaning: "",
        example_sentence: "",
        category: "cloud",
        status: "learning",
        confidence: 1,
      });

      loadWords();
    } catch {
      setError("Could not add the word.");
    }
  }

  async function deleteWord(id: number) {
    try {
      setError("");
      const res = await fetch(`${API_URL}/words/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete word");
      loadWords();
    } catch {
      setError("Could not delete the word.");
    }
  }

  async function markMastered(word: Word) {
    try {
      setError("");
      const res = await fetch(`${API_URL}/words/${word.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "mastered",
          confidence: 5,
        }),
      });

      if (!res.ok) throw new Error("Failed to update word");
      loadWords();
    } catch {
      setError("Could not update the word.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">AI Cloud Vocabulary Assistant</h1>
            <p className="text-sm text-slate-400">Manage your vocabulary data.</p>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-cyan-300">Home</Link>
            <Link href="/words" className="text-cyan-300">Words</Link>
            <Link href="/review" className="hover:text-cyan-300">Review</Link>
            <Link href="/ai-assistant" className="hover:text-cyan-300">AI Assistant</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-4xl font-bold">📚 Vocabulary Manager</h2>
        <p className="mt-3 text-slate-300">
          Add, view, update, and delete cloud computing vocabulary words.
        </p>

        <form
          onSubmit={addWord}
          className="mt-8 grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2"
        >
          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            placeholder="Word"
            value={form.word}
            onChange={(e) => setForm({ ...form, word: e.target.value })}
            required
          />

          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
            placeholder="Chinese meaning"
            value={form.chinese_meaning}
            onChange={(e) =>
              setForm({ ...form, chinese_meaning: e.target.value })
            }
            required
          />

          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white outline-none md:col-span-2"
            placeholder="Definition"
            value={form.definition}
            onChange={(e) => setForm({ ...form, definition: e.target.value })}
            required
          />

          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white outline-none md:col-span-2"
            placeholder="Example sentence"
            value={form.example_sentence}
            onChange={(e) =>
              setForm({ ...form, example_sentence: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-2"
          >
            Add Vocabulary Word
          </button>
        </form>

        {loading && <p className="mt-6 text-slate-300">Loading words...</p>}
        {error && <p className="mt-6 text-red-300">{error}</p>}

        <div className="mt-8 grid gap-4">
          {words.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-300">
                    {item.word}
                  </h3>
                  <p className="mt-2 text-slate-300">{item.definition}</p>
                  <p className="mt-2 text-purple-300">
                    中文：{item.chinese_meaning}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Example: {item.example_sentence}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Status: {item.status} | Confidence: {item.confidence}/5
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => markMastered(item)}
                    className="h-10 rounded-lg border border-emerald-400 px-4 text-sm text-emerald-300 hover:bg-emerald-950"
                  >
                    Mark Mastered
                  </button>

                  <button
                    onClick={() => deleteWord(item.id)}
                    className="h-10 rounded-lg border border-red-400 px-4 text-sm text-red-300 hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}