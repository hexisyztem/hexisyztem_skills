// scripts/list-dida365-tasks.js
const https = require('https');

const accessToken = process.env.DIDA365_ACCESS_TOKEN;

if (!accessToken) {
    console.error('Error: DIDA365_ACCESS_TOKEN environment variable is not set.');
    process.exit(1);
}

async function request(path) {
    const options = {
        hostname: 'api.dida365.com',
        port: 443,
        path: path,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                if (res.statusCode === 200) resolve(JSON.parse(data));
                else reject(`Error ${res.statusCode}: ${data}`);
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function listAllTasks() {
    try {
        const projects = await request('/open/v1/project');
        
        if (projects.length === 0) {
            console.log('No projects found.');
            return;
        }

        console.log('你的滴答清单任务层级目录：');

        for (const project of projects) {
            const data = await request(`/open/v1/project/${project.id}/data`);
            const tasks = data.tasks || [];
            
            console.log(`
📁 ${project.name}`);
            
            if (tasks.length === 0) {
                console.log('   (空)');
                continue;
            }

            tasks.forEach((task, index) => {
                const isLastTask = index === tasks.length - 1;
                const taskPrefix = isLastTask ? '└──' : '├──';
                
                let dueStr = '';
                if (task.dueDate) {
                    const dueDate = new Date(task.dueDate);
                    dueStr = ` (截止: ${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')})`;
                }
                
                console.log(`   ${taskPrefix} 📝 ${task.title}${dueStr}`);
                
                if (task.items && task.items.length > 0) {
                    task.items.forEach((item, itemIndex) => {
                        const isLastItem = itemIndex === task.items.length - 1;
                        const itemPrefix = isLastTask 
                            ? (isLastItem ? '    └──' : '    ├──') 
                            : (isLastItem ? '│   └──' : '│   ├──');
                        
                        const statusIcon = item.status === 1 ? '✅' : '⏳';
                        console.log(`   ${itemPrefix} ${statusIcon} ${item.title}`);
                    });
                }
            });
        }
    } catch (error) {
        console.error('Failed to list tasks:', error);
    }
}

listAllTasks();