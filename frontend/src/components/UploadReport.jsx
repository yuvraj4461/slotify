import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://slotify-tokenizer.onrender.com";

export default function UploadReport({ onAdvice }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");

  async function upload() {
    if (!file) return alert("Choose a file first");
    setLoading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/report/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100));
        },
      });
      const data = res.data;
      // show OCR text if returned
      setOcrText(data.ocr_text || "");
      if (data.ai_advice) onAdvice && onAdvice(data.ai_advice);
      alert("Upload complete");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-xl mx-auto mt-6">
      <div className="flex items-center gap-3">
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <button onClick={upload} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
                disabled={!file || loading}>
          {loading ? `Uploading (${progress}%)` : "Upload"}
        </button>
      </div>

      {progress>0 && (
        <div className="mt-3 w-full bg-gray-100 h-2 rounded">
          <div className="h-2 bg-indigo-500 rounded" style={{width: `${progress}%`}} />
        </div>
      )}

      {ocrText && (
        <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
          <strong>Extracted text (OCR):</strong>
          <pre className="whitespace-pre-wrap mt-2 text-xs">{ocrText}</pre>
        </div>
      )}
    </div>
  );
}
