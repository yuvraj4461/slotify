import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://your-backend-url"; // update in .env

export default function TokenForm({ onResult }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    if (!name || !phone) return alert("Please enter name and phone");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("symptoms", symptoms);
      const res = await axios.post(`${API_BASE}/api/v1/token/request`, form);
      onResult && onResult(res.data);
      setName(""); setPhone(""); setSymptoms("");
    } catch (err) {
      console.error(err);
      alert("Failed to request token");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow-md max-w-xl mx-auto">
      <div className="flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
               className="flex-1 border rounded p-2" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone"
               className="w-40 border rounded p-2" />
      </div>

      <textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)}
                placeholder="Describe symptoms (fever, cough, chest pain...)"
                className="w-full mt-3 border rounded p-2 min-h-[80px]" />

      <div className="mt-3 flex items-center gap-3">
        <button type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
        <small className="text-gray-500">We will analyze symptoms and return a priority</small>
      </div>
    </form>
  );
}
