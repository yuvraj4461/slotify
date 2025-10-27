import React, { useState } from "react";
import TokenForm from "./components/TokenForm";     // your form
import UploadReport from "./components/UploadReport"; // your upload component
import AIAdviceCard from "./components/AIAdviceCard";

export default function App() {
  const [aiAdvice, setAiAdvice] = useState(null);
  const [tokenResult, setTokenResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <h1 className="text-center text-4xl font-bold text-indigo-600 mb-6">Slotify</h1>

      <TokenForm onResult={(r) => setTokenResult(r)} />
      {tokenResult && (
        <div className="max-w-3xl mx-auto mt-4 p-3 bg-white rounded shadow">
          <strong>Token result:</strong>
          <pre className="mt-2 text-sm text-gray-700">{JSON.stringify(tokenResult, null, 2)}</pre>
        </div>
      )}

      {/* UploadReport should call onAdvice when backend returns AI advice */}
      <UploadReport onAdvice={(a) => setAiAdvice(a)} />

      {/* AI advice card */}
      <AIAdviceCard advice={aiAdvice} />
    </div>
  );
}
