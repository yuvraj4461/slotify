import React, { useState } from 'react';
import { uploadReport } from '../api.js';

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');

  async function handleUpload() {
    if (!file) return alert('Choose a file first');
    setStatus('Uploading...');
    try {
      const res = await uploadReport(file);
      setPreview(res); // expects { ocr_text, extracted_fields }
      setStatus('Uploaded — preview below.');
    } catch (e) {
      setStatus('Upload failed');
    }
  }

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="flex items-center gap-2 mb-3">
        <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} className="px-3 py-1 bg-indigo-600 text-white rounded">Upload</button>
      </div>
      <div className="text-sm text-gray-500 mb-2">{status}</div>
      {preview && (
        <div className="bg-gray-50 p-2 rounded text-sm">
          <div className="font-semibold">OCR Preview</div>
          <pre className="whitespace-pre-wrap">{preview.ocr_text}</pre>
        </div>
      )}
    </div>
  );
}
