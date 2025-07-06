import React, { useState } from "react";
import { generatePlot } from "./api";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism"; // Light theme

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [gptCode, setGptCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [showGptCode, setShowGptCode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [refinementPrompt, setRefinementPrompt] = useState("");

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowChart(false);
    setGptCode("");
    setImageUrl("");
    setError("");
    setShowGptCode(false);
    setRefinementPrompt("");

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (response.ok) {
        setGptCode(data.code_used);
        setImageUrl(`http://localhost:5000${data.image_url}?t=${new Date().getTime()}`);
        setShowChart(true);
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefineSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          last_code: gptCode,
          refinement: refinementPrompt,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setGptCode(data.code_used);
        setImageUrl(`http://localhost:5000${data.image_url}?t=${new Date().getTime()}`);
        setRefinementPrompt(""); // Clear refinement input
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setShowChart(false);
    setGptCode("");
    setImageUrl("");
    setError("");
    setShowGptCode(false);
    setRefinementPrompt("");
  };

  const handleDownloadChart = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "cubs_chart.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Cubs Data Visualizer</h1>
      <p>Enter a prompt to generate a Cubs chart:</p>
      <input
        type="text"
        placeholder="e.g., Plot AVG vs OPS"
        value={prompt}
        onChange={handleInputChange}
        style={{ padding: "8px", width: "300px" }}
      />
      <br />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "10px", padding: "8px 16px" }}
      >
        {loading ? "Loading..." : "Generate Visualization"}
      </button>
      {" "}
      <button
        type="button"
        onClick={handleReset}
        disabled={loading}
        style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#ddd" }}
      >
        Reset
      </button>

      {/* Error Message */}
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Render Chart */}
      {showChart && imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Chart:</h3>
          <img
            src={imageUrl}
            alt="Cubs Chart"
            style={{ maxWidth: "80%", border: "1px solid #ccc" }}
          />
          <br />
          {/* Download Chart Button */}
          <button
            type="button"
            onClick={handleDownloadChart}
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              borderRadius: "5px",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Download Chart
          </button>

          {/* Refinement Input Box */}
          <div style={{ marginTop: "15px" }}>
            <input
              type="text"
              placeholder="e.g., Rotate x-axis labels 45 degrees"
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              style={{ padding: "8px", width: "300px" }}
            />
            <br />
            <button
              type="button"
              onClick={handleRefineSubmit}
              disabled={loading || refinementPrompt.trim() === ""}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#f57c00",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Refining..." : "Submit Refinement"}
            </button>
          </div>
        </div>
      )}

      {/* Collapsible GPT Code */}
      {gptCode && (
        <div style={{ marginTop: "20px", width: "80%", margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => setShowGptCode(!showGptCode)}
            style={{
              padding: "6px 12px",
              marginBottom: "10px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {showGptCode ? "Hide GPT Code" : "Show GPT Code"}
          </button>

          {showGptCode && (
            <>
              {/* Theme Toggle */}
              <div style={{ marginBottom: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#eee",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </div>

              {/* Syntax Highlighted GPT Code */}
              <SyntaxHighlighter
                language="python"
                style={isDarkMode ? vscDarkPlus : prism}
                customStyle={{
                  borderRadius: "5px",
                  fontSize: "14px",
                  padding: "10px",
                  overflowX: "auto",
                }}
              >
                {gptCode.trim()}
              </SyntaxHighlighter>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
