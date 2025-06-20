import React, { useEffect, useRef, useState } from "react";
import { fetchDocVResult } from "./api";

const SDK_KEY = "sdk_key"; // Replace with your Socure SDK Key

export default function DocVPage({ docvToken, onBack }) {
  const [showSDK, setShowSDK] = useState(true);
  const [result, setResult] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const websdkRef = useRef();

  // --- Reset SDK on unmount ---
  useEffect(() => {
    return () => {
      // Try both SocureDocVSDK.reset() and Socure.resetSdk() for coverage
      if (window.SocureDocVSDK && window.SocureDocVSDK.reset) {
        window.SocureDocVSDK.reset();
        console.log("SocureDocVSDK.reset() has been called");
      } else if (window.Socure && window.Socure.resetSdk) {
        window.Socure.resetSdk();
        console.log("Socure.resetSdk() has been called");
      }
    };
  }, []);

  function handleStart() {
    setError('');
    if (!window.SocureDocVSDK) {
      setError("Socure SDK failed to load.");
      return;
    }
    window.SocureDocVSDK.launch(
      SDK_KEY,
      docvToken,
      "#websdk",
      {
        onProgress: (event) => {
          console.log("onProgress event:", event);
        },
        onSuccess: async function (response) {
          console.log("onSuccess response:", response);
          setShowSDK(false);
          setFetching(true);
          try {
            const data = await fetchDocVResult(docvToken);
            setResult(data);
          } catch (e) {
            setError("Failed to fetch DocV result: " + e.message);
          } finally {
            setFetching(false);
          }
        },
        onError: function (error) {
          console.log("onError:", error);
          setError('Verification failed: ' + JSON.stringify(error));
        },
        qrCodeNeeded: false,
        disableSmsInput: false
      }
    );
  }

  function handleBack() {
    // Reset SDK before navigating back
    if (window.SocureDocVSDK && window.SocureDocVSDK.reset) {
      window.SocureDocVSDK.reset();
      console.log("SocureDocVSDK.reset() has been called");
    } else if (window.Socure && window.Socure.resetSdk) {
      window.Socure.resetSdk();
      console.log("Socure.resetSdk() has been called");
    }
    onBack();
  }

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-4" onClick={handleBack}>← Back</button>
      <h2 className="mb-4">Document Verification</h2>
      {showSDK &&
        <div>
          <button className="btn btn-primary mb-3" onClick={handleStart}>
            Start Verification
          </button>
          <div id="websdk" ref={websdkRef}></div>
        </div>
      }
      {fetching && <div>Fetching results...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {result &&
        <div className="mt-4">
          <h5>Verification Result</h5>
          <pre className="bg-light p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
      }
    </div>
  );
}
