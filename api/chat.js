module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'Missing GEMINI_API_KEY in Vercel settings.'
        });
    }

    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({
            error: 'Prompt is required.'
        });
    }

    const models = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite'
    ];

    let lastError = 'Gemini request failed';

    for (const model of models) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
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

            if (response.ok) {
                const text =
                    data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    return res.status(200).json({
                        text,
                        model
                    });
                }

                lastError = 'Gemini returned an empty response.';
                continue;
            }

            const errorMessage =
                data?.error?.message ||
                `Gemini returned HTTP ${response.status}`;

            console.error(`Gemini ${model} failed:`, errorMessage);

            lastError = errorMessage;

            // Try the next model for temporary/server/rate-limit errors
            if (
                response.status === 429 ||
                response.status === 500 ||
                response.status === 502 ||
                response.status === 503 ||
                response.status === 504
            ) {
                continue;
            }

            // Authentication / invalid request errors should not
            // be retried against another model.
            return res.status(response.status).json({
                error: errorMessage
            });

        } catch (err) {
            console.error(`Gemini ${model} network error:`, err);
            lastError = err.message || 'Network error';

            // Try fallback model
            continue;
        }
    }

    return res.status(503).json({
        error: `AI service temporarily unavailable. ${lastError}`
    });
};