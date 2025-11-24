#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs');
const chalk = require('chalk');
const { checkbox } = require('@inquirer/prompts');
const { ExitPromptError } = require('@inquirer/core');
const { findAllSkills } = require('../lib/utils/skills');
const {
  generateSkillsXml,
  replaceSkillsSection,
  parseCurrentSkills,
  removeSkillsSection,
} = require('../lib/utils/agents-md');

// Show deprecation warning
console.log(chalk.yellow('⚠️  Warning: open-skilled-sdd-sync is deprecated.'));
console.log(chalk.yellow("   Use 'open-skilled-sdd sync' instead.\n"));

/**
 * Sync installed skills to AGENTS.md
 */
async function syncAgentsMd(options = {}) {
  // Create AGENTS.md if it doesn't exist
  if (!existsSync('AGENTS.md')) {
    console.log(chalk.blue('📄 Creating AGENTS.md...'));
    writeFileSync('AGENTS.md', '# Project\n\n');
    console.log(chalk.green('   ✓ Created AGENTS.md\n'));
  }

  let skills = findAllSkills();

  if (skills.length === 0) {
    console.log('No skills installed. Install skills first:');
    console.log(`  ${chalk.cyan('open-skilled-sdd')}`);
    return;
  }

  // Note: Interactive mode is no longer supported
  // Default behavior is --yes (sync all skills)
  const xml = generateSkillsXml(skills);
  const content = readFileSync('AGENTS.md', 'utf-8');
  const updated = replaceSkillsSection(content, xml);

  writeFileSync('AGENTS.md', updated);

  const hadMarkers =
    content.includes('<skills_system') || content.includes('<!-- SKILLS_TABLE_START -->');

  if (hadMarkers) {
    console.log(chalk.green(`✅ Synced ${skills.length} skill(s) to AGENTS.md`));
  } else {
    console.log(chalk.green(`✅ Added skills section to AGENTS.md (${skills.length} skill(s))`));
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes('-y') || args.includes('--yes');

  try {
    await syncAgentsMd({ yes });
  } catch (error) {
    console.error(chalk.red('Error syncing skills:'), error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { syncAgentsMd };
