# C59 · Applied Agents: Retrieval, Analysis, Documents and Review

Validates a local PR-review report against a seeded diff manifest. It does not fetch a repository, post a comment, or verify the finding is true. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Bind PR findings to the current head
- Validate changed-line locations
- Prepare findings without publishing

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3059`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3059
```

## How the app was build

### 1. Reject a review bound to a stale head

The reviewed head must match the current head before any finding is prepared. A changed revision returns conflict rather than publishing a stale review.

Source: [src/lesson.ts](src/lesson.ts#L13)

```typescript
if (text(input, "head") !== text(input, "currentHead"))
  return report(
    "conflict",
    "The PR revision changed after review",
    { prepared: false },
    ["Recheck the current repository head"],
  );
```

### 2. Validate location against the seeded diff

Only the reviewed src/api.ts lines 11–13 are in scope. The prepared finding includes a severity and demonstration message, while published:false keeps human review separate from posting a comment. The sample does not fetch a real diff or verify the finding’s truth.

Source: [src/lesson.ts](src/lesson.ts#L14) · selected statements

```typescript
const path = text(input, "path"),
  line = number(input, "line"),
  valid = path === "src/api.ts" && [11, 12, 13].includes(line);

return report(
  valid ? "passed" : "rejected",
  valid
    ? "Prepared a diff-scoped report for human review"
    : "Finding location is outside the reviewed diff",
  {
    prepared: valid,
    finding: valid
      ? {
          path,
          line,
          severity: "medium",
          message: "Demonstration finding; independently review.",
        }
      : null,
    diffHash: hash("reviewed diff bytes"),
    published: false,
  },
  [
    "Bind exact reviewed input bytes",
    "Validate schema and changed-line map",
    "Reject a stale revision",
    "Keep publication separately authorized",
  ],
);
```

### Check your understanding

Run **Prepare a current scoped finding** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "head": "head-1",
    "currentHead": "head-1",
    "path": "src/api.ts",
    "line": 12
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "prepared": true
  }
}
```

Then try **Reject a stale PR head**. Its expected outcome is `conflict`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
