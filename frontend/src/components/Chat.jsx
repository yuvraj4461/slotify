import React, { useState } from 'react';
import { requestToken } from '../api.js';

export default function Chat({ setToken }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function handleSend() {
    if (!message.trim() || !name.trim() || !phone.trim()) return alert('Enter name, phone and symptom.');
    const entry = { from: 'user', text: message };
    setHistory((h) => [...h, entry]);
    setLoading(true);
    try {
      // For MVP we call backend token endpoint which runs triage rules
      const payload = { name, phone, symptoms: message };
      const tokenObj = await requestToken(payload);
      setToken(tokenObj);
      setHistory((h) => [...h, { from: 'system', text: 'Token issued.' }]);
    } catch (e) {
      alert('Failed to request token.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex gap-2 mb-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="flex-1 p-2 border rounded" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-36 p-2 border rounded" />
      </div>

      <div className="h-40 overflow-auto border p-2 rounded mb-3 bg-gray-50">
        {history.length === 0 ? <div className="text-sm text-gray-500">Type symptoms and press Send.</div> : history.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded ${m.from === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your symptoms (e.g., fever, cough)" className="flex-1 p-2 border rounded" />
        <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Please wait...' : 'Send'}</button>
      </div>
    </div>
  );
}
