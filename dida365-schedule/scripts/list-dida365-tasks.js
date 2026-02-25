// scripts/list-dida365-tasks.js
const https = require('https');

async function request(path, accessToken) {
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
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Error parsing API response: ${data}`));
                    }
                } else {
                    reject(new Error(`Dida365 API error: ${res.statusCode} - ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function formatTasksOutput(result) {
    let output = '\n📋 滴答清单任务列表\n';
    output += '='.repeat(60) + '\n\n';
    
    result.forEach(project => {
        if (project.tasks.length > 0) {
            output += `📁 ${project.name} (项目ID: ${project.id})\n`;
            output += '-'.repeat(60) + '\n';
            
            project.tasks.forEach((task, index) => {
                output += `  ${index + 1}. 📝 ${task.title}\n`;
                output += `     └─ ID: ${task.id}\n`;
                
                if (task.dueDate) {
                    const date = new Date(task.dueDate);
                    output += `     └─ 截止: ${date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`;
                }
                
                if (task.items && task.items.length > 0) {
                    output += `     └─ 子任务 (${task.items.length}个):\n`;
                    task.items.forEach((item, itemIndex) => {
                        const statusIcon = item.status === 'completed' ? '✅' : '⏳';
                        output += `        ${itemIndex + 1}. ${statusIcon} ${item.title} (ID: ${item.id})\n`;
                    });
                }
                output += '\n';
            });
            output += '\n';
        }
    });
    
    return output;
}

async function listAllTasks() {
    const accessToken = process.env.DIDA365_ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error('DIDA365_ACCESS_TOKEN environment variable is not set.');
    }

    const result = [];
    try {
        const projects = await request('/open/v1/project', accessToken);
        
        if (projects.length === 0) {
            return []; // Return empty array if no projects
        }

        for (const project of projects) {
            const projectData = {
                id: project.id,
                name: project.name,
                tasks: []
            };
            const data = await request(`/open/v1/project/${project.id}/data`, accessToken);
            const tasks = data.tasks || [];
            
            if (tasks.length > 0) {
                tasks.forEach((task) => {
                    const taskData = {
                        id: task.id,
                        title: task.title,
                        dueDate: task.dueDate,
                        priority: task.priority,
                        content: task.content,
                        desc: task.desc,
                        items: []
                    };
                    
                    if (task.items && task.items.length > 0) {
                        task.items.forEach((item) => {
                            taskData.items.push({
                                id: item.id,
                                title: item.title,
                                status: item.status === 1 ? 'completed' : 'pending'
                            });
                        });
                    }
                    projectData.tasks.push(taskData);
                });
            }
            result.push(projectData);
        }
        return result;
    } catch (error) {
        throw new Error(`Failed to list tasks: ${error.message}`);
    }
}

module.exports = listAllTasks;

// Add this back for direct execution and debugging
if (require.main === module) {
    listAllTasks()
        .then(result => {
            console.log(formatTasksOutput(result));
        })
        .catch(error => {
            console.error("Error occurred:", error.message);
            process.exit(1);
        });
}