import React from "react";

export default function AdviceCard({ advice }) {
  if (!advice) return null;
  // advice expected to be an object: {summary, possible_concerns, advice, confidence}
  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">AI Report Analysis</h3>
      <p className="mt-2 text-gray-700"><strong>Summary:</strong> {advice.summary}</p>
      <p className="mt-2"><strong>Concerns:</strong> {advice.possible_concerns}</p>
      <p className="mt-2 text-blue-600"><strong>Advice:</strong> {advice.advice}</p>
      <p className="mt-2 text-sm text-gray-500">Confidence: {(advice.confidence ?? 0).toFixed(2)}</p>
    </div>
  );
}
