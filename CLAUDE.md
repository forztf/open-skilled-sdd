# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供关于本代码库的操作指引。

## 项目概述

**open-skilled-sdd** 是一个 JavaScript/Node.js 项目，为 AI 编程助手提供开放式规范驱动开发工作流技能。它实现了多种方法论（OpenSpec、PRPs、Spec Kit、spec-workflow-mcp、BMad-Method、6A 工作流）作为可组合的技能，供 Claude Code 和其他 AI 助手使用。

## 核心命令

### 开发与测试
```bash
# 运行测试（安装过程的试运行）
npm test

# 安装技能到当前项目（创建 .claude/skills/ 目录）
node bin/install.js

# 试运行安装（不实际复制文件）
node bin/install.js --dry-run

# 全局安装（创建 ~/.claude/skills/ 目录）
node bin/install.js --global

# 通过 npm 二进制命令安装（全局安装后可用）
open-skilled-sdd
```

### 安装方式
- **本地安装**: `node bin/install.js` - 复制技能到 `.claude/skills/`
- **全局安装**: `node bin/install.js --global` - 复制到 `~/.claude/skills/`
- **NPM 二进制**: `open-skilled-sdd`（全局 npm 安装后可用）
- **插件安装**: 通过 Claude Code 市场使用 `/plugin marketplace add forztf/open-skilled-sdd`

## 架构与结构

### 核心技能框架
项目实现了 8 个双语技能（4 个英文 + 4 个中文）：

1. **openspec-proposal-creation** / **openspec-proposal-creation-cn**
   - **触发词**: "openspec proposal", "openspec plan" / "openspec提案", "openspec需求"
   - **用途**: 创建结构化的变更提案，使用 EARS 需求语法
   - **模板**: 提案、任务、规范差异模板

2. **openspec-implementation** / **openspec-implementation-cn**
   - **触发词**: "openspec implement", "openspec build" / "openspec开发"
   - **用途**: 执行已批准的提案，包含测试和进度跟踪
   - **特性**: 任务顺序执行、验证、进度报告

3. **openspec-archiving** / **openspec-archiving-cn**
   - **触发词**: "openspec archive" / "openspec归档"
   - **用途**: 归档已完成的变更并合并规范差异
   - **输出**: 创建已实施规范的归档

4. **openspec-context-loading** / **openspec-context-loading-cn**
   - **触发词**: "openspec context", "what specs exist" / "openspec上下文", "有哪些规范"
   - **用途**: 加载项目上下文并发现现有规范
   - **发现**: 列出活跃的规范、变更、能力

每个技能包含：
- `SKILL.md` - 包含触发词和使用示例的文档
- `templates/` - 可复用的提案、任务、规范差异模板
- `reference/` - EARS 格式指南、验证模式、示例
- 渐进式披露设计（每技能少于 500 行）

### 关键目录
- `skills/` - 核心技能实现（双语）
- `bin/install.js` - 主安装脚本
- `openskills/` - 通用技能加载器（独立项目）
- `.claude-plugin/` - Claude Code 插件配置
- `template/` - 模板文件（AGENTS.md）

### 技能设计原则
- **EARS 格式**: Easy Approach to Requirements Syntax（简易需求语法方法）
- **触发词**: 激活每个技能的特定短语
- **可组合性**: 技能可独立或协同工作
- **双语支持**: 完整的英文/中文支持
- **渐进式披露**: 每技能少于 500 行

### 安装脚本逻辑
`bin/install.js` 脚本：
1. **目标检测**: 确定安装目录（本地 `.claude/skills/` 或全局 `~/.claude/skills/`）
2. **目录创建**: 创建 `.claude/` 结构并设置适当权限
3. **文件复制**: 递归复制技能文件，保持目录结构
4. **配置管理**: 更新 `.claude/settings.json` 中的技能权限
5. **验证**: 试运行模式可在不实际复制的情况下验证
6. **错误处理**: 全面的错误检查和用户反馈

**关键特性**:
- 支持本地和全局两种安装模式
- 保留文件权限和目录结构
- 创建/升级 `.claude/settings.json` 并配置技能
- 提供彩色终端输出，提升用户体验

### 技能开发指南
在实现或修改技能时：
1. 保持中英文版本同步
2. 文档保持在 500 行以内
3. 在 SKILL.md 中包含清晰的触发词
4. 遵循现有的目录结构
5. 先用 `--dry-run` 测试安装

## Important Notes
- **Node.js Version**: >=14.0.0 required
- **Skills Framework**: Designed specifically for Claude Code Skills framework with AGENTS.md compatibility
- **Installation Impact**:
  - Local: Affects only current project (creates `.claude/skills/`)
  - Global: Affects all projects using Claude Code (creates `~/.claude/skills/`)
- **Directory Structure**: Installation creates `.claude/skills/[skill-name]/` with SKILL.md and related files
- **Settings Integration**: Updates `.claude/settings.json` with skill permissions and configuration
- **Testing Strategy**: No unit tests - validation through dry-run installation testing
- **File Distribution**: Package includes only `bin/`, `skills/`, `.claude-plugin/`, and documentation files
- **Plugin Configuration**: `.claude-plugin/plugin.json` defines 8 skills for marketplace distribution

## Development Workflow
1. **Skill Modification**: Edit files in `skills/[skill-name]/` directory
2. **Bilingual Updates**: Always update both English and Chinese versions
3. **Testing**: Use `npm test` or `node bin/install.js --dry-run` to validate changes
4. **Installation**: Test local installation with `node bin/install.js` before committing
5. **Documentation**: Keep SKILL.md files under 500 lines with clear trigger words
6. **Version Management**: Update version in package.json for releases