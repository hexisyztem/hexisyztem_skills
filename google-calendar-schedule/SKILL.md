# Google Calendar Schedule Skill

This skill allows you to manage events in your Google Calendar directly from the Gemini CLI. You can list upcoming events and create new events seamlessly.

## Prerequisites

To use this skill, you must set up a Google Cloud Project with the Google Calendar API enabled, and download the OAuth2 client credentials.

### Getting Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Google Calendar API**.
4. Configure the **OAuth consent screen** (Internal or External). Add the `https://www.googleapis.com/auth/calendar` scope.
5. Go to **Credentials** and create an **OAuth client ID** of type **Desktop app**.
6. Download the JSON file and rename it to `credentials.json`.
7. Place `credentials.json` in the root of the `google-calendar-schedule` directory (`/Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/credentials.json`).

The first time you run any of the commands, a browser window will open asking you to log in with your Google account and authorize the application. Once authorized, a `token.json` file will be generated in the directory, and subsequent requests won't require manual authorization.

## Scripts Usage

### List Upcoming Events

```bash
node /Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/scripts/list-google-calendar-events.js [maxResults] [timeMin] [timeMax]
```

Example: List the next 5 events
```bash
node /Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/scripts/list-google-calendar-events.js 5
```

### Create a New Event

```bash
node /Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/scripts/create-google-calendar-event.js "Your Event Title" '{"startDateTime": "...", "endDateTime": "..."}'
```

Example: Create a simple 1-hour event starting now
```bash
node /Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/scripts/create-google-calendar-event.js "Test Event"
```

Example: Create an all-day event tomorrow
```bash
node /Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/scripts/create-google-calendar-event.js "All Day Meeting" '{"isAllDay": true, "startDate": "2026-02-27", "timeZone": "Asia/Shanghai"}'
```

Example: Create an event with a specific time and location
```bash
node /Users/zhoupofan/hexisyztem_skills/google-calendar-schedule/scripts/create-google-calendar-event.js "Dinner with friends" '{"location": "Shanghai", "startDateTime": "2026-02-27T19:00:00+08:00", "endDateTime": "2026-02-27T21:00:00+08:00"}'
```
