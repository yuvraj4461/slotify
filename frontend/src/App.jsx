import React, { useState } from 'react';
import Chat from './components/Chat.jsx';
import TokenCard from './components/TokenCard.jsx';
import UploadReport from './components/UploadReport.jsx';
import SymptomChips from './components/SymptomChips.jsx';

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Slotify</h1>
      {!token ? (
        <div className="max-w-xl mx-auto space-y-4">
          <Chat setToken={setToken} />
          <UploadReport />
          <SymptomChips />
        </div>
      ) : (
        <TokenCard token={token} />
      )}
    </div>
  );
}
