export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable.' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: rawText });

    } catch (err) {
        return res.status(500).json({ error: err.message || 'Failed to call AI service' });
    }
}