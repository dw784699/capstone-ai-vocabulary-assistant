import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">AI Cloud Vocabulary Assistant</h1>
            <p className="text-sm text-slate-400">
              Learn cloud computing English with AI.
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
            <Link href="/ai-assistant" className="hover:text-cyan-300">
              AI Assistant
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Capstone Project
        </p>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight">
          Build your cloud vocabulary with AI-powered review.
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          This app helps students save cloud computing vocabulary, review their
          answers, and use Claude AI to generate explanations, quizzes, and
          personalized review recommendations based on their saved vocabulary data.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/words"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Manage Vocabulary
          </Link>

          <Link
            href="/ai-assistant"
            className="rounded-lg border border-slate-600 px-5 py-3 font-semibold hover:bg-slate-800"
          >
            Try AI Assistant
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-cyan-300">
              📚 Vocabulary CRUD
            </h3>
            <p className="mt-3 text-slate-300">
              Add, view, update, and delete cloud vocabulary words.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-purple-300">
              📝 Review Logs
            </h3>
            <p className="mt-3 text-slate-300">
              Track practice answers, correctness, confidence, and review history.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-emerald-300">
              🤖 Claude AI
            </h3>
            <p className="mt-3 text-slate-300">
              Generate explanations, quizzes, and personalized review suggestions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}