import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());


// Replace with your real API key(s) and endpoint(s)
const DOCV_API_KEY = "api_key";
const DOCV_REQUEST_URL = "https://service.socure.com/api/5.0/documents/request";
const EMAILAUTH_URL = "https://sandbox.socure.com/api/3.0/EmailAuthScore";

// 1. Initiate DocV
app.post('/api/start-docv', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const body = {
      config: {
        sendMessage: true,
        language: "en",
        documentType: "license",
        useCaseKey: "noselfie"
      },
      mobileNumber
    };
    const resp = await fetch(DOCV_REQUEST_URL, {
      method: 'POST',
      headers: {
        'Authorization': `SocureApiKey ${DOCV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Get DocV Verification Result
app.post('/api/docv-result', async (req, res) => {
  try {
    const { docvTransactionToken } = req.body;
    const body = {
      modules: ["documentverification"],
      docvTransactionToken
    };
    const resp = await fetch(EMAILAUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `SocureApiKey ${DOCV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
