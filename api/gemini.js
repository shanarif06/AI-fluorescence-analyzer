export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt || "Analyze the uploaded image and summarize RGB intensity."
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Debugging log (optional)
    console.log("Gemini response:", data);

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ text: "No response from Gemini." });
    }

    res.status(200).json({ text: data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Error connecting to Gemini API." });
  }
}
