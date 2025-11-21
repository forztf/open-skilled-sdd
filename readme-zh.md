# Open Spec-Driven Development Skills（open-skilled-sdd)

[English Version](./readme.md)

**通过开放的规范驱动开发（Spec-driven development for AI coding assistants）提升 AI 编码助手，采用Claude Code Skills思路，兼容支持AGENTS.md的各类CLI、IDE的AI 编码助手。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 为什么？

当AI 编码助手生成的代码或文档让人失望时，搞不清是因为：

1. 大模型的能力有问题。
2. AI 编码助手有问题：提供不合适的上下文（包括系统提示词）。
3. 我写的提示词有问题。

重点从“2.AI 编码助手的问题”突破，但因为各CLI、IDE的AI 编码助手内置的规范驱动开发方法（上下文工程、系统提示词等）是不公开的，基本是黑盒，无从分析、自行优化。我找了各种**开放**的规范驱动开发方案，如6A工作流、PRPs、Spec Kit、OpenSpec、spec-workflow-mcp、BMad-Method等，看看那个最适合，再着手自行优化。粗略用了这些方案，发现各有优劣，第一个想法是搞个大而全的方案，融合各方案的优点，去除各方案中我认为不适合的地方，很快就发现走不通，这个想法就是各AI 编码助手现在在做的航道，我不可能比这些厂商做得更好，而且从哲学的角度，一个大而全的方案（有限的能力）是不可能都适应各类场景（无限的场景）。这时Claude Code Skills出来了，我发现这个思路好，无限的skill不就能适应无限的场景？同时我找到了[skilled-spec](https://github.com/mahidalhan/skilled-spec)。

我的想法就是，将OpenSpec、PRPs、Spec Kit、spec-workflow-mcp、BMad-Method、6A工作流等，包括以后出现的好的规范驱动开发方法，转为各个可组合的技能Skill，开放且可自行优化。

## 技能

| 方法论           | 技能                              | 触发词                                               | 目的                           |
| ---------------- | --------------------------------- | ---------------------------------------------------- | ------------------------------ |
| openspec         | **openspec-proposal-creation**    | "openspec proposal"、"openspec plan"                 | 生成带 EARS 需求的结构化提案   |
|                  | **openspec-implementation**       | "openspec implement"、"openspec build"               | 以测试与进度跟踪的方式执行任务 |
|                  | **openspec-archiving**            | "openspec archive"                                   | 合并规范差异并创建归档         |
|                  | **openspec-context-loading**      | "openspec what specs exist"、"openspec show changes" | 发现规范、搜索需求、展示仪表盘 |
| openspec（中文） | **openspec-proposal-creation-cn** | "openspec提案"、"openspec需求"                       | 生成带 EARS 需求的结构化提案   |
|                  | **openspec-implementation-cn**    | "openspec开发"                                       | 以测试与进度跟踪的方式执行任务 |
|                  | **openspec-archiving-cn**         | "openspec归档"                                       | 合并规范差异并创建归档         |
|                  | **openspec-context-loading-cn**   | "openspec有哪些规范"、"openspec显示变更"             | 发现规范、搜索需求、展示仪表盘 |
|                  |                                   |                                                      |                                |

每个技能都在其 `SKILL.md` 文件中具备详细文档。

## 安装

**直接复制到项目（Claude Code，简单）**：

1. 将本项目 `skills/`下的所有子目录复制到项目的 `.claude/skills/`
2. 提交到版本控制
3. 团队克隆后自动获得技能

**直接复制到全局（Claude Code，简单）**：

1. 将本项目 `skills/`下的所有子目录复制到 `~/.claude/skills/`

**基于插件（Claude Code，自动更新）**：

1. 安装私有的 marketplace 仓库：  
   在Claude Code中输入`/plugin marketplace add forztf/open-skilled-sdd`
2. 安装插件：  
   在Claude Code中输入
`/plugin`  
-> `1. Browse and install plugins`  
-> `open-skilled-sdd-marketplace`  
-> 按空格选中  
->  按 `i` 安装。  
或用命令安装
    ```
    /plugin install open-skilled-sdd@open-skilled-sdd-marketplace
    ```

## 许可证

MIT License - 参见 [LICENSE](LICENSE)

## 鸣谢

- **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** - 方法论与 CLI 工具
- **[Anthropic](https://www.anthropic.com)** - Claude Code 与技能框架
- **[EARS](https://alistairmavin.com/ears/)** - 需求语法
- **[skilled-spec](https://github.com/mahidalhan/skilled-spec)** - 原英文版本
- **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** - OpenSpec 在修改现有行为（1→n）时表现出色。

## 链接

- [Claude Code 文档](https://code.claude.com/docs/zh-CN/overview)
- [Claude 技能最佳实践](https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices)
- [OpenSpec](https://github.com/Fission-AI/OpenSpec)
