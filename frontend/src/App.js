import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [gptCode, setGptCode] = useState("");

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = () => {
    console.log("User Prompt:", prompt);
    setLoading(true);
    setShowChart(false); // Hide chart while "loading"

    // Simulate backend work
    setTimeout(() => {
      setLoading(false);
      setShowChart(true);
      setGptCode(`# Simulated GPT Python code
plt.figure(figsize=(10, 6))
plt.scatter(df['AVG'], df['OPS'])
plt.title('Cubs AVG vs OPS')
plt.xlabel('Batting Average')
plt.ylabel('On-base Plus Slugging')
plt.savefig('static/plot.png')
plt.close()
      `);
    }, 1000);
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

      {/* Placeholder chart */}
      {showChart && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Chart:</h3>
          <img
            src="https://reactjs.org/logo-og.png" // temporary placeholder
            alt="Placeholder Chart"
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
