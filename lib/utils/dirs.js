const { join } = require('path');
const { homedir } = require('os');

/**
 * Get skills directory path
 */
function getSkillsDir(projectLocal = false) {
  return projectLocal
    ? join(process.cwd(), '.claude', 'skills')
    : join(homedir(), '.claude', 'skills');
}

/**
 * Get all searchable skill directories
 * Priority: project .claude > global .claude
 */
function getSearchDirs() {
  return [
    join(process.cwd(), '.claude', 'skills'),  // 1. Project local
    join(homedir(), '.claude', 'skills'),       // 2. Global
  ];
}

module.exports = {
  getSkillsDir,
  getSearchDirs,
};
