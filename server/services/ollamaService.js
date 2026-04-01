const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api/generate";

async function askQwen(prompt, systemPrompt = "", stream = false) {
  try {
    const response = await axios({
      method: "post",
      url: OLLAMA_URL,
      headers: { "Content-Type": "application/json" },
      data: {
        model: "qwen2.5",
        system: systemPrompt,
        prompt: prompt,
        stream: stream,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1024
        }
      },
      responseType: stream ? 'stream' : 'json'
    });

    if (stream) return response.data;

    return response.data.response;
  } catch (error) {
    console.error("Ollama Error:", error.message);
    throw new Error("AI Service Unavailable");
  }
}

// For JSON-structured responses:
async function askQwenJSON(prompt, systemPrompt) {
  const raw = await askQwen(
    prompt + "\n\nRespond ONLY with valid JSON. No explanation, no markdown backticks.",
    systemPrompt
  );
  try {
    // Basic cleaning in case the model adds noise
    const cleaned = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON Parse Error:", error.message, "Raw:", raw);
    throw new Error("AI response was not valid JSON");
  }
}

module.exports = { askQwen, askQwenJSON };
