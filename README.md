# 🌦️ SkyFlow - Premium Weather & AI Assistant

A modern, feature-rich weather application with an intelligent AI assistant powered by Google's Gemini API. SkyFlow provides real-time weather data, interactive charts, and AI-driven insights to help you stay informed about weather conditions.

## ✨ Features

- **Real-time Weather Data**: Get current weather information for your location
- **7-Day Forecast**: View detailed weather predictions for the next week
- **AI Assistant**: Chat with an intelligent AI powered by Google Gemini API for weather insights
- **Interactive Charts**: Visualize temperature and precipitation trends
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Location Detection**: Automatic location detection or manual city search
- **Professional UI**: Stunning gradient backgrounds with animated blob effects
- **Mobile Friendly**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Fonts**: Google Fonts (Plus Jakarta Sans, Outfit)
- **Weather API**: OpenWeatherMap API
- **AI API**: Google Gemini 2.0 Flash API
- **Icons**: Emoji & SVG icons

## 🚀 Getting Started

### Prerequisites

You'll need API keys from:
1. **OpenWeatherMap** - For weather data
   - Sign up at: https://openweathermap.org/api
   - Free tier available

2. **Google Gemini API** - For AI chat functionality
   - Sign up at: https://ai.google.dev/
   - Free tier available

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aiweatherapp.git
cd aiweatherapp
```

2. Open the project:
```bash
# Simply open index.html in your browser
# Or use a local server (recommended):
python -m http.server 8000
# or
npx http-server
```

3. Configure API Keys:
   - Open `index.html` in a text editor
   - Find the `OPENWEATHER_API_KEY` and `GEMINI_API_KEY` variables (around lines 340-341)
   - Replace with your actual API keys:

```javascript
const OPENWEATHER_API_KEY = 'your_openweathermap_api_key_here';
const GEMINI_API_KEY = 'your_gemini_api_key_here';
```

4. Open the application:
   - Navigate to `http://localhost:8000/index.html` (if using a server)
   - Or simply double-click `index.html` to open in your browser

## 📝 Configuration

### API Keys Setup

The application requires two main API configurations:

**OpenWeatherMap API:**
- Free tier provides current weather and 5-day forecasts
- Endpoint: `https://api.openweathermap.org/data/2.5/weather`
- Documentation: https://openweathermap.org/current

**Google Gemini API:**
- Free tier available for development
- Model: `gemini-2.0-flash`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Documentation: https://ai.google.dev/docs

## 🎯 Usage

1. **View Weather**: The app automatically detects your location or you can search for any city
2. **Check Forecast**: Scroll down to see 7-day weather predictions
3. **Chat with AI**: Use the chat interface at the bottom to ask weather-related questions
4. **View Charts**: Visualize temperature and precipitation trends over time

## 🏗️ Project Structure

```
aiweatherapp/
├── index.html          # Main application file (HTML + CSS + JavaScript)
├── README.md           # This file
└── .gitignore         # Git ignore file (recommended)
```

## 📱 Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚠️ Important Notes

- **API Keys Security**: Never commit real API keys to GitHub. Use environment variables or GitHub Secrets in production
- **CORS**: The application uses cross-origin requests. Ensure your APIs have CORS enabled
- **Free Tier Limits**: Be aware of API rate limits on free tiers:
  - OpenWeatherMap: 1,000 calls/day (free tier)
  - Google Gemini: Varies by plan

## 🔒 Security Recommendations

For production deployment:

1. **Use Environment Variables**: Store API keys in environment variables, not in code
2. **Backend Proxy**: Consider proxying API calls through your own backend to hide API keys
3. **Rate Limiting**: Implement rate limiting to prevent API abuse
4. **Input Validation**: Sanitize user inputs before sending to APIs

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements!

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Weather data not loading?
- Check your OpenWeatherMap API key is valid
- Ensure your location is accessible to the browser
- Check browser console for error messages

### AI chat not responding?
- Verify your Google Gemini API key is correct
- Check API quotas and rate limits
- Ensure you have an active internet connection

### Location detection not working?
- Grant location permission when browser asks
- Try searching for a city manually
- Check browser console for geolocation errors

## 📞 Support

For issues or questions:
- Check the browser console (F12) for error messages
- Verify API keys are correctly configured
- Ensure APIs are accessible from your location

---

Made with ❤️ by the SkyFlow Team
