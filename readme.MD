### Overview 

1. **Commit Information**: Used `changelogger.yml` in a GitHub workflow to auto-extract commit data on every push.
2. **Backend**: The extracted commit data is sent to the backend API, and then to Google Gemini.
3. **Google Gemini API**: Backend forwards the commit data to the Google Gemini API, with a prompt to request a change summary.
4. **Frontend**: The summary returned by Gemini is sent back through the backend and displayed in the frontend.



### Journey
When I started on this project, I decided to use a locally hosted LLM. After putting in some effort, I successfully got the local LLM up and running.

However, I quickly ran into a major issue: performance. The model files were quite large and resource-intensive, causing response times to be painfully slow. 

So I shifted to Google Gemini API
Doing this, I was able to offload the resource burden from my local machine and make this project a bit faster.


### How to run
Create .env file with the following format:
```
REPO_TOKEN="Your github repo token with all the necessary permissions"
GEMINI_API_KEY="Your google gemini api key"
BACKEND_URL="Your hosted backend url or https://changelog-u0xv.onrender.com/api/commits"
```
Go to your terminal and run the following commands
- ```git clone https://github.com/deecodess/Log ```
- ```cd backend```
- ```npm i```
- ```node server.js```
- ```cd frontend```
- ```npm i```
- ```npm run dev```

