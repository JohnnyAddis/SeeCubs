import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");

  const handleInputChange = (event) => {
    setPrompt(event.target.value); // update state as user types
  };

  const handleSubmit = () => {
    console.log("User Prompt:", prompt); // log prompt on button click
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>SeeCubs</h1>
      <p>Enter a prompt to generate a Cubs data visualization:</p>
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
      >
        Generate Visualization
      </button>
    </div>
  );
}

export default App;
