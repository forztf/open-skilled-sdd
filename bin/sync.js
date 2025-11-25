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
const { t } = require('../lib/localization');

/**
 * Sync installed skills to AGENTS.md
 */
async function syncAgentsMd(options = {}) {
  // Create AGENTS.md if it doesn't exist
  if (!existsSync('AGENTS.md')) {
    console.log(chalk.blue(t('creatingAgentsMd')));
    writeFileSync('AGENTS.md', '# Project\n\n');
    console.log(chalk.green(t('createdAgentsMd') + '\n'));
  }

  let skills = findAllSkills();

  if (skills.length === 0) {
    console.log(t('noSkillsInstalled'));
    console.log(`  ${chalk.cyan(t('noSkillsCommand'))}`);
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
    console.log(chalk.green(t('syncComplete', { count: skills.length })));
  } else {
    console.log(chalk.green(t('syncAddedSection', { count: skills.length })));
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes('-y') || args.includes('--yes');

  try {
    await syncAgentsMd({ yes });
  } catch (error) {
    console.error(chalk.red(t('errorSyncSkills')), error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { syncAgentsMd };
