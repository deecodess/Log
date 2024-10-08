require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

let changelogSummary = '';

const path = require('path');
const changelogPath = path.resolve(__dirname, 'changelog.txt');

fs.readFile(changelogPath, 'utf8', (err, data) => {
  if (err) throw err;
  axios.post('https://api.openai.com/v1/engines/gemini/completions', {
    prompt: `Summarize the following changelog in a few lines:\n\n${data}`,
    max_tokens: 100
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_TOKEN}`,
    }
  }).then(response => {
    changelogSummary = response.data.choices[0].text.trim();
    console.log('Changelog Summary:', changelogSummary);
    fs.writeFile('changelog_summary.txt', changelogSummary, (err) => {
      if (err) throw err;
      console.log('Changelog summary saved to changelog_summary.txt');
    });
  }).catch(error => {
    console.error('Error:', error);
  });
});

app.get('/changelog-summary', (req, res) => {
  res.json({ summary: changelogSummary });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
