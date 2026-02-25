// dida365-create-schedule/scripts/dida365-task.js
const https = require('https');

async function createTask(title, options = {}) {
    const accessToken = process.env.DIDA365_ACCESS_TOKEN || process.env.TICKTICK_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error('DIDA365_ACCESS_TOKEN environment variable is not set. Please set it using: export DIDA365_ACCESS_TOKEN="YOUR_DIDA365_ACCESS_TOKEN"');
    }

    if (!options.projectId) {
        throw new Error('projectId is required by Dida365 OpenAPI for task creation. Please provide it in the options JSON.');
    }

    const apiUrl = 'api.dida365.com';
    const apiPath = '/open/v1/task';

    const body = {
        title: title,
        ...options
    };

    const postData = JSON.stringify(body);

    const requestOptions = {
        hostname: apiUrl,
        port: 443,
        path: apiPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Bearer ${accessToken}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(requestOptions, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const data = responseData ? JSON.parse(responseData) : {};
                        console.log('Successfully created Dida365 task:');
                        console.log(JSON.stringify(data, null, 2));
                        resolve(data);
                    } catch (e) {
                        console.error('Error parsing Dida365 API response:', e);
                        reject(e);
                    }
                } else {
                    console.error(`Error creating Dida365 task: ${res.statusCode} - ${responseData}`);
                    reject(new Error(`Dida365 API error: ${res.statusCode} - ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('Failed to connect to Dida365 API:', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Example usage when run directly:
if (require.main === module) {
    const args = process.argv.slice(2);
    const taskTitle = args[0];

    if (!taskTitle) {
        console.error('Usage: node dida365-task.js "<task title>" [optional_json_options]');
        console.error('Example: node dida365-task.js "Buy groceries" \'{"projectId": "YOUR_PROJECT_ID", "dueDate": "2026-03-01T10:00:00+0800", "priority": 5}\'');
        process.exit(1);
    }

    let options = {};
    if (args[1]) {
        try {
            options = JSON.parse(args[1]);
        } catch (e) {
            console.error('Error: Invalid JSON for optional arguments:', e);
            process.exit(1);
        }
    }

    createTask(taskTitle, options).catch((e) => {
        console.error(e.message);
        process.exit(1);
    }); // Ensure process exits on unhandled rejection
}

// For future use, if the agent wants to require this script and call the function directly
module.exports = createTask;
