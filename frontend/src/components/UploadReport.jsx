import React, { useState } from "react";
import { uploadReportFile } from "../api";
import AdviceCard from "./AdviceCard";

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const data = await uploadReportFile(file);
      // data.ai_advice is what backend returns
      setAiAdvice(data.ai_advice ?? null);
      // optionally show OCR preview
      // setOcrText(data.ocr_text)
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0])} />
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="mt-6">
        <AdviceCard advice={aiAdvice} />
      </div>
    </div>
  );
}
