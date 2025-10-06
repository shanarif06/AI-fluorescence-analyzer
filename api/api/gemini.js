export default async function handler(req, res) {
  const { prompt, image } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              image ? { inlineData: { mimeType: "image/jpeg", data: image } } : null,
            ].filter(Boolean),
          },
        ],
      }),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
