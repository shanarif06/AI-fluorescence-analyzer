export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, image } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
    }

    // --- Build Gemini request ---
    const body = {
      contents: [
        {
          parts: [
            ...(image
              ? [
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: image,
                    },
                  },
                ]
              : []),
            {
              text:
                prompt ||
                "Analyze fluorescence intensity and describe the RGB characteristics of this image.",
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log("Gemini API Response:", data);

    // --- Extract text safely ---
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "No response from Gemini.";

    res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Error connecting to Gemini API." });
  }
}
