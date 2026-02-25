---
name: dida365-list-tasks
description: Lists all incomplete tasks and subtasks from Dida365 (TickTick China) in a clear directory hierarchy view (Project -> Task -> Subtask).
---

# Dida365 List Tasks Skill

This skill allows you to retrieve and view all your tasks, sorted by projects, directly from your Dida365 account in a beautiful tree-structure format.

## Authentication

Like the `dida365-create-schedule` skill, this requires a Dida365 Access Token. 

Set it as an environment variable named `DIDA365_ACCESS_TOKEN` in your shell session:

```bash
export DIDA365_ACCESS_TOKEN="YOUR_DIDA365_ACCESS_TOKEN"
```

## Usage

You can use the following command to print out the directory-like hierarchy of all your projects, tasks, and subtasks (items):

```bash
node ./scripts/list-dida365-tasks.js
```

### What it shows:
- **Projects**: Displayed as root folders (📁) with their project IDs.
- **Tasks**: Displayed as files/nodes (📝) along with:
  - Task ID for easy reference
  - Due dates if available
  - Priority level
  - Task content and description
- **Subtasks (Items)**: Displayed as child nodes under tasks with:
  - Item ID for easy reference
  - Completion status marked with ✅ (completed) or ⏳ (pending)
