import React from "react";

/**
 * Expect advice to be an object:
 * { summary, possible_concerns, advice, confidence }
 */
export default function AIAdviceCard({ advice }) {
  if (!advice) return null;

  // soft, urgent color mapping by confidence or content (example)
  const conf = Number(advice.confidence ?? 0);
  const tone = conf >= 0.8 ? "border-red-400 bg-red-50" : conf >= 0.5 ? "border-yellow-300 bg-yellow-50" : "border-blue-200 bg-blue-50";
  const severityLabel = conf >= 0.8 ? "High concern" : conf >= 0.5 ? "Moderate concern" : "Low concern";

  return (
    <div className={`max-w-3xl mx-auto mt-6 p-4 rounded-2xl shadow-lg border ${tone}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">AI triage advice</h3>
              <p className="text-sm text-gray-500 mt-1">Summary — {advice.summary}</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">{severityLabel}</div>
              <div className="text-xs text-gray-400">confidence: {(conf*100).toFixed(0)}%</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border">
              <div className="text-xs text-gray-500">Concerns</div>
              <div className="mt-1 text-sm text-gray-700">{advice.possible_concerns || "None detected"}</div>
            </div>

            <div className="p-3 bg-white rounded-lg border flex flex-col">
              <div className="text-xs text-gray-500">Advice</div>
              <div className="mt-1 text-sm text-gray-700">{advice.advice}</div>
              <div className="mt-3 flex gap-2">
                <button
                  className="ml-auto inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:opacity-90"
                  onClick={() => {
                    // copy advice to clipboard
                    navigator.clipboard?.writeText(advice.advice || "");
                    alert("Advice copied to clipboard");
                  }}
                >
                  Copy advice
                </button>
                <button
                  className="inline-flex items-center gap-2 px-3 py-1 rounded border text-sm hover:bg-gray-50"
                  onClick={() => window.open("https://www.who.int", "_blank")}
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Note: This is AI assistance — always validate clinically.
          </div>
        </div>
      </div>
    </div>
  );
}
