const { ModelContextProtocolServer } = require('@modelcontextprotocol/sdk');
const createTask = require('./scripts/dida365-task');
const listAllTasks = require('./scripts/list-dida365-tasks');

// 创建一个新的 MCP 服务器实例
const server = new ModelContextProtocolServer();

// 定义 createTask 工具
server.registerTool({
  name: 'createDida365Task',
  description: 'Creates a new task or schedule in Dida365 (TickTick China).',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the task.',
      },
      options: {
        type: 'object',
        description: 'Optional task properties like projectId, dueDate, priority, etc.',
        properties: {
          projectId: {
            type: 'string',
            description: 'The ID of the project the task belongs to (required by Dida365 API).',
          },
          dueDate: {
            type: 'string',
            description: 'The due date and time of the task in ISO 8601 format (e.g., "2026-03-05T14:00:00+0800").',
          },
          priority: {
            type: 'number',
            description: 'The priority level (0: None, 1: Low, 3: Medium, 5: High).',
            enum: [0, 1, 3, 5],
          },
          isAllDay: {
            type: 'boolean',
            description: 'Set to true for all-day events.',
          },
          timeZone: {
            type: 'string',
            description: 'The timezone of the startDate and dueDate (e.g., "Asia/Shanghai").',
          },
          content: {
            type: 'string',
            description: 'A short description or notes for the task.',
          },
          desc: {
            type: 'string',
            description: 'A longer, rich text description for the task.',
          }
        },
        required: ['projectId'], // projectId is explicitly required by Dida365 API
        additionalProperties: true, // Allow other Dida365 API parameters
      },
    },
    required: ['title'],
  },
  execute: async ({ title, options }) => {
    try {
      const result = await createTask(title, options);
      return { success: true, task: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
});

// 定义 listDida365Tasks 工具
server.registerTool({
  name: 'listDida365Tasks',
  description: 'Lists all incomplete tasks and subtasks from Dida365, structured by projects. Requires DIDA365_ACCESS_TOKEN.',
  parameters: {
    type: 'object',
    properties: {}, // No parameters for this tool
  },
  execute: async () => {
    try {
      const tasks = await listAllTasks();
      return { success: true, projects: tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
});

// 启动 MCP 服务器
server.listen(process.argv[2] || 8080); // 监听由 Gemini CLI 提供的端口，或默认 8080