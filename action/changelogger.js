const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const ghToken = core.getInput('REPO_TOKEN', { required: true });
    const flaskApiUrl = core.getInput('flask_api_url', { required: true });

    const octokit = github.getOctokit(ghToken);
    const context = github.context;

    const commits = await getCommits(octokit, context);
    const changelog = await generateChangelog(commits, flaskApiUrl);
    const version = determineVersion(commits);

    console.log('Generated Changelog:', changelog);
    console.log('Version:', version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getCommits(octokit, context) {
  const { owner, repo } = context.repo;
  const { data: commits } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  return commits.map(commit => commit.commit.message);
}

async function generateChangelog(commits, flaskApiUrl) {
  const commitMessages = commits.join('\n');
  const prompt = `Generate a changelog based on these commits:\n${commitMessages}`;

  const response = await axios.post(flaskApiUrl, { prompt });
  return response.data.generated_text || response.data.text;
}

function determineVersion(commits) {
  return '1.0.0'; 
}

run();
