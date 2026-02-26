const { ModelContextProtocolServer } = require('@modelcontextprotocol/sdk');
const createEvent = require('./scripts/create-google-calendar-event');
const listEvents = require('./scripts/list-google-calendar-events');

// Create a new MCP server instance
const server = new ModelContextProtocolServer();

// Register tool to create Google Calendar Event
server.registerTool({
  name: 'createGoogleCalendarEvent',
  description: 'Creates a new event or schedule in Google Calendar.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title (summary) of the event.',
      },
      options: {
        type: 'object',
        description: 'Optional event properties like description, location, dates, etc.',
        properties: {
          calendarId: {
            type: 'string',
            description: 'The ID of the calendar. Defaults to "primary".',
          },
          description: {
            type: 'string',
            description: 'Description of the event.',
          },
          location: {
            type: 'string',
            description: 'Location of the event.',
          },
          isAllDay: {
            type: 'boolean',
            description: 'Set to true for all-day events.',
          },
          startDate: {
            type: 'string',
            description: 'Start date for all-day events in YYYY-MM-DD format.',
          },
          endDate: {
            type: 'string',
            description: 'End date (exclusive) for all-day events in YYYY-MM-DD format.',
          },
          startDateTime: {
            type: 'string',
            description: 'Start date and time in ISO 8601 format (e.g., "2026-03-05T14:00:00+08:00").',
          },
          endDateTime: {
            type: 'string',
            description: 'End date and time in ISO 8601 format.',
          },
          timeZone: {
            type: 'string',
            description: 'The timezone (e.g., "Asia/Shanghai").',
          },
        },
        additionalProperties: false,
      },
    },
    required: ['title'],
  },
  execute: async ({ title, options }) => {
    try {
      const result = await createEvent(title, options);
      return { success: true, event: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
});

// Register tool to list Google Calendar Events
server.registerTool({
  name: 'listGoogleCalendarEvents',
  description: 'Lists upcoming events from Google Calendar.',
  parameters: {
    type: 'object',
    properties: {
      maxResults: {
        type: 'number',
        description: 'Maximum number of events to return. Defaults to 10.',
      },
      timeMin: {
        type: 'string',
        description: 'Lower bound (inclusive) for an event\'s end time to filter by. Defaults to now.',
      },
      timeMax: {
        type: 'string',
        description: 'Upper bound (exclusive) for an event\'s start time to filter by.',
      }
    },
  },
  execute: async ({ maxResults, timeMin, timeMax }) => {
    try {
      const events = await listEvents(maxResults, timeMin, timeMax);
      return { success: true, events: events };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
});

// Start the MCP server
const port = process.argv[2] || 8081;
server.listen(port);
console.log(`Google Calendar MCP server listening on port ${port}`);
