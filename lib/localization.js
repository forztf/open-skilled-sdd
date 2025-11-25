const os = require('os');

/**
 * Localization module for multi-language support
 * Detects system language and provides translated messages
 */

// Language detection based on environment variables or system locale
function detectLanguage() {
  // Check environment variables (priority)
  const langEnv = process.env.LANG || process.env.LC_ALL || process.env.LANGUAGE;

  if (langEnv) {
    // Check for Chinese variants
    if (langEnv.toLowerCase().includes('zh_cn') ||
        langEnv.toLowerCase().includes('zh-cn') ||
        langEnv.toLowerCase().includes('zh_hans')) {
      return 'zh';
    }
    // Default to English for other languages
    return 'en';
  }

  // Fallback to system locale (Node.js 18+)
  if (os.locale && typeof os.locale === 'function') {
    try {
      const locale = os.locale();
      if (locale && locale.toLowerCase().startsWith('zh')) {
        return 'zh';
      }
    } catch (e) {
      // Ignore locale detection errors
    }
  }

  // Default to English
  return 'en';
}

// Localization resources
const resources = {
  en: {
    // Install script messages
    installing: '🚀 Installing Open Skilled SDD for Claude Code...',
    dryRunMode: '⚠️  Dry run mode - no files will be copied',
    creatingDir: '📁 Creating .claude directory...',
    createdDir: '   ✓ Created .claude/',
    dirExists: '   ✓ .claude/ already exists',
    installingSkills: '📦 Installing skills...',
    installedSkill: '   ✓ {skill}',
    configuringSettings: '⚙️  Configuring settings...',
    updatedSettings: '   ✓ Updated existing settings.json',
    parseError: '   ⚠ Could not parse existing settings.json, creating new one',
    createdSettings: '   ✓ Created settings.json',
    dryRunComplete: '⚠️  Dry run complete - no files were modified',
    installationComplete: '✨ Installation complete!',
    skillsInstalledTo: 'Skills installed to:',
    skillsPath: '   {path}/',
    nextSteps: '📚 Next steps:',
    stepAutoSync: '   1. Skills automatically synced to AGENTS.md ✓',
    stepStartClaude: '   2. Start Claude Code: claude',
    stepTryExample: '   3. Try: "openspec proposal for user authentication"',
    learnMore: '🔗 Learn more: https://github.com/forztf/open-skilled-sdd',
    syncingSkills: '🔄 Syncing skills to AGENTS.md...',
    syncComplete: '✅ Synced {count} skill(s) to AGENTS.md',
    syncAddedSection: '✅ Added skills section to AGENTS.md ({count} skill(s))',
    skippingSync: '⚠️  Sync skipped: {message}',
    copyError: '   ✗ Copy error: {message}',

    // Error messages
    installFailed: '❌ Installation failed:',
    syncFailed: '❌ Sync failed:',
    copyFailed: '❌ Copy failed:',
    unknownCommand: '❌ Unknown command: {command}',
    commandHelp: "   运行 'open-skilled-sdd --help' 查看可用命令",

    // CLI help
    cliTitle: '🚀 Open Skilled SDD - Open Specification Driven Development',
    usage: 'Usage:',
    cliUsage: '   open-skilled-sdd [command] [options]',
    commands: 'Commands:',
    cmdDefault: '   (no command)    Install skills and auto-sync to AGENTS.md (default)',
    cmdInstall: '   install     Install skills and auto-sync to AGENTS.md',
    cmdSync: '   sync        Sync skills to AGENTS.md only (manual sync)',
    cmdHelp: '   --help, -h  Show help information',
    cmdVersion: '   --version   Show version number',
    options: 'Options:',
    optDryRun: '   --dry-run           Dry run installation (no files copied)',
    optGlobal: '   --global, -g        Global install (to ~/.claude/skills/)',
    optYes: '   --yes, -y           (Deprecated) sync uses auto mode by default',
    features: 'Features:',
    featAutoCreate: '   • Auto-create AGENTS.md (if not exists)',
    featAutoSync: '   • Auto-sync all skills to AGENTS.md after install',
    featManualSync: '   • sync command for manual sync (use after adding skills)',
    examples: 'Examples:',
    exInstall: '   open-skilled-sdd              # Install and auto-sync',
    exInstall2: '   open-skilled-sdd install      # Explicit install with auto-sync',
    exSync: '   open-skilled-sdd sync         # Sync only (manual)',
    exNpx: '   npx open-skilled-sdd          # Use without global install',

    // Sync script messages
    creatingAgentsMd: '📄 Creating AGENTS.md...',
    createdAgentsMd: '   ✓ Created AGENTS.md',
    noSkillsInstalled: 'No skills installed. Install skills first:',
    noSkillsCommand: '  open-skilled-sdd',
    errorSyncSkills: 'Error syncing skills:',
    warningOverwrite: '⚠️  Warning: This will replace the existing skills section in AGENTS.md',
    confirmOverwrite: 'Do you want to continue?',

    // Other messages
    syncSkipped: 'Sync skipped',
    installingTo: 'Installing to: {path}',
    globalInstall: 'Global install detected (~/.claude/)',
  },
  zh: {
    // Install script messages
    installing: '🚀 正在安装 Open Skilled SDD for Claude Code...',
    dryRunMode: '⚠️  试运行模式 - 不会实际复制文件',
    creatingDir: '📁 创建 .claude 目录...',
    createdDir: '   ✓ 已创建 .claude/',
    dirExists: '   ✓ .claude/ 已存在',
    installingSkills: '📦 正在安装技能...',
    installedSkill: '   ✓ {skill}',
    configuringSettings: '⚙️  配置设置...',
    updatedSettings: '   ✓ 已更新 settings.json',
    parseError: '   ⚠ 无法解析现有的 settings.json，将创建新的文件',
    createdSettings: '   ✓ 已创建 settings.json',
    dryRunComplete: '⚠️  试运行完成 - 未修改任何文件',
    installationComplete: '✨ 安装完成！',
    skillsInstalledTo: '技能已安装到:',
    skillsPath: '   {path}/',
    nextSteps: '📚 下一步:',
    stepAutoSync: '   1. 技能已自动同步到 AGENTS.md ✓',
    stepStartClaude: '   2. 启动 Claude Code: claude',
    stepTryExample: '   3. 尝试: "openspec proposal for user authentication"',
    learnMore: '🔗 了解更多: https://github.com/forztf/open-skilled-sdd',
    syncingSkills: '🔄 正在同步技能到 AGENTS.md...',
    syncComplete: '✅ 已同步 {count} 个技能到 AGENTS.md',
    syncAddedSection: '✅ 已添加技能章节到 AGENTS.md ({count} 个技能)',
    skippingSync: '⚠️  同步已跳过: {message}',
    copyError: '   ✗ 复制错误: {message}',

    // Error messages
    installFailed: '❌ 安装失败:',
    syncFailed: '❌ 同步失败:',
    copyFailed: '❌ 复制失败:',
    unknownCommand: '❌ 未知命令: {command}',
    commandHelp: "   运行 'open-skilled-sdd --help' 查看可用命令",

    // CLI help
    cliTitle: '🚀 Open Skilled SDD - 开放式规范驱动开发',
    usage: '用法:',
    cliUsage: '   open-skilled-sdd [命令] [选项]',
    commands: '命令:',
    cmdDefault: '   (无命令)    安装技能并自动同步到 AGENTS.md (默认)',
    cmdInstall: '   install     安装技能并自动同步到 AGENTS.md',
    cmdSync: '   sync        仅同步技能到 AGENTS.md (手动同步时使用)',
    cmdHelp: '   --help, -h  显示此帮助信息',
    cmdVersion: '   --version   显示版本号',
    options: '选项:',
    optDryRun: '   --dry-run           试运行安装（不实际复制文件）',
    optGlobal: '   --global, -g        全局安装（安装到 ~/.claude/skills/）',
    optYes: '   --yes, -y           （已废弃）sync 默认为自动模式',
    features: '功能特性:',
    featAutoCreate: '   • 自动创建 AGENTS.md（如不存在）',
    featAutoSync: '   • 安装后自动同步所有技能到 AGENTS.md',
    featManualSync: '   • sync 命令用于手动同步（增加技能后使用）',
    examples: '示例:',
    exInstall: '   open-skilled-sdd              # 安装并自动同步',
    exInstall2: '   open-skilled-sdd install      # 显式安装并自动同步',
    exSync: '   open-skilled-sdd sync         # 仅同步（手动同步）',
    exNpx: '   npx open-skilled-sdd          # 无需全局安装直接使用',

    // Sync script messages
    creatingAgentsMd: '📄 创建 AGENTS.md...',
    createdAgentsMd: '   ✓ 已创建 AGENTS.md',
    noSkillsInstalled: '未安装任何技能。请先安装技能:',
    noSkillsCommand: '  open-skilled-sdd',
    errorSyncSkills: '同步技能时出错:',
    warningOverwrite: '⚠️  警告: 这将替换 AGENTS.md 中现有的技能章节',
    confirmOverwrite: '是否继续?',

    // Other messages
    syncSkipped: '同步已跳过',
    installingTo: '安装到: {path}',
    globalInstall: '检测到全局安装 (~/.claude/)',
  }
};

// Current language
const currentLang = detectLanguage();

/**
 * Translate a key with optional placeholders
 * @param {string} key - Translation key
 * @param {object} placeholders - Object with placeholder values
 * @returns {string} Translated text
 */
function t(key, placeholders = {}) {
  const langResources = resources[currentLang] || resources.en;
  let text = langResources[key] || resources.en[key] || key;

  // Replace placeholders
  Object.keys(placeholders).forEach(placeholder => {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), placeholders[placeholder]);
  });

  return text;
}

module.exports = {
  t,
  currentLang,
  detectLanguage,
};
