const API_URL = "http://localhost:5000";

export async function generatePlot(prompt) {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error generating plot");
    }

    return await response.json();
  } catch (err) {
    console.error("API call failed:", err);
    throw err;
  }
}
