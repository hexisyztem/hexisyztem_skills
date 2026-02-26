const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = process.env.GOOGLE_CALENDAR_TOKEN_PATH || path.join(__dirname, '..', 'token.json');
const CREDENTIALS_PATH = process.env.GOOGLE_CALENDAR_CREDENTIALS_PATH || path.join(__dirname, '..', 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  
  if (!require('fs').existsSync(CREDENTIALS_PATH)) {
      throw new Error(`Credentials not found. Please place credentials.json at ${CREDENTIALS_PATH}`);
  }
  
  console.log('Opening browser for Google Calendar authorization...');
  console.log('If your browser does not open automatically, please check for any authorization prompts.');
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  console.log('Authorization successful!');
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Get Google Calendar API client
 */
async function getCalendarClient() {
    const auth = await authorize();
    return google.calendar({version: 'v3', auth});
}

module.exports = {
    getCalendarClient,
    authorize
};
