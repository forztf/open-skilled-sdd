# CLI Commands Specification

This document specifies the command-line interface (CLI) for open-skilled-sdd.

**Related Changes**:
- `localize-agents-md-usage` (2025-11-25): Implemented AGENTS.md usage guide localization
- See archive: `spec/archive/2025-11-25-localize-agents-md-usage/`

## sync Command

`open-skilled-sdd sync` - Synchronizes project-local skills to AGENTS.md

**技术说明**: 代码中导入了 `@inquirer/prompts` 和 `@inquirer/core` 库，
但这些导入是为了向后兼容保留的。在 v1.3.0 版本中，交互模式已被移除，
系统默认使用非交互的自动同步模式。

### Requirement: Sync command scans for project skills
当用户执行 sync 命令时，
系统应扫描且仅扫描项目级别的已安装技能。

#### Scenario: Discovers project skills
假设 `.claude/skills/` 目录存在并包含 3 个已安装的技能
当用户运行 `open-skilled-sdd sync`
那么系统发现并识别出这 3 个项目级别技能
并且排除全局技能扫描路径。

#### Scenario: No skills installed
假设 `.claude/skills/` 目录不存在或为空
当用户运行 `open-skilled-sdd sync`
那么系统显示提示信息："No skills installed. Install skills first"
并且不执行同步操作。

#### Scenario: Mixed level skills (global ignored)
假设项目有 2 个本地技能
当用户运行 `open-skilled-sdd sync`
那么系统只扫描 `.claude/skills/` 目录
并且只发现这 2 个项目级别技能（不扫描全局路径）。

### Requirement: Sync command auto-sync mode (non-interactive)
**注意**: 交互模式已在 v1.3.0 版本中被移除。当前版本仅支持自动同步模式。

当用户运行 sync 命令时（无论是否提供 --yes 标志），
系统应自动同步所有已安装的技能到 AGENTS.md，
不再显示交互式选择界面。

#### Scenario: Automatically syncs all skills by default
假设用户有 3 个已安装的技能
当用户运行 `open-skilled-sdd sync`
那么系统不显示交互界面
并且自动同步所有 3 个技能到 AGENTS.md
并且显示成功消息。

#### Scenario: --yes flag is deprecated but still works
假设有 4 个已安装的技能
当用户运行 `open-skilled-sdd sync --yes`
那么系统行为与默认模式相同
自动同步所有 4 个技能到 AGENTS.md
并且显示成功消息。

#### Scenario: -y shorthand flag still works
假设有 2 个已安装的技能
当用户运行 `open-skilled-sdd sync -y`
那么系统行为与默认模式相同
自动同步所有 2 个技能到 AGENTS.md
并且显示成功消息。

#### Reason for removal
WHEN 在 v1.3.0 之前的版本中支持交互模式，
BUT 该功能使用率低且增加了代码复杂性，
SO 开发团队决定移除交互模式，
AND 将所有 sync 操作改为自动模式（相当于 --yes）。

#### Backward compatibility
系统 SHOULD 保持 --yes 和 -y 参数识别
SO 旧脚本不会中断
BUT 实际行为与默认模式一致（自动同步所有技能）。

### Requirement: Old non-interactive mode (deprecated)
**注意**: 此要求已被移除。在 v1.3.0+ 版本中，--yes 和 -y 参数保持向后兼容但不影响行为。

### Requirement: AGENTS.md parsing functionality
当 sync 命令执行时，
系统应能够解析现有 AGENTS.md 文件中的技能部分
并且识别当前已包含的技能。

#### Scenario: Parses AGENTS.md with skills section
假设 AGENTS.md 包含技能部分和 2 个技能
当系统读取 AGENTS.md
那么系统正确识别出 2 个已存在的技能。

#### Scenario: Parses AGENTS.md without skills section
假设 AGENTS.md 不包含技能部分
当系统读取 AGENTS.md
那么系统将当前技能列表视为空。

#### Scenario: AGENTS.md does not exist
假设项目中没有 AGENTS.md 文件
当 sync 命令执行
那么系统显示 "No AGENTS.md to update" 消息
并且不执行同步。

### Requirement: AGENTS.md update functionality
当用户确认同步后，
系统应更新 AGENTS.md 文件
并且正确维护技能部分的格式。

#### Scenario: Adds new skills to AGENTS.md
假设 AGENTS.md 已经存在但没有技能部分
当用户同步 3 个技能
那么系统在 AGENTS.md 中添加技能部分
并且包含所有 3 个技能的正确 XML 格式
并且不包含 location 属性
并且以 ASCII 排序显示技能名称。

#### Scenario: Updates existing skills section
假设 AGENTS.md 已经有 2 个技能的技能部分
当用户选择同步 4 个技能（包含原有的 2 个）
那么系统替换技能部分内容
并且更新为 4 个技能的正确信息
并且不包含 location 属性。

#### Scenario: Removes all skills
假设 AGENTS.md 有技能部分
当用户取消所有选择
那么系统完全移除 AGENTS.md 中的技能部分
并且保留文件的其余内容不变。

### Requirement: Skill information display
当 sync 命令显示技能列表时，
系统应以清晰的格式显示技能信息
并且不包含 location 属性或标识。

#### Scenario: Displays skills without location
假设有 3 个已安装的技能，按名称字母顺序为：
  - skill-a
  - skill-b
  - skill-c
