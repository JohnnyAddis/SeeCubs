export async function generatePlot(prompt) {
  const response = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  return response.json();
}