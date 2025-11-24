#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Import sync functionality
const { syncAgentsMd } = require('./sync');

/**
 * Run sync after installation
 */
async function runSync() {
  try {
    await syncAgentsMd({ yes: true });
  } catch (error) {
    log('\n⚠️  Sync skipped: ' + error.message, 'yellow');
  }
}

/**
 * Copy files recursively
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function install(options = {}) {
  log('\n🚀 Installing Open Skilled SDD for Claude Code...\n', 'bright');

  // Get target directory
  const targetDir = options.global
    ? require('os').homedir() // Global install to ~/.claude
    : process.cwd();         // Local install to ./.claude

  const claudeDir = path.join(targetDir, '.claude');
  const skillsTargetDir = path.join(claudeDir, 'skills');
  const settingsFile = path.join(claudeDir, 'settings.json');

  // Get source directory (where this package is installed)
  const packageRoot = path.join(__dirname, '..');
  const skillsSourceDir = path.join(packageRoot, 'skills');

  // Check for dry-run mode
  if (options.dryRun) {
    log('⚠️  Dry run mode - no files will be copied\n', 'yellow');
  }

  try {
    // Step 1: Create .claude directory
    log('📁 Creating .claude directory...', 'blue');
    if (!fs.existsSync(claudeDir)) {
      if (!options.dryRun) {
        fs.mkdirSync(claudeDir, { recursive: true });
      }
      log('   ✓ Created .claude/', 'green');
    } else {
      log('   ✓ .claude/ already exists', 'green');
    }

    // Step 2: Create skills directory
    if (!fs.existsSync(skillsTargetDir)) {
      if (!options.dryRun) {
        fs.mkdirSync(skillsTargetDir, { recursive: true });
      }
    }

    // Step 3: Copy skills
    log('\n📦 Installing skills...', 'blue');
    const skills = fs.readdirSync(skillsSourceDir);

    skills.forEach(skill => {
      const sourcePath = path.join(skillsSourceDir, skill);
      const targetPath = path.join(skillsTargetDir, skill);

      if (fs.statSync(sourcePath).isDirectory()) {
        if (!options.dryRun) {
          copyRecursiveSync(sourcePath, targetPath);
        }
        log(`   ✓ ${skill}`, 'green');
      }
    });

    // Step 4: Create or update settings.json
    log('\n⚙️  Configuring settings...', 'blue');
    let settings = {};

    if (fs.existsSync(settingsFile)) {
      try {
        const content = fs.readFileSync(settingsFile, 'utf8');
        settings = JSON.parse(content);
        log('   ✓ Updated existing settings.json', 'green');
      } catch (e) {
        log('   ⚠ Could not parse existing settings.json, creating new one', 'yellow');
      }
    } else {
      log('   ✓ Created settings.json', 'green');
    }

    // Ensure settings has the required structure (but don't overwrite existing config)
    if (!settings.permissions) {
      settings.permissions = {
        allow: [],
        deny: [],
        ask: []
      };
    }

    if (!options.dryRun) {
      fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    }

    // Show dry-run summary
    if (options.dryRun) {
      log('\n⚠️  Dry run complete - no files were modified\n', 'yellow');
      return;
    }

    // Success message
    log('\n✨ Installation complete!\n', 'bright');
    log('Skills installed to:', 'blue');
    log(`   ${path.relative(targetDir, skillsTargetDir)}/\n`, 'green');

    log('📚 Next steps:', 'bright');
    log('   1. Skills automatically synced to AGENTS.md ✓', 'green');
    log('   2. Start Claude Code: claude', 'blue');
    log('   3. Try: "openspec proposal for user authentication"\n', 'blue');
    log('🔗 Learn more: https://github.com/forztf/open-skilled-sdd\n', 'blue');

    // Auto-run sync after installation
    log('🔄 Syncing skills to AGENTS.md...', 'blue');
    await runSync();

  } catch (error) {
    log('\n❌ Installation failed:', 'red');
    log(`   ${error.message}\n`, 'red');
    process.exit(1);
  }
}

/**
 * Show CLI help information
 */
function showHelp() {
  log('\n🚀 Open Skilled SDD - Open Specification Driven Development', 'bright');
  log('\n使用方法：', 'blue');
  log('   open-skilled-sdd [command] [options]\n', 'reset');

  log('命令：', 'blue');
  log('   (无命令)    安装技能并自动同步到 AGENTS.md (默认)', 'reset');
  log('   install     安装技能并自动同步到 AGENTS.md', 'reset');
  log('   sync        仅同步技能到 AGENTS.md（手动同步时使用）', 'reset');
  log('   --help, -h  显示此帮助信息', 'reset');
  log('   --version   显示版本号\n', 'reset');

  log('选项：', 'blue');
  log('   --dry-run           试运行安装（不实际复制文件）', 'reset');
  log('   --global, -g        全局安装（安装到 ~/.claude/skills/）', 'reset');
  log('   --yes, -y           （已废弃）sync 默认为自动模式\n', 'reset');

  log('功能特性：', 'yellow');
  log('   • 自动创建 AGENTS.md（如不存在）', 'reset');
  log('   • 安装后自动同步所有技能到 AGENTS.md', 'reset');
  log('   • sync 命令用于手动同步（增加技能后使用）\n', 'reset');

  log('示例：', 'blue');
  log('   open-skilled-sdd              # 安装并自动同步', 'reset');
  log('   open-skilled-sdd install      # 显式安装并自动同步', 'reset');
  log('   open-skilled-sdd sync         # 仅同步（手动同步）', 'reset');
  log('   npx open-skilled-sdd          # 无需全局安装直接使用\n', 'reset');
}

/**
 * Show CLI version
 */
function showVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(pkg.version);
}

/**
 * CLI 命令路由
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Extract flags (check if first arg is a flag or command)
  const isFlag = command && command.startsWith('-');
  const actualCommand = isFlag ? undefined : command;

  const hasGlobalFlag = args.includes('--global') || args.includes('-g');
  const hasDryRunFlag = args.includes('--dry-run');
  const hasHelpFlag = args.includes('--help') || args.includes('-h');
  const hasVersionFlag = args.includes('--version') || args.includes('-v');

  // Show help
  if (hasHelpFlag) {
    showHelp();
    return;
  }

  // Show version
  if (hasVersionFlag) {
    showVersion();
    return;
  }

  // Route based on command
  switch (actualCommand) {
    case undefined:
    case 'install':
      install({
        global: hasGlobalFlag,
        dryRun: hasDryRunFlag,
      }).catch((error) => {
        log('\n❌ Install failed:', 'red');
        log(`   ${error.message}\n`, 'red');
        process.exit(1);
      });
      break;

    case 'sync':
      // Pass all args to sync (handles --yes/-y and flags after command)
      const yes = args.includes('--yes') || args.includes('-y');
      syncAgentsMd({ yes }).catch((error) => {
        log('\n❌ Sync failed:', 'red');
        log(`   ${error.message}\n`, 'red');
        process.exit(1);
      });
      break;

    default:
      log(`\n❌ Unknown command: ${actualCommand}`, 'red');
      log("   运行 'open-skilled-sdd --help' 查看可用命令\n", 'yellow');
      process.exit(1);
  }
}

// Run CLI
main();
