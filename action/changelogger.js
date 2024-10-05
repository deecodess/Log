const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const fs = require('fs');

async function run() {
    try {
      const ghToken = core.getInput('REPO_TOKEN', { required: true });
      const flaskApiUrl = core.getInput('FLASK_API_URL', { required: true });
  
      const octokit = github.getOctokit(ghToken);
      const context = github.context;
  
      const commits = await getCommits(octokit, context);
      const changelog = await generateChangelog(commits, flaskApiUrl);
      const version = determineVersion(commits);
  
      await updateChangelogFile(changelog, version);
  
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

async function updateChangelogFile(changelog, version) {
    const changelogPath = 'CHANGELOG.md';
    let existingChangelog = '';
    
    try {
      existingChangelog = await fs.readFile(changelogPath, 'utf8');
    } catch (error) {
      console.log('No existing changelog found. Creating a new one.');
    }
  
    const newChangelog = `# ${version}\n\n${changelog}\n\n${existingChangelog}`;
    await fs.writeFile(changelogPath, newChangelog);
  }
  
function determineVersion(commits) {
  return '1.0.0'; 
}

run();
