<a id="readme-top"></a>

# Contributing to `OneMed1a`

Thank you for your interest in contributing to `OneMed1a`.
This guide will help you understand how to get involved, submit your work, and collaborate effectively.
git push --set-upstream origin docs/update-repo-documentation

> Please also read our [README.md](README.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Table of Contents

- [Project Ground Rules](#project-ground-rules)
- [Contributions We Welcome](#contributions-we-welcome)
- [Getting Started](#getting-started)
  - [Newcomer Guide](#how-newcomers-can-get-started)
  - [Environment Setup](#environment-setup-and-running-tests)
  - [Technical Requirements](#technical-requirements)
- [System Architecture](#high-level-design)
- [Development Workflow](#development-workflow)
  - [General Contribution Process](#when-contributing-general-workflow)
  - [Branching Strategy](#when-creating-branches)
  - [Code Review Process](#code-review-process)
- [Issue Reporting](#issue-reporting)
  - [Feature Requests](#suggesting-a-new-feature)
  - [Bug Reports](#reporting-a-bug)
- [Project Guidelines](#project-guidelines)
  - [Dependency Management](#adding-dependencies-to-the-project)
  - [Pull Request Submission](#submitting-a-pull-request)˚v
  - [Project Vision](#project-vision--roadmap)
- [Communication](#how-contributors-should-get-in-touch)
- [License](#license)

---

## Project Ground Rules

To ensure consistency throughout the source code and collaboration:

- Be respectful, inclusive, and collaborative.
- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
- Keep discussions constructive and professional.
- All contributions must follow the **issue → branch → pull request → review → squash merge** workflow.  
  _(No direct commits to `main`.)_
- All features or bug fixes **must include tests**.
- All classes and methods **must be documented**.
- **Never commit API keys** or secrets.

---

## Contributions We Welcome

✅ **We are looking for:**

- Bug fixes
- New features aligned with project goals
- Documentation improvements
- Tests
- Refactoring for readability and maintainability
- Design and UX improvements

❌ **We aren’t looking for:**

- Features outside of our project scope
- Large architectural changes without prior discussion (RFC)
- Anything violating the [Code of Conduct](CODE_OF_CONDUCT.md)

---

## How Newcomers Can Get Started

1. Browse [issues](https://github.com/SOFTENG-310-OneMed1a/OneMed1a_App/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22) labeled **good first issue** or **help wanted**.
2. Comment to claim an issue. _(Each contributor may only have one claimed issue at a time.)_
3. Join discussions on the issue to clarify questions before starting.

---

## Environment Setup and Running Tests

### Backend Setup

- Install **Java 21**
- Install **Maven**
- Install **Docker** (for Postgres container)

### Frontend setup

- Install Node.js version 18 +

### IDE Extensions

- Install SonarQube extension

### API Keys

- Make sure to put all the API keys in onemed1a-backend/src/main/resources/application.properties

Once you have installed all the required software, first run the database through docker in the root folder

```shell
   docker compose up -d
```

After you have the database running on docker, run the sprintboot backend

```shell
   cd onemed1a-backend
   mvn spring-boot:run
```

Once you have all the backend running switch to the frontend server and run the frontend

```shell
   cd onemed1a-frontend
   npm install
   npm run dev
```

To run backend tests switch to the backend folder, then run the following command

```shell
   cd onemed1a-backend
   mvn test
```

---

## Technical Requirements

- **Secrets / Secret hygiene**

  - **Never commit API keys or secrets** (including `application.properties`, `.env`, or any file containing credentials).
  - Keep an `application.properties.example` (or `.env.example`) in the repo with placeholder values and instructions.
  - For local development, use a local-only file (e.g. `application.properties.local`) or environment variables and add those files to `.gitignore`.
  - Prefer environment variables or a secrets manager for CI / production.

- **Static analysis**

  - Run and fix issues flagged by SonarLint / linters before committing.
  - CI will run static checks — commits that introduce new high/critical issues may be blocked.

- **Security**

  - Keep dependencies up to date (both NPM and Maven).
  - Avoid unnecessary third-party libraries. Evaluate security and maintenance of new dependencies before adding.

- **Tests**
  - All features and bug fixes **must include tests** where applicable.
  - Unit tests, integration tests and end-to-end tests are encouraged when relevant.
  - CI runs the test suite; ensure tests pass locally before opening a PR.

---

## High-level Design

- **Frontend**

  - Next.js (React)

- **Backend**

  - Java Spring Boot

- **Database**

  - PostgreSQL (containerised via Docker)

- **User authentication**

  - Implementation-specific (chosen by the feature owner / implementer)

- **APIs**
  - OpenAI, TMDB, Spotify Web API, Google Books API (used by various features)

---

## When Contributing (General Workflow)

1. **Fork & clone** (first time contributors):

   ```bash
   git clone https://github.com/<your-username>/<repo>.git
   git remote add upstream https://github.com/SOFTENG-310-OneMed1a/OneMed1a_App.git
   ```

2. Ensure there’s an issue describing the problem or feature.

3. **Create a branch** for each issue from `upstream/main` (see next section)

4. Make your **changes**, including tests and documentation

5. Keep rebasing to stay current with `upstream/main`.

6. **Commit** with a clear message

7. Open a Pull Request (PR):

- PR Title: succinct summary of WHAT changed.
- PR Body: WHY + WHAT, with context and testing notes if needed.
- Must include: `Closes #<issue number>`.

8. Address review comments and squash merge when approved(enforced by branch protection).

---

## When Creating Branches

- Base all work on upstream/main
- Rebase early/often:
  ```bash
  git fetch upstream
  git rebase upstream/main
  ```
- Naming:
  - `feat/<short-desc>`
  - `fix/<short-desc>`
  - `docs/…`, `chore/…`, `test/…`, `refactor/…`
  - Examples: `feat/search-filters`, `fix/navbar-overlap`

---

## Code Review Process

Reviewers will:

1. Run the test suite and the application.
2. Check code readability, maintainability, and adherence to style.
3. Verify that commits are squashed and conflicts resolved.
4. Only merge once approval is granted.

**Important:**

- Every PR must be reviewed by at least one other team member before merging.
- Do not merge your own pull request without approval.

**Note:**

- All contributors have merge access to this repository.
- This decision was agreed upon by the entire team to ensure everyone can take ownership of their contributions and the review process.

---

## Suggesting a New Feature

1. **Check** existing [feature requests](https://github.com/SOFTENG-310-OneMed1a/OneMed1a_App/issues?q=is%3Aissue%20state%3Aopen%20type%3AFeature) to avoid duplication and to see if there are any dependencies.
2. If not found, open a **Feature Request issue** following the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).
3. Add appropriate labels (i.e. `priority:high`, `backend`, `frontend` etc)

---

## Reporting a bug

If you find a bug:

- **Search** existing [issues](https://github.com/SOFTENG-310-OneMed1a/OneMed1a_App/issues) to avoid duplicates.
- If it’s new, **open a Bug issue** following the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).
- Confirm the bug exists on the latest `main` branch before reporting.
- Provide clear steps to reproduce, expected vs actual behaviour, and screenshots/logs where possible.
- Label as `bug`.

---

## Adding Dependencies to the Project

When introducing a new dependency, it is **your responsibility** to ensure it is added correctly so that other developers can install and use the project without issues.

Before adding a dependency, consider whether it is truly necessary. Unnecessary dependencies can increase bundle size, slow down installs, and introduce security vulnerabilities. Always check if the functionality can be achieved with existing dependencies or native features.

### Commands

Use the following commands when adding dependencies:

```bash
# For dev-only dependencies (e.g., testing, linting, build tools)
npm install <NEW_PACKAGE> --save-dev

# For regular runtime dependencies (packages required in production)
npm install <NEW_PACKAGE> --save
```

---

## Submitting a Pull Request

1. **Check** existing [pull requests](https://github.com/SOFTENG-310-OneMed1a/OneMed1a_App/pulls) to avoid duplicates.
2. If not found:

   - First, make a fork of the main repository

   - After you have made a fork, clone it to your local machine then set upstream to the main repository
     ```shell
     git remote add upstream https://github.com/ORIGINAL_OWNER/REPO_NAME.git
     ```
   - Make your changes in a new git branch:
     ```shell
     git checkout -b my-fix-branch main
     ```
   - Make sure to test your code and ensure it works and nothing else breaks.

   - **Before you commit any changes, make sure not to include the API keys in application.properties**

   - Commit your changes with a descriptive commit message:

     ```shell
     git commit -am "commit message"
     ```

   - Push your changes to GitHub:

     ```shell
     git push origin my-fix-branch
     ```

   - In GitHub, send a pull request to `OneMed1a:main`.

   - When creating a pull request, make sure to include a short descriptive title and reference the issue it is addressing in the body.

## Project vision & roadmap

`OneMed1a` aims to develop a unified web application that aggregates movies, TV shows, books,
and podcasts into a single discovery hub. By ingesting each user’s ratings, reviews and
wish-lists, alongside their friends’ activity, the system will generate context-aware, cross-media
recommendations (e.g. “you just finished that novel; here’s its film adaptation or a related
podcast”). A consolidated activity feed will let users track, share and save everything in one
place, transforming fragmented media browsing into a cohesive, socially driven experience.

### Our current roadmap includes:

1. Area to track media you have watched
   - Movies
   - TV Shows
   - Music
   - Books / Ebooks
2. Recommendation features:
   - Cross-media recommendation features using user’s taste from their data.
3. Tracking of watched/watching media
   - Completed, watching, plan to watch
4. Creating accounts
   - Allows users to save their accounts and save their data
5. Friends feature:
   - Add friends
   - View friend’s rating
   - View friend’s analytics (number of movies/media watched)
   - Recommends to you the friend’s top picks
6. Recommendation Features
   - Modify recommendation implementation to consider mood
7. Blend Mode (if time allows)
   - Choose a friend, combine and compare data and return a compatibility score
   - Scoreboard to display compatibility scores

---

## License

By contributing, you agree your contributions are licensed under the project’s LICENSE.
When you submit code changes, your submissions are understood to be under the same MIT License that covers the project. Feel free to contact the maintainers if that's a concern.

---

## How contributors should get in touch

- Create or comment on GitHub Issues or Pull Requests for technical discussions.
- Weekly group meetings will be summarised in the Wiki.
- If you need help, comment on the relevant issue or PR and tag teammates.

For extra help join the discord: https://discord.gg/rsDuRvQuPN

[↑ Back to top](#table-of-contents)
