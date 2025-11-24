# Test AGENTS.md

Test file for open-skilled-sdd sync command.

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Use `file_search` to find the skill file: `file_search(query="**/skills/<skill-name>/SKILL.md")`
- Use `read_file` to load the skill content from the discovered path
- Follow the instructions in the skill file to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>openspec-archiving</name>
<description>Archives completed changes and merges specification deltas into living documentation. Use when changes are deployed, ready to archive, or specs need updating after implementation. Triggers include "openspec archive", "archive change", "merge specs", "complete proposal", "update documentation", "finalize spec", "mark as done".</description>
</skill>

<skill>
<name>openspec-archiving-cn</name>
<description>归档已完成的变更并将规范差异合并到常驻文档。用于变更已部署、准备归档或实施后需要更新规范时。触发词包括 "openspec归档", "归档", "归档提案", "合并规范", "完成提案", "更新文档", "定稿规范", "标记完成"。</description>
</skill>

<skill>
<name>openspec-context-loading</name>
<description>Loads project context, lists existing specs and changes, searches capabilities and requirements. Use when user asks about project state, existing specs, active changes, available capabilities, or needs context discovery. Triggers include "openspec context", "what specs exist", "show changes", "list capabilities", "project context", "find specs", "what's in the spec", "show me specs".</description>
</skill>

<skill>
<name>openspec-context-loading-cn</name>
<description>加载项目上下文，列出现有规范与变更，搜索能力与需求。用于用户询问项目状态、现有规范、进行中的变更、可用能力或需要发现上下文时。触发词包括"openspec上下文", "有哪些规范", "显示变更", "列出能力", "项目上下文", "查找规范", "规范包含什么", "展示规范"。</description>
</skill>

<skill>
<name>openspec-implementation</name>
<description>Implements approved specification proposals by working through tasks sequentially with testing and validation. Use when implementing changes, applying proposals, executing spec tasks, or building from approved plans. Triggers include "openspec implement", "implement", "apply change", "execute spec", "work through tasks", "build feature", "start implementation".</description>
</skill>

<skill>
<name>openspec-implementation-cn</name>
<description>以测试与验证为先的方式，按序执行并实现已批准的规范提案。用于实施变更、应用提案、执行规范任务或按已批准计划构建。触发词包括 "openspec开发", "开发", "实施" "实现提案", "应用变更", "执行规范", "按顺序完成任务", "构建功能", "开始实施"。</description>
</skill>

<skill>
<name>openspec-proposal-creation</name>
<description>Creates structured change proposals with specification deltas for new features, breaking changes, or architecture updates. Use when planning features, creating proposals, speccing changes, introducing new capabilities, or starting development workflows. Triggers include "openspec proposal", "create proposal", "plan change", "spec feature", "new capability", "add feature planning", "design spec".</description>
</skill>

<skill>
<name>openspec-proposal-creation-cn</name>
<description>通过openspec规范驱动的方法创建结构化的变更提案与规范差异。用于规划功能、创建提案、编写规范、引入新能力或启动开发流程。触发词包括 "openspec提案", "规划", "创建提案", "规划变更", "规范功能", "新功能", "新特性", "新需求", "添加功能规划", "设计规范"。</description>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
