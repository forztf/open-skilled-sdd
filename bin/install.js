#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { t } = require('../lib/localization');

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
    log('\n' + t('skippingSync', { message: error.message }), 'yellow');
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
  log('\n' + t('installing') + '\n', 'bright');

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
    log(t('dryRunMode') + '\n', 'yellow');
  }

  try {
    // Step 1: Create .claude directory
    log(t('creatingDir'), 'blue');
    if (!fs.existsSync(claudeDir)) {
      if (!options.dryRun) {
        fs.mkdirSync(claudeDir, { recursive: true });
      }
      log(t('createdDir'), 'green');
    } else {
      log(t('dirExists'), 'green');
    }

    // Step 2: Create skills directory
    if (!fs.existsSync(skillsTargetDir)) {
      if (!options.dryRun) {
        fs.mkdirSync(skillsTargetDir, { recursive: true });
      }
    }

    // Step 3: Copy skills
    log('\n' + t('installingSkills'), 'blue');
    const skills = fs.readdirSync(skillsSourceDir);

    skills.forEach(skill => {
      const sourcePath = path.join(skillsSourceDir, skill);
      const targetPath = path.join(skillsTargetDir, skill);

      if (fs.statSync(sourcePath).isDirectory()) {
        if (!options.dryRun) {
          try {
            copyRecursiveSync(sourcePath, targetPath);
            log(t('installedSkill', { skill }), 'green');
          } catch (error) {
            log(t('copyError', { message: error.message }), 'red');
          }
        } else {
          log(t('installedSkill', { skill }), 'green');
        }
      }
    });

    // Step 4: Create or update settings.json
    log('\n' + t('configuringSettings'), 'blue');
    let settings = {};

    if (fs.existsSync(settingsFile)) {
      try {
        const content = fs.readFileSync(settingsFile, 'utf8');
        settings = JSON.parse(content);
        log(t('updatedSettings'), 'green');
      } catch (e) {
        log(t('parseError'), 'yellow');
      }
    } else {
      log(t('createdSettings'), 'green');
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
      log('\n' + t('dryRunComplete') + '\n', 'yellow');
      return;
    }

    // Success message
    log('\n' + t('installationComplete') + '\n', 'bright');
    log(t('skillsInstalledTo'), 'blue');
    log(t('skillsPath', { path: path.relative(targetDir, skillsTargetDir) }) + '\n', 'green');

    log(t('nextSteps'), 'bright');
    log(t('stepAutoSync'), 'green');
    log(t('stepStartClaude'), 'blue');
    log(t('stepTryExample') + '\n', 'blue');
    log(t('learnMore') + '\n', 'blue');

    // Auto-run sync after installation
    log(t('syncingSkills'), 'blue');
    await runSync();

  } catch (error) {
    log('\n' + t('installFailed'), 'red');
    log(`   ${error.message}\n`, 'red');
    process.exit(1);
  }
}

/**
 * Show CLI help information
 */
function showHelp() {
  log('\n' + t('cliTitle'), 'bright');
  log('\n' + t('usage'), 'blue');
  log(t('cliUsage') + '\n', 'reset');

  log(t('commands'), 'blue');
  log(t('cmdDefault'), 'reset');
  log(t('cmdInstall'), 'reset');
  log(t('cmdSync'), 'reset');
  log(t('cmdHelp'), 'reset');
  log(t('cmdVersion') + '\n', 'reset');

  log(t('options'), 'blue');
  log(t('optDryRun'), 'reset');
  log(t('optGlobal'), 'reset');
  log(t('optYes') + '\n', 'reset');

  log(t('features'), 'yellow');
  log(t('featAutoCreate'), 'reset');
  log(t('featAutoSync'), 'reset');
  log(t('featManualSync') + '\n', 'reset');

  log(t('examples'), 'blue');
  log(t('exInstall'), 'reset');
  log(t('exInstall2'), 'reset');
  log(t('exSync'), 'reset');
  log(t('exNpx') + '\n', 'reset');
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
        log('\n' + t('installFailed'), 'red');
        log(`   ${error.message}\n`, 'red');
        process.exit(1);
      });
      break;

    case 'sync':
      // Pass all args to sync (handles --yes/-y and flags after command)
      const yes = args.includes('--yes') || args.includes('-y');
      syncAgentsMd({ yes }).catch((error) => {
        log('\n' + t('syncFailed'), 'red');
        log(`   ${error.message}\n`, 'red');
        process.exit(1);
      });
      break;

    default:
      log('\n' + t('unknownCommand', { command: actualCommand }), 'red');
      log(t('commandHelp') + '\n', 'yellow');
      process.exit(1);
  }
}

// Run CLI
main();
