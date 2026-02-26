const { getCalendarClient } = require('./auth');

/**
 * Creates a new event in Google Calendar.
 * @param {string} title The title of the event.
 * @param {Object} options Additional options for the event.
 */
async function createEvent(title, options = {}) {
  const calendar = await getCalendarClient();
  
  // Default to primary calendar
  const calendarId = options.calendarId || 'primary';
  
  const event = {
    summary: title,
    description: options.description || '',
    location: options.location || '',
  };

  // Handle dates and times
  if (options.isAllDay) {
    const defaultDate = new Date().toISOString().split('T')[0];
    const startDate = options.startDate || defaultDate;
    
    // For all-day events, end date is exclusive (so it should be the day after start date if 1-day event)
    let endDate = options.endDate;
    if (!endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);
      endDate = start.toISOString().split('T')[0];
    }

    event.start = { date: startDate, timeZone: options.timeZone };
    event.end = { date: endDate, timeZone: options.timeZone };
  } else {
    // Default to a 1-hour event starting now if no dates provided
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    event.start = {
      dateTime: options.startDateTime || now.toISOString(),
      timeZone: options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    event.end = {
      dateTime: options.endDateTime || oneHourLater.toISOString(),
      timeZone: options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  try {
    const res = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    });
    return res.data;
  } catch (error) {
    console.error('Error creating event:', error.message);
    throw error;
  }
}

// Allow running from CLI directly
if (require.main === module) {
  const title = process.argv[2];
  const optionsStr = process.argv[3];

  if (!title) {
    console.error('Usage: node create-google-calendar-event.js "<Title>" \'{\"startDateTime\": \"...\", ...}\'');
    process.exit(1);
  }

  let options = {};
  if (optionsStr) {
    try {
      options = JSON.parse(optionsStr);
    } catch (e) {
      console.error('Failed to parse options JSON:', e.message);
      process.exit(1);
    }
  }

  createEvent(title, options)
    .then((event) => {
      console.log(`Event created successfully: ${event.htmlLink}`);
      console.log(JSON.stringify(event, null, 2));
    })
    .catch((error) => {
      console.error('Failed to create event:', error);
      process.exit(1);
    });
}

module.exports = createEvent;
