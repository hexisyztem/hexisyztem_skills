---
name: dida365-create-schedule
description: Creates new tasks (schedules) in Dida365 (TickTick China). Use this skill when the user wants to add a new item to their Dida365 account, such as a reminder, an event, or a todo.
---

# Dida365 Create Schedule Skill

This skill allows you to create new tasks or schedules in your Dida365 account directly from the Gemini CLI.

## Authentication

To use this skill, you need a Dida365 Access Token. You should obtain this token from the Dida365 Developer website by registering an application and following their OAuth 2.0 authentication flow.

Once you have your access token, set it as an environment variable named `DIDA365_ACCESS_TOKEN` in your shell session:

```bash
export DIDA365_ACCESS_TOKEN="YOUR_DIDA365_ACCESS_TOKEN"
```
**Important:** Replace `YOUR_DIDA365_ACCESS_TOKEN` with your actual token. Ensure this variable is set before attempting to use the skill.

## Usage

This skill utilizes the `scripts/dida365-task.js` script to interact with the Dida365 OpenAPI.

### Creating a Simple Task (Schedule)

To create a task with just a title, use the following command (Note: projectId is required):

```bash
node ./scripts/dida365-task.js "Your Task Title Here" '{"projectId": "YOUR_PROJECT_ID"}'
```

### Creating a Task with Additional Options

You can provide additional task properties as a JSON string as the second argument. Refer to `references/dida365-api-task.md` for a full list of available options and their formats.

**Example: Task with Due Date and Priority**

```bash
node ./scripts/dida365-task.js "Meeting with John" '{"projectId": "YOUR_PROJECT_ID", "dueDate": "2026-03-05T14:00:00+0800", "priority": 5, "timeZone": "Asia/Shanghai"}'
```

**Example: All-day Task**

```bash
node ./scripts/dida365-task.js "Review Project Proposal" '{"isAllDay": true, "dueDate": "2026-03-10T00:00:00+0800", "projectId": "YOUR_PROJECT_ID", "timeZone": "Asia/Shanghai"}'
```

**Note on `projectId`**: Dida365 OpenAPI requires a `projectId` when creating a task. To find your `projectId`, you might need to inspect network requests when using the Dida365 web app or use another Dida365 API endpoint (like `GET /open/v1/project`) to list your projects.

## References

- **`references/dida365-api-task.md`**: Contains detailed information about the Dida365 OpenAPI endpoint for task creation, including all supported fields and their expected formats.