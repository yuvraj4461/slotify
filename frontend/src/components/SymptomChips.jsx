import React from 'react';

const CHIPS = ['fever', 'cough', 'chest pain', 'headache', 'breathing difficulty', 'stomach pain', 'bleeding'];

export default function SymptomChips() {
  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="text-sm text-gray-600 mb-2">Quick symptoms (tap to copy into chat):</div>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button key={c} className="px-3 py-1 rounded-full border text-sm" onClick={() => navigator.clipboard.writeText(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}
