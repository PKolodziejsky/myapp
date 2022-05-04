# MS Teams Client

At Seatti we ship a Microsoft Teams App that enables users to plan and share their workspace location. This enables companies to manage their real estate resources as well as teams to organise their collaboration.

The MVP consists of two views, **Planning** and **Dashboard**, which are both Tabs in the Microsoft Teams App. Download this repository to start contributing!

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)

## Setup Seatti UI

This project uses components from seatti-ui repository. In order to reference the repository, [get yourself a personal Github access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

- In `.npmrc` file change placeholder `PERSONAL_TOKEN` with the personal access token retrieved from Github.
- Run `git update-index --skip-worktree .npmrc​` to ignore all local changes on `.npmrc`

## Build and Run

In the project directory, execute:
`npm install`
`npm start`

## Development Guides

- [Gitflow](https://www.atlassian.com/de/git/tutorials/comparing-workflows/gitflow-workflow)

## Gitflow

We follow the standard Gitflow workflow: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow