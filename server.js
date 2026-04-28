const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Handle chat - accepts JSON from frontend
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('Message:', message);

    // Using Google Gemini 2.5 Flash API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));
    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ response: reply });

  } catch (err) {
    console.error('Full Error:', err.response?.data || err.message);
    res.json({ response: "Sorry, something went wrong." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});