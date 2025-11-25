# CLI Commands Specification: install Command

This document specifies the `install` command behavior for open-skilled-sdd, including localization support.

## install Command

`open-skilled-sdd install` - Installs skills to project-local or global configuration

### Requirement: Install command scans for available skills
当用户执行 install 命令时，
系统应扫描技能源目录并识别所有可用的技能。

#### Scenario: Discovers available skills
假设技能源目录存在并包含 8 个技能包
当用户运行 `open-skilled-sdd install`
那么系统发现所有 8 个技能包
并按字母顺序安装它们。

#### Scenario: Skills source directory structure
假设技能源目录包含以下子目录结构：
- openspec-archiving/
- openspec-archiving-cn/
- openspec-context-loading/
- openspec-context-loading-cn/
- openspec-implementation/
- openspec-implementation-cn/
- openspec-proposal-creation/
- openspec-proposal-creation-cn/
当系统扫描技能源目录时，
那么系统识别每个子目录为一个技能
并且只处理目录（忽略文件）。

---

### Requirement: Install command creates .claude directory structure
当 install 命令执行时，
系统应创建必要的 `.claude` 目录结构来存储技能。

#### Scenario: Creates .claude directory
假设目标位置不存在 `.claude` 目录
当用户运行 install 命令
那么系统创建 `.claude/` 目录
并且设置适当的权限。

#### Scenario: .claude directory already exists
假设目标位置已经存在 `.claude` 目录
当用户运行 install 命令
那么系统跳过目录创建
并且显示已存在的确认消息。

#### Scenario: Creates skills subdirectory
假设 `.claude` 目录已创建
当系统复制技能文件时，
那么系统创建 `.claude/skills/` 子目录
IF 该子目录不存在。

---

### Requirement: Install command copies skill files
当 install 命令执行时，
系统应将技能文件从源目录递归复制到目标目录。

#### Scenario: Recursively copies skill directory
假设有一个技能目录包含 SKILL.md 和 templates/ 子目录
当系统处理该技能时，
那么系统递归复制整个目录结构
保持原始的文件层次关系。

#### Scenario: Preserves file permissions
当系统复制文件时，
那么系统保留原始文件的权限设置
AND 确保目标文件具有适当的读写权限。

#### Scenario: Handles copy errors gracefully
假设在复制过程中发生错误（如权限问题或磁盘满）
当系统遇到复制错误时，
那么系统显示清晰的错误消息
并且优雅地处理错误而不中断整个过程。

---

### Requirement: Install command manages settings.json
系统应创建或更新 `.claude/settings.json` 文件以配置技能权限。

#### Scenario: Creates new settings.json
假设目标位置没有 settings.json 文件
当 install 命令完成技能复制后，
那么系统创建 `.claude/settings.json`
并且包含默认的权限结构：
```json
{
  "permissions": {
    "allow": [],
    "deny": [],
    "ask": []
  }
}
```

#### Scenario: Updates existing settings.json
假设 settings.json 已存在
当 install 命令执行时，
那么系统读取现有文件
并且保留现有配置
AND 添加缺失的权限结构（如果权限键不存在）。

#### Scenario: Handles invalid settings.json
假设 settings.json 存在但包含无效的 JSON 格式
当系统尝试解析文件时，
那么系统检测到解析错误
并且显示警告消息
AND 创建新的 settings.json 以替换损坏的文件。

---

### Requirement: Install command supports dry-run mode
当用户提供 --dry-run 标志时，
系统应模拟安装过程而不实际复制任何文件。

#### Scenario: Dry-run installation
当用户运行 `open-skilled-sdd install --dry-run`
那么系统显示试运行模式警告
AND 执行所有检查（扫描技能、检查目录）
BUT 不创建任何目录
AND 不复制任何文件
AND 在结束时显示试运行完成消息。

#### Scenario: Shows what would be done
在试运行模式下，
当系统处理每个步骤时，
那么系统显示通常会执行的操作消息
（如 "Would create .claude/", "Would copy 8 skills"）
使用当前语言设置的消息。

---

### Requirement: Install command supports global installation
当用户提供 --global 或 -g 标志时，
系统应将技能安装到全局配置目录(~/.claude/skills/)。

#### Scenario: Global installation to home directory
当用户运行 `open-skilled-sdd install --global`
那么系统将技能安装到 `~/.claude/skills/`
而不是当前工作目录。

#### Scenario: Short form global flag
当用户运行 `open-skilled-sdd install -g`
那么系统行为与 --global 标志相同
并且安装到全局目录。

#### Scenario: Local vs global path display
当安装完成时，
系统显示安装路径为相对于目标目录的路径
在本地化输出中显示。

---

### Requirement: Install command auto-runs sync
安装完成后，
系统应自动同步技能到 AGENTS.md 文件。

#### Scenario: Auto-sync after installation
假设 install 成功完成
当技能复制完成后，
那么系统自动调用 sync 功能
将已安装的技能同步到 AGENTS.md。

#### Scenario: Sync failure does not break install
假设 install 成功但 sync 遇到错误
当 sync 失败时，
那么 install 命令显示警告消息
AND 仍然完成安装过程
AND 以状态码 0（成功）退出。

---

### Requirement: Install command localization
所有用户可见消息 SHALL 根据检测到的系统语言显示对应语言。

#### Scenario: Install displays messages in Chinese
GIVEN 系统语言检测为中文 (zh)
WHEN 用户运行 install 命令
THEN 所有输出消息显示为中文，包括：
  - 安装进度消息（"正在安装..."）
  - 目录创建消息（"创建 .claude 目录..."）
  - 技能安装消息（"正在安装技能..."）
  - 完成消息（"安装完成！"）
  - 错误消息（"安装失败:"）

#### Scenario: Install displays messages in English
GIVEN 系统语言检测为英文 (en)
WHEN 用户运行 install 命令
THEN 所有输出消息显示为英文，包括：
  - 安装进度消息（"Installing..."）
  - 目录创建消息（"Creating .claude directory..."）
  - 技能安装消息（"Installing skills..."）
  - 完成消息（"Installation complete!"）
  - 错误消息（"Installation failed:"）

#### Scenario: Localized help information
GIVEN 系统语言检测为中文
WHEN 用户运行 `open-skilled-sdd install --help`
THEN 帮助信息以中文显示，包括：
  - CLI 标题（"开放式规范驱动开发"）
  - 用法说明
  - 命令列表及描述
  - 选项说明
  - 功能特性
  - 示例

---

### Requirement: Install command displays next steps
安装完成后，
系统应显示下一步操作指引以帮助用户开始使用。

#### Scenario: Displays next steps after installation
当 install 成功完成时，
那么系统显示：
1. Skills automatically synced to AGENTS.md ✓
2. Start Claude Code: claude
3. Try example command: "openspec proposal for user authentication"

#### Scenario: Localized learn more link
在下一步指引后，
系统显示本地化消息：
- 中文: "了解更多: https://github.com/forztf/open-skilled-sdd"
- 英文: "Learn more: https://github.com/forztf/open-skilled-sdd"

---

### Requirement: Install command error handling
当执行过程中发生错误时，
系统应提供清晰的错误消息并优雅退出。

#### Scenario: Permission denied error
当系统尝试创建目录但权限不足时，
那么系统显示：
「中文」"❌ 安装失败: Permission denied"
「英文」"❌ Installation failed: Permission denied"
并且以状态码 1 退出。

#### Scenario: Source directory not found
假设技能源目录不存在
当系统尝试扫描技能时，
那么系统显示错误消息指示源目录问题
并且优雅退出。

#### Scenario: Invalid command-line arguments
当用户提供未知命令或无效参数时，
那么系统显示：
「中文」"❌ 未知命令: {command}"
「英文」"❌ Unknown command: {command}"
并且显示帮助信息指引。

---

### Requirement: Install command shows version information
当用户提供 --version 标志时，
系统应显示当前版本号。

#### Scenario: Shows version number
当用户运行 `open-skilled-sdd install --version`
或 `open-skilled-sdd --version`
那么系统显示 package.json 中定义的版本号（例如 "1.0.1"）
并且不执行安装操作。

#### Scenario: Version command works before installation
当用户运行版本命令时，
只要 package.json 文件可读，
系统应能显示版本号
无需执行任何安装步骤。

---

### Requirement: Color-coded terminal output
系统应使用颜色编码的终端输出来提升用户体验，使不同类型的消息易于区分。

系统 SHALL 使用 ANSI 颜色代码为不同类型的消息应用颜色：
  - 蓝色 (\x1b[34m): 用于进度提示和操作标题
  - 绿色 (\x1b[32m): 用于成功消息和已完成的操作
  - 黄色 (\x1b[33m): 用于警告和试运行模式提示
  - 红色 (\x1b[31m): 用于错误消息和失败信息
  - 亮白色 (\x1b[1m): 用于重要标题和强调文本

#### Scenario: Displays colored progress messages
当用户运行 install 命令时，
在看到 "📁 创建 .claude 目录..." 消息时，
系统以蓝色显示该消息。

#### Scenario: Displays colored success messages
当某个操作成功完成时，
例如 "   ✓ .claude/ 已存在"，
系统以绿色显示该消息。

#### Scenario: Displays colored warning messages
当系统处于试运行模式时，
警告消息 "⚠️  试运行模式 - 不会实际复制文件" 以黄色显示。

#### Scenario: Displays colored error messages
当发生错误时，
例如 "❌ 安装失败:"，
系统以红色显示错误消息和错误详情。

#### Scenario: Displays colored help information
当用户请求帮助信息时，
CLI 标题 "🚀 Open Skilled SDD - ..." 以亮白色显示，
命令类别标题以蓝色显示，
功能特性标题以黄色显示，
以提高可读性。

---

## ADDED Requirements for Localization

### Requirement: Install command localization
Install 命令 SHALL 根据检测到的系统语言显示所有用户可见消息。

WHEN 用户执行 install 命令时，
系统 SHALL 使用本地化函数显示所有消息，
包括：安装进度消息、目录创建消息、技能安装消息、设置配置消息、试运行消息、成功消息、下一步提示、帮助信息、错误消息。

#### Scenario: Install command displays Chinese messages
GIVEN 系统语言检测为中文 (zh)
WHEN 用户运行 install 命令
THEN 所有输出消息显示为中文，包括：
  - 安装进度消息（"正在安装..."）
  - 目录创建消息（"创建 .claude 目录..."）
  - 技能安装消息（"正在安装技能..."）
  - 完成消息（"安装完成！"）
  - 错误消息（"安装失败:"）

#### Scenario: Install command displays English messages
GIVEN 系统语言检测为英文 (en)
WHEN 用户运行 install 命令
THEN 所有输出消息显示为英文，包括：
  - 安装进度消息（"Installing..."）
  - 目录创建消息（"Creating .claude directory..."）
  - 技能安装消息（"Installing skills..."）
  - 完成消息（"Installation complete!"）
  - 错误消息（"Installation failed:"）

#### Scenario: Localized help information
GIVEN 系统语言检测为中文
WHEN 用户运行 `open-skilled-sdd install --help`
THEN 帮助信息以中文显示，包括：
  - CLI 标题（"开放式规范驱动开发"）
  - 用法说明
  - 命令列表及描述
  - 选项说明
  - 功能特性
  - 示例

