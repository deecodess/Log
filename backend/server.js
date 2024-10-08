const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(bodyParser.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let changelogs = [];

app.post('/api/commits', async (req, res) => {
  const commits = req.body.commits;

  if (!commits || !Array.isArray(commits)) {
    return res.status(400).send({ error: 'Invalid commits format' });
  }

  const commitMessages = commits.map(commit => commit.message).join('\n');

  console.log(`Received commits: ${commitMessages}`); 

  try {
    const prompt = `Summarize the following commit messages:\n${commitMessages}`;
  
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            }
          ],
        }
      ]
    });
  
    console.log('Gemini API full response:', result); // See full response
    
    const summary = result.response.text(); // Call the text function to get the summary
  
    changelogs.push({ summary, date: new Date() });
  
    console.log('Generated summary:', summary); // This should now print the actual summary
  
    res.status(200).send({ summary });
  } catch (error) {
    if (error.response) {
      console.error('Gemini API Response Error:', error.response.data);
      res.status(500).send({ error: 'Failed to get summary from Gemini API', details: error.response.data });
    } else if (error.request) {
      console.error('No response received from Gemini API:', error.request);
      res.status(500).send({ error: 'No response from Gemini API' });
    } else {
      console.error('Error setting up request to Gemini API:', error.message);
      res.status(500).send({ error: 'Error communicating with Gemini API', details: error.message });
    }
  }
});

app.get('/api/changelogs', (req, res) => {
  res.send(changelogs);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
