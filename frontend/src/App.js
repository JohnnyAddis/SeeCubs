import React, { useState } from "react";
import { generatePlot } from "./api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [gptCode, setGptCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("User Prompt:", prompt);
    setLoading(true);
    setShowChart(false);
    setError("");
    setGptCode("");
    setImageUrl("");

    try {
      const data = await generatePlot(prompt);
      console.log("Flask Response:", data);

      setGptCode(data.code_used);
      setImageUrl(`http://localhost:5000${data.image_url}`);
      setShowChart(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        onClick={handleSubmit}
        style={{ marginTop: "10px", padding: "8px 16px" }}
        disabled={loading}
      >
        {loading ? "Loading..." : "Generate Visualization"}
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

      {/* GPT Code Debug Panel */}
      {gptCode && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto",
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
  );
}

export default App;
