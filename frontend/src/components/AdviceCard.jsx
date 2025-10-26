// AdviceCard.jsx
import React from "react";

export default function AdviceCard({ advice }) {
  if (!advice) return null;

  // advice may be None, dict or raw string
  const content =
    typeof advice === "string" || advice?.raw ? (
      <pre className="whitespace-pre-wrap text-sm">{advice.raw || advice}</pre>
    ) : (
      <>
        <p className="text-lg font-semibold">{advice.summary || "No summary"}</p>
        <p className="text-sm mt-2"><strong>Concerns:</strong> {advice.possible_concerns || "None"}</p>
        <p className="text-sm mt-2"><strong>Advice:</strong> {advice.advice || "No advice"}</p>
        <p className="text-xs mt-2 text-gray-500">Confidence: {advice.confidence ?? "—"}</p>
      </>
    );

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-sm text-indigo-600 mb-2">AI Report Advice</h3>
      {content}
    </div>
  );
}
