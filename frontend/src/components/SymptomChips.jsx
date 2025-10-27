import React from "react";

export default function SymptomChips({ onPick }) {
  const quick = ["fever","cough","chest pain","headache","breathing difficulty","stomach pain","bleeding"];
  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-3 rounded shadow">
      <div className="text-sm text-gray-600 mb-2">Quick symptoms (click to add):</div>
      <div className="flex flex-wrap gap-2">
        {quick.map(s => (
          <button key={s} onClick={()=>onPick && onPick(s)}
                  className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

