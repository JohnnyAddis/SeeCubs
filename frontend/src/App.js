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
  const [isDarkMode, setIsDarkMode] = useState(true); // For syntax highlighting theme

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowChart(false);
    setGptCode("");
    setImageUrl("");
    setError("");
    setShowGptCode(false); // Collapse GPT panel on new request

    try {
      const data = await generatePlot(prompt);
      setGptCode(data.code_used);
      // Add timestamp to force image refresh
      setImageUrl(`http://localhost:5000${data.image_url}?t=${new Date().getTime()}`);
      setShowChart(true);
    } catch (err) {
      setError(err.message);
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
          {/* Download Button */}
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

          {/* Theme Toggle */}
          {showGptCode && (
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
          )}

          {showGptCode && (
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
          )}
        </div>
      )}
    </div>
  );
}

export default App;
