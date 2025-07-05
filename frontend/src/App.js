import React, { useState } from "react";
import { generatePlot } from "./api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [gptCode, setGptCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [showGptCode, setShowGptCode] = useState(false); // 🆕 Collapsible state

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowChart(false);
    setError("");
    setGptCode("");
    setImageUrl("");
    setShowGptCode(false); // Collapse GPT code on new request

    try {
      const data = await generatePlot(prompt);
      setGptCode(data.code_used);
      setImageUrl(`http://localhost:5000${data.image_url}`);
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
            <div
              style={{
                background: "#f5f5f5",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              <h3>GPT Generated Code:</h3>
              <pre>{gptCode}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
