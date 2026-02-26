# MiAssistant - 米家智能家居控制系统

## 🎯 项目简介

MiAssistant 是一个基于米家（Mi Home）生态的智能家居控制与自动化系统，旨在通过脚本和 API 封装实现对米家设备的编程控制，并与滴答清单等效率工具联动，构建智能化的个人生活管理系统。

## 🚀 快速开始

### 前置要求

- Node.js >= 14.x
- 米家账号
- 至少一个米家智能设备

### 安装依赖

```bash
cd MiAssistant
npm install
```

### 配置环境变量

```bash
# 设置米家认证信息
export MIJIA_USERNAME="your_mijia_account"
export MIJIA_PASSWORD="your_mijia_password"
# 或使用 token
export MIJIA_TOKEN="your_mijia_token"
```

## 📁 项目结构

```
MiAssistant/
├── README.md                   # 项目说明文档
├── package.json                # 项目配置
├── mcp-server.js              # MCP 服务器（待实现）
├── scripts/                   # 脚本目录
│   ├── mijia-auth.js          # 认证模块（待实现）
│   ├── list-mijia-devices.js  # 设备列表（待实现）
│   ├── control-mijia-device.js # 设备控制（待实现）
│   ├── trigger-mijia-scene.js  # 场景触发（待实现）
│   └── schedule-automation.js  # 自动化引擎（待实现）
└── references/                # 参考文档
    ├── mijia-integration-plan.md  # 技术方案（待创建）
    └── mijia-api.md               # API 参考（待创建）
```

## 🛠️ 功能规划

### 已实现功能
- ✅ 项目初始化

### 开发中功能
- [ ] 米家设备认证与连接
- [ ] 设备发现与状态查询
- [ ] 设备控制（开关、亮度、温度等）
- [ ] 智能场景触发
- [ ] 与滴答清单联动自动化

## 📚 文档

详细的使用文档和 API 参考请查看 `references/` 目录。

## 🤝 贡献

本项目是个人效率管理系统的一部分，欢迎提出建议和改进。

## 📄 许可证

ISC License
