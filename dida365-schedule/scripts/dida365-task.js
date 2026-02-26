// dida365-create-schedule/scripts/dida365-task.js
const https = require('https');

async function createTask(title, options = {}) {
    const accessToken = process.env.DIDA365_ACCESS_TOKEN || process.env.TICKTICK_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error('DIDA365_ACCESS_TOKEN environment variable is not set. Please set it.');
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
                        resolve(data);
                    } catch (e) {
                        reject(new Error(`Error parsing Dida365 API response: ${e.message}`));
                    }
                } else {
                    reject(new Error(`Dida365 API error: ${res.statusCode} - ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Failed to connect to Dida365 API: ${error.message}`));
        });

        req.write(postData);
        req.end();
    });
}

module.exports = createTask;

if (require.main === module) {
    const title = process.argv[2];
    const optionsStr = process.argv[3];
    let options = {};
    if (optionsStr) {
        options = JSON.parse(optionsStr);
    }
    createTask(title, options).then(res => console.log("Success:", JSON.stringify(res))).catch(err => { console.error(err); process.exit(1); });
}
