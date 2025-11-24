const { readFileSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');

/**
 * Find all project-local skills
 */
function findAllProjectSkills() {
  const skills = [];
  const dir = join(process.cwd(), '.claude', 'skills');

  if (!existsSync(dir)) {
    return skills;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillPath = join(dir, entry.name, 'SKILL.md');
      if (existsSync(skillPath)) {
        const content = readFileSync(skillPath, 'utf-8');
        const match = content.match(/^description:\s*(.+)$/m);

        skills.push({
          name: entry.name,
          description: match ? match[1].trim() : '',
        });
      }
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  findAllSkills: findAllProjectSkills,
};
