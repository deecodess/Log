const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.post("/api/generate", async (req, res) => {
    try {
      const prompt = req.body.prompt;
      console.log(`Received prompt in Node.js: ${prompt}`);  // Add this log
      
      const response = await axios.post("http://localhost:8000/generate", {
        prompt: prompt,
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error in Axios request:", error);  // Add this log
      res.status(500).send(error.toString());
    }
  });
  

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
