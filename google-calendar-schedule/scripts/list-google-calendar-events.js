const { getCalendarClient } = require('./auth');

/**
 * Lists upcoming events in Google Calendar.
 * @param {number} maxResults The maximum number of events to return.
 * @param {string} timeMin The lower bound (inclusive) for an event's end time to filter by. Default: now.
 * @param {string} timeMax The upper bound (exclusive) for an event's start time to filter by.
 */
async function listEvents(maxResults = 10, timeMin = (new Date()).toISOString(), timeMax = undefined) {
  const calendar = await getCalendarClient();
  
  const params = {
    calendarId: 'primary',
    timeMin: timeMin,
    maxResults: maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  };

  if (timeMax) {
    params.timeMax = timeMax;
  }

  try {
    const res = await calendar.events.list(params);
    const events = res.data.items;
    
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return [];
    }
    
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error.message);
    throw error;
  }
}

// Allow running from CLI directly
if (require.main === module) {
  const maxResultsArg = parseInt(process.argv[2], 10);
  const maxResults = isNaN(maxResultsArg) ? 10 : maxResultsArg;
  
  const timeMin = process.argv[3];
  const timeMax = process.argv[4];

  listEvents(maxResults, timeMin, timeMax)
    .then((events) => {
      // Result is already printed in the function for CLI convenience
    })
    .catch((error) => {
      console.error('Failed to list events:', error);
      process.exit(1);
    });
}

module.exports = listEvents;