当 sync 命令显示技能列表
那么显示顺序为：
  1. skill-a
  2. skill-b
  3. skill-c
并且不显示任何 level 标识或 location 信息。

### Requirement: AGENTS.md XML format without location
当 sync 命令生成 AGENTS.md 的 XML 时，
生成的 skill 条目不应包含 location 属性。

#### Scenario: Generates XML without location
假设用户同步 2 个技能
当系统生成 AGENTS.md 的 XML 内容
那么每个 skill 元素包含：
  - <name> 标签
  - <description> 标签
  - 不包含 <location> 标签

---

### Requirement: Color-coded terminal output with chalk library
系统应使用 chalk 库提供颜色编码的终端输出，使消息层次清晰。

Sync 命令 SHALL 使用 chalk 库为不同类型的消息应用颜色：
  - chalk.blue(): 用于信息和进度消息（如 "Creating AGENTS.md..."）
  - chalk.green(): 用于成功消息（如同步完成消息）
  - chalk.cyan(): 用于命令提示（如 "open-skilled-sdd"）
  - chalk.red(): 用于错误消息
  - chalk.yellow(): 用于警告消息（弃用警告）

#### Scenario: Displays chalk-colored creation messages
当 AGENTS.md 不存在时，
系统使用 chalk.blue() 显示 "📄 Creating AGENTS.md..."，
创建成功后使用 chalk.green() 显示 "   ✓ Created AGENTS.md"。

#### Scenario: Displays chalk-colored command prompts
当提示用户安装技能时，
命令 "open-skilled-sdd" 使用 chalk.cyan() 显示
以便用户容易识别可执行的命令。

#### Scenario: Displays chalk-colored success messages
当同步成功完成时，
消息 "Synced 8 skill(s) to AGENTS.md" 使用 chalk.green() 显示。

### Requirement: Command-line interface
当用户安装 open-skilled-sdd 包后，
系统应提供 `open-skilled-sdd sync` 命令
并且支持标准的命令行参数。

#### Scenario: Runs sync command
假设 open-skilled-sdd 已全局安装
当用户终端输入 `open-skilled-sdd sync`
那么系统执行 sync 命令
并且显示交互式或自动同步结果。

#### Scenario: Runs command with parameters
当用户输入 `open-skilled-sdd sync --yes`
那么系统识别 --yes 参数
并且以非交互模式执行。

#### Scenario: Views help information
当用户输入 `open-skilled-sdd sync --help`
那么系统显示 sync 命令的使用说明
并且显示可用的参数选项。

### Requirement: Error handling and user-friendly messages
当执行过程中发生错误时，
系统应提供友好的错误消息
并且优雅地处理退出。

#### Scenario: Permission error
当系统尝试写入 AGENTS.md 但权限不足
那么系统显示清晰的错误消息："Permission denied: unable to write to AGENTS.md"
并且建议用户检查文件权限。

#### Scenario: AGENTS.md format corruption
当 AGENTS.md 包含损坏的技能部分标记
那么系统检测到格式问题
并且显示警告消息提示用户检查文件
或者在可能时自动修复。

#### Scenario: Unknown command-line arguments
当用户提供未知的参数
那么系统显示错误消息列出可用参数
并且提示正确的使用方式。

---

## ADDED Requirements for Localization

### Requirement: Sync command localization
sync 命令 SHALL 根据检测到的系统语言显示所有用户可见消息。

WHEN 用户执行 sync 命令时，
系统 SHALL 使用本地化函数显示所有消息，
包括：弃用警告、AGENTS.md 创建消息、技能发现消息、同步进度消息、成功消息、错误消息。

#### Scenario: Sync displays messages in Chinese
GIVEN 系统语言检测为中文 (zh)
WHEN 用户运行 sync 命令
THEN 所有输出消息显示为中文，包括：
  - 警告消息（"警告: open-skilled-sdd-sync 已弃用"）
  - AGENTS.md 创建消息（"创建 AGENTS.md..."）
  - 技能发现消息（"未安装任何技能"）
  - 同步进度消息（"已同步 8 个技能到 AGENTS.md"）
  - 错误消息（"同步技能时出错"）

#### Scenario: Sync displays messages in English
GIVEN 系统语言检测为英文 (en)
WHEN 用户运行 sync 命令
THEN 所有输出消息显示为英文，包括：
  - 警告消息（"Warning: open-skilled-sdd-sync is deprecated"）
  - AGENTS.md 创建消息（"Creating AGENTS.md..."）
  - 技能发现消息（"No skills installed"）
  - 同步进度消息（"Synced 8 skill(s) to AGENTS.md"）
  - 错误消息（"Error syncing skills"）

#### Scenario: Sync deprecation warning localization
GIVEN 系统运行旧版 sync 脚本 (bin/sync.js)
WHEN 脚本启动时，
THEN 系统根据检测到的语言显示弃用警告：
  - 中文: "⚠️  警告: open-skilled-sdd-sync 已弃用。"
  - 英文: "⚠️  Warning: open-skilled-sdd-sync is deprecated."
AND 显示建议使用新命令的消息：
  - 中文: "   请使用 \"open-skilled-sdd sync\" 代替。"
  - 英文: "   Use 'open-skilled-sdd sync' instead."
