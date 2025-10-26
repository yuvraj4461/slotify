import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://your-backend-url/api/v1";

export async function uploadReportFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post(`${API_BASE}/report/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // expect { file, ocr_text, report_id, ai_advice }
}