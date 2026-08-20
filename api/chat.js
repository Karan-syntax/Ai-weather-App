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

    const models = [
        'gemini-3.7-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash'
    ];

    const delays = [1000, 2000, 4000];

    const sleep = (ms) =>
        new Promise(resolve => setTimeout(resolve, ms));

    async function callGemini(model) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    }
                })
            }
        );

        const data = await response.json();

        return {
            response,
            data
        };
    }

    try {
        let lastError = null;

        for (const model of models) {
            for (let attempt = 0; attempt < 3; attempt++) {

                try {
                    console.log(
                        `Trying Gemini model ${model}, attempt ${attempt + 1}`
                    );

                    const { response, data } = await callGemini(model);

                    if (response.ok) {
                        const rawText =
                            data?.candidates?.[0]?.content?.parts
                                ?.map(part => part.text || '')
                                .join(' ')
                                .trim();

                        if (!rawText) {
                            throw new Error(
                                'Gemini returned an empty response.'
                            );
                        }

                        return res.status(200).json({
                            text: rawText
                        });
                    }

                    const errorMessage =
                        data?.error?.message ||
                        `Gemini returned HTTP ${response.status}`;

                    lastError = errorMessage;

                    console.error(
                        `Gemini ${model} error ${response.status}:`,
                        errorMessage
                    );

                    /*
                     * Retry only transient errors.
                     * 503 = service overloaded/unavailable
                     * 429 = rate/quota limit
                     * 500/502/504 = temporary server problems
                     */
                    if (
                        response.status === 503 ||
                        response.status === 429 ||
                        response.status === 500 ||
                        response.status === 502 ||
                        response.status === 504
                    ) {
                        if (attempt < 2) {
                            await sleep(delays[attempt]);
                            continue;
                        }

                        break;
                    }

                    /*
                     * Don't retry permanent errors such as:
                     * 400, 401, 403, 404
                     */
                    return res.status(response.status).json({
                        error: errorMessage
                    });

                } catch (err) {
                    lastError = err?.message || 'Gemini request failed.';

                    console.error(
                        `Gemini ${model} request error:`,
                        err
                    );

                    if (attempt < 2) {
                        await sleep(delays[attempt]);
                        continue;
                    }
                }
            }
        }

        return res.status(503).json({
            error:
                lastError ||
                'Gemini is temporarily unavailable. Please try again in a moment.'
        });

    } catch (err) {
        console.error('Chat API server error:', err);

        return res.status(500).json({
            error: err?.message || 'Internal server error.'
        });
    }
};