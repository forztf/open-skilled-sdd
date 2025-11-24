<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
当用户要求您执行任务时，请检查以下可用技能是否能够更有效地完成任务。技能提供专门的功能和领域知识。

如何使用技能：
- 使用 `file_search` 查找技能文件：`file_search(query="**/skills/<skill-name>/SKILL.md")`
- 使用 `read_file` 从发现的路径加载技能内容
- 按照技能文件中的说明完成任务
- 输出中提供的基础目录用于解析捆绑资源（references/、scripts/、assets/）

使用说明：
- 仅使用下面列出的技能
- 不要调用已经在您的上下文中加载的技能
- 每个技能调用都是无状态的
</usage>

<available_skills>

<skill>
<name>skill-creator</name>
<description>创建有效技能的指南。当用户想要创建一个新技能（或更新现有技能）来扩展Claude的能力，使其具备专门的知识、工作流程或工具集成时，应使用此技能。</description>
<location>project</location>
</skill>

<skill>
<name>vscode-research</name>
<description>'VS Code提示与指令系统专家'</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>