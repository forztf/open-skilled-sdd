/**
 * Extract field from YAML frontmatter
 */
function extractYamlField(content, field) {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : '';
}

/**
 * Validate SKILL.md has proper YAML frontmatter
 */
function hasValidFrontmatter(content) {
  return content.trim().startsWith('---');
}

module.exports = {
  extractYamlField,
  hasValidFrontmatter,
};
