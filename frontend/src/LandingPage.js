import React, { useState } from "react";
import { startDocV } from "./api";

export default function LandingPage({ onStart }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await startDocV(mobile);
      if (resp?.data?.docvTransactionToken) {
        onStart(resp.data.docvTransactionToken);
      } else {
        setError('Failed to start DocV process.');
      }
    } catch (e) {
      setError('API error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-5 rounded shadow bg-white">
        <h2>Click here to begin the DocV process</h2>
        <input
          className="form-control my-3"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />
        <button className="btn btn-primary w-100"
          onClick={handleClick}
          disabled={loading}>
          {loading ? "Starting..." : "Begin"}
        </button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}
