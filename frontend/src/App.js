import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import DocVPage from "./DocVPage";

function App() {
  // We keep docvToken in sessionStorage so the page can reload and keep it
  const [docvToken, setDocvToken] = useState(
    () => window.sessionStorage.getItem("docvToken") || null
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/landingpage"
          element={<LandingPageWithNav setDocvToken={setDocvToken} />}
        />
        <Route
          path="/docvpage"
          element={<DocVPageWithNav docvToken={docvToken} setDocvToken={setDocvToken} />}
        />
        <Route
          path="*"
          element={<RedirectToLanding />}
        />
      </Routes>
    </Router>
  );
}

// Wrapper to handle navigation after starting
function LandingPageWithNav({ setDocvToken }) {
  const navigate = useNavigate();
  return (
    <LandingPage
      onStart={token => {
        setDocvToken(token);
        window.sessionStorage.setItem("docvToken", token);
        navigate("/docvpage");
      }}
    />
  );
}

function DocVPageWithNav({ docvToken, setDocvToken }) {
  const navigate = useNavigate();
  // If user tries to access docvpage without a token, redirect them
  if (!docvToken) {
    navigate("/landingpage");
    return null;
  }
  return (
    <DocVPage
      docvToken={docvToken}
      onBack={() => {
        setDocvToken(null);
        window.sessionStorage.removeItem("docvToken");
        navigate("/landingpage");
      }}
    />
  );
}

// For any other route, go to landing page
function RedirectToLanding() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/landingpage", { replace: true });
  }, [navigate]);
  return null;
}

export default App;
