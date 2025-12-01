// -----------------------------------------------------
// GeminiService – Browser version
// -----------------------------------------------------
// This version replaces all TypeScript + module imports.
// It works directly in GitHub Pages using fetch().
// -----------------------------------------------------

// IMPORTANT: Insert your API key here:
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";   // <-- CHANGE THIS

// Gemini endpoint (latest 2024/2025 endpoint)
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// -----------------------------------------------------
// generateTravelResponse(promptText)
// -----------------------------------------------------

async function generateTravelResponse(promptText) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
     return {
       markdown: "⚠️ Du mangler at indsætte din Google Gemini API-nøgle i geminiservice.js",
       type: "markdown",
       packingList: null,
       groundingUrls: []
     };
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ]
  };

  try {
    const response = await fetch(GEMINI_API_URL + `?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Extract the text safely
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Ingen svartekst modtaget fra Gemini.";

    return {
      markdown: text,
      type: "markdown",
      packingList: extractPackingList(text),
      groundingUrls: extractLinks(text)
    };
  } catch (error) {
    console.error("Gemini API fejl:", error);
    return {
      markdown: "⚠️ Der opstod en fejl ved kontakt til Gemini API.",
      type: "markdown",
      packingList: null,
      groundingUrls: []
    };
  }
}

// -----------------------------------------------------
// extractLinks(text)
// -----------------------------------------------------
function extractLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// -----------------------------------------------------
// extractPackingList(text)
// (simple version – can be expanded)
// -----------------------------------------------------
function extractPackingList(text) {
  if (!text.toLowerCase().includes("pakke")) return null;

  const lines = text.split("\n");
  const items = lines.filter((l) => l.trim().startsWith("-"));
  return items || null;
}

// -----------------------------------------------------
// Export to global namespace
// -----------------------------------------------------
window.generateTravelResponse = generateTravelResponse;
window.extractLinks = extractLinks;
window.extractPackingList = extractPackingList;
