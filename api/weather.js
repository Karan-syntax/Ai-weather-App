export default async function handler(request, response) {
    const { city, type, prompt } = request.query;

    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    try {
        if (type === 'chat') {
            const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                }
            );
            const data = await geminiRes.json();
            return response.status(200).json(data);
        }

        const targetCity = (city && city !== 'undefined' && city.trim() !== '') ? city : 'New York';
        
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(targetCity)}&units=metric&appid=${WEATHER_API_KEY}`
        );

        const data = await weatherRes.json();
        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({ error: 'Server error' });
    }
}