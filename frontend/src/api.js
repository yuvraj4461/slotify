import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

export async function requestToken(payload) {
  // payload: { name, phone, symptoms, reports }
  try {
    const res = await axios.post(`${API_BASE}/token/request`, payload);
    return res.data;
  } catch (e) {
    console.error('API error', e);
    throw e;
  }
}

export async function uploadReport(file) {
  const form = new FormData();
  form.append('file', file);
  try {
    const res = await axios.post(`${API_BASE}/report/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (e) {
    console.error('Upload error', e);
    throw e;
  }
}
