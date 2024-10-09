const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' });
}
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const client = new MongoClient(uri);

let changelogCollection;

app.use(bodyParser.json());
app.use(cors());

async function connectDB() {
  try {
    await client.connect();
    const database = client.db('changelogger');
    changelogCollection = database.collection('changelogs');
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
connectDB();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-latest',
  generationConfig: { response_mime_type: "application/json" },
});

app.post('/api/commits', async (req, res) => {
  const commits = req.body.commits;
  if (!commits || !Array.isArray(commits)) {
    return res.status(400).send({ error: 'Invalid commits format' });
  }

  const commitMessages = commits.map(commit => commit.message).join('\n');
  const jsonSchema = {
    title: "Commit Summary",
    description: "Summarized commit messages from a changelog",
    type: "object",
    properties: {
      summary: { type: "string", description: "Summary of the commits" }
    },
    required: ["summary"]
  };

  const prompt = `Follow JSON schema.<JSONSchema>${JSON.stringify(jsonSchema)}</JSONSchema>\nSummarize the following commit messages:\n${commitMessages}`;
  
  try {
    const result = await model.generateContent(prompt);
    const summary = await result.response.text();

    const changelog = {
      summary,
      date: new Date()
    };

    await changelogCollection.insertOne(changelog);
    res.status(200).send({ summary });

  } catch (error) {
    if (error.response) {
      res.status(500).send({ error: 'Failed to get summary from Gemini API', details: error.response.data });
    } else if (error.request) {
      res.status(500).send({ error: 'No response from Gemini API' });
    } else {
      res.status(500).send({ error: 'Error communicating with Gemini API', details: error.message });
    }
  }
});

app.get('/api/changelogs', async (req, res) => {
  try {
    const changelogs = await changelogCollection.find().sort({ date: -1 }).toArray();
    res.send(changelogs);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve changelogs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
