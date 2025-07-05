import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = () => {
    console.log("User Prompt:", prompt);
    setLoading(true); // start loading

    // Simulate work (e.g., future API call)
    setTimeout(() => {
      setLoading(false); // stop loading after 1 second
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
        disabled={loading} // disable button while loading
      >
        {loading ? "Loading..." : "Generate Visualization"}
      </button>
    </div>
  );
}

export default App;
