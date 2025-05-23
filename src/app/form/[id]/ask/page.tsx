"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function AskPage() {
  const { id } = useParams() as { id: string };
  // If you'd like, you can do a safer check or define your own type

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);

    const res = await fetch(`/api/ai/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ask AI about Form Responses</h1>

      <input
        className="w-full p-2 border rounded"
        placeholder="E.g. What is the most common answer?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={askAI}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold">AI Response:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
