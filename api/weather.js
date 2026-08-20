export default async function handler(req, res) {
    const { lat, lon, city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY; // Stored securely in environment variables

    if (!apiKey) {
        return res.status(500).json({ error: "Server missing API key setup." });
    }

    try {
        let weatherUrl = "";
        let forecastUrl = "";

        if (lat && lon) {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        } else if (city) {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        } else {
            return res.status(400).json({ error: "Missing location parameters." });
        }

        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
            return res.status(404).json({ error: "Location not found or API error." });
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        return res.status(200).json({
            weather: weatherData,
            forecast: forecastData
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
}