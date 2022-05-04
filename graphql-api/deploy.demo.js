// first argument to provide is github token, second one is a branch to deploy
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: `${process.argv[3]}` });
const con = async() => {
    await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: 'seatti-tech',
        repo: 'tomorrow-teams',
        workflow_id: `.github/workflows/deploy-demo-${process.argv[2]}.yml`,
        ref: `${process.argv[4]}`
    })
}
con()
