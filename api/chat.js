module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const { prompt } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'Missing GEMINI_API_KEY in Vercel environment variables.'
        });
    }

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({
            error: 'A valid prompt is required.'
        });
    }

    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', data);

            return res.status(response.status).json({
                error:
                    data?.error?.message ||
                    data?.error?.status ||
                    'Gemini API request failed.'
            });
        }

        const rawText =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || '')
                .join(' ')
                .trim();

        if (!rawText) {
            return res.status(502).json({
                error: 'Gemini returned no text response.'
            });
        }

        return res.status(200).json({
            text: rawText
        });

    } catch (err) {
        console.error('Server error:', err);

        return res.status(500).json({
            error: err?.message || 'Internal server error.'
        });
    }
};