// Simple helper for backend calls
const BASE = 'http://localhost:5001/api';

export async function startDocV(mobileNumber) {
  const res = await fetch(`${BASE}/start-docv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber })
  });
  return await res.json();
}

export async function fetchDocVResult(docvTransactionToken) {
  const res = await fetch(`${BASE}/docv-result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docvTransactionToken })
  });
  return await res.json();
}
