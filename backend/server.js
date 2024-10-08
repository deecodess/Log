const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

app.use(bodyParser.json())
app.use(cors())

let changelogs = []

app.post('/api/commits', async (req, res) => {
  const commits = req.body.commits
  const commitMessages = commits.map(commit => commit.message).join('\n')
  try {
    const response = await axios.post('https://api.gemini.com/summarize', {
      prompt: `Summarize the following commit messages:\n${commitMessages}`
    }, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const summary = response.data.summary
    changelogs.push({ summary, date: new Date() })
    res.status(200).send({ summary })
  } catch (error) {
    res.status(500).send({ error: 'Failed to get summary from Gemini API' })
  }
})

app.get('/api/changelogs', (req, res) => {
  res.send(changelogs)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
