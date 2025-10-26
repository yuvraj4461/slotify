import React from 'react';

export default function TokenCard({ token }) {
  if (!token) return null;
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-2">Your Slotify Token</h2>
      <div className="text-6xl font-extrabold text-blue-600 mb-2">{token.token_number}</div>
      <div className="mb-3">Status: <span className="font-semibold">{token.status}</span></div>
      <div className="mb-4">Estimated wait: <strong>{token.estimated_wait || 'Calculating...'}</strong></div>
      {token.qr_code && <img src={token.qr_code} alt="QR code" className="mx-auto w-40 h-40 mb-4" />}
      <div className="text-sm text-gray-600">Show this at reception. You will be notified if your position changes.</div>
    </div>
  );
}
