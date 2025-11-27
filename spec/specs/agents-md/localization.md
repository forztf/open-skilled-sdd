# AGENTS.md Localization Specification

**Version**: 1.1
**Status**: Active
**Last Updated**: 2025-11-25
**Related Change**: localize-agents-md-usage (IMPLEMENTED)

---

## Overview

The AGENTS.md file serves as the primary configuration file for Claude Code skills. This specification defines how the AGENTS.md file's skills section is generated and localized based on the user's system language.

---

## Requirements

### AGENT-001: Skills Section Generation
**Type**: Feature
**Priority**: 1

The system SHALL generate the skills section in AGENTS.md when:
- The file does not exist (create new file with skills section)
- The file exists but has no skills section (append skills section)
- The file exists with skills section markers (replace existing section)

**Acceptance Criteria**:
- Generated using the `generateSkillsXml()` function from `lib/utils/agents-md.js`
- Includes all installed skills found in `.claude/skills/` directory
- Maintains consistent XML structure with `<skills_system>` wrapper
- Uses proper markers: `<!-- SKILLS_TABLE_START -->` and `<!-- SKILLS_TABLE_END -->`

---

### AGENT-002: Language-Based Localization
**Type**: Feature
**Priority**: 1

The system SHALL detect the user's system language and generate the skills usage guide in that language.

**Language Detection**:
- Check environment variables: `LANG`, `LC_ALL`, `LANGUAGE`
- Fall back to `os.locale()` if environment variables not set
- Support Chinese variants: `zh_CN`, `zh-CN`, `zh_HANS` → map to `zh`
- Default to English (`en`) for all other languages

**Localization Scope**:
- Skills section title ("## Available Skills" or "## 可用技能")
- Complete usage guide block (including `<usage>` tags)
- All instructions and notes within the usage guide

**Acceptance Criteria**:
- English systems display English usage guide
- Chinese systems display Chinese usage guide
- Graceful fallback to English for unsupported languages
- No broken or mixed-language content

---

### AGENT-003: Usage Guide Content Structure
**Type**: Data
**Priority**: 1

The skills usage guide SHALL contain the following sections in order:

1. **Description**: Explanation of what skills are and their purpose
2. **How to Use Skills**: Step-by-step instructions (4 steps minimum)
3. **Usage Notes**: Important guidelines (3 notes minimum)

**Content Requirements**:
- Each section must be clearly labeled with appropriate heading
- Steps must use bullet points with `-` prefix
- Must include XML tags: `<usage>` and `</usage>`
- Must include at least one code block or example per step
- Must reference `<available_skills>` section

**Acceptance Criteria**:
- Usage guide is self-contained within `<usage>` tags
- All required sections are present
- Instructions are clear and actionable
- Examples are accurate and functional

---

### AGENT-004: Translation Resource Structure
**Type**: Data
**Priority**: 1

Translation resources SHALL be stored in `lib/localization.js` with the following structure:

```javascript
const resources = {
  en: {
    agentsSkillsTitle: '## Available Skills',
    agentsSkillsUsageGuide: `<usage>...English content...</usage>`
  },
  zh: {
    agentsSkillsTitle: '## 可用技能',
    agentsSkillsUsageGuide: `<usage>...Chinese content...</usage>`
  }
};
```

**Key Requirements**:
- `agentsSkillsTitle`: Section heading (supports markdown)
- `agentsSkillsUsageGuide`: Complete usage guide with XML tags
- Both keys MUST be present in both language resources
- Fallback to English if key is missing in requested language

**Translation Approach**:
- Whole-block translation: Entire `<usage>` block is a single translation unit
- Includes opening and closing `<usage>` tags in the translation text
- Simplifies maintenance and provides complete context for translators

**Acceptance Criteria**:
- Both English and Chinese resources contain both keys
- Translation keys return complete, properly formatted content
- Fallback mechanism works correctly

---

### AGENT-005: Backward Compatibility
**Type**: Feature
**Priority**: 2

When updating existing AGENTS.md files, the system SHALL:
- Preserve all content outside the skills section markers
- Replace only the content between markers (`<!-- SKILLS_TABLE_START -->` to `<!-- SKILLS_TABLE_END -->`)
- Handle both old XML format (`<skills_system>`) and new HTML comment format
- Update the section language based on current system locale

**Acceptance Criteria**:
- Existing AGENTS.md files update without data loss
- Only the skills section is modified
- No duplicate markers or corrupted sections
- User's custom content outside skills section is preserved

---

## Function Signature

### `generateSkillsXml(skills, lang = 'en')`

Generates the complete skills XML section for AGENTS.md.

**Parameters**:
- `skills` (Array): Array of skill objects with `name` and `description` properties
- `lang` (String, optional): Language code ('en' or 'zh'), defaults to 'en'

**Returns**:
- `String`: Complete XML-formatted skills section including `<skills_system>` wrapper

**Example**:
```javascript
const skills = [
  { name: 'openspec-proposal-creation', description: 'Creates proposals...' }
];

const xml = generateSkillsXml(skills, 'zh');
// Returns Chinese-localized XML
```

**Dependencies**:
- `lib/localization.js` for translation resources

---

## File Structure

```
AGENTS.md
└── skills_section (XML formatted)
    ├── <!-- SKILLS_TABLE_START -->
    ├── <skills_system priority="1">
    ├── ## [Localized Title]
    ├── <usage>                           ← LOCALIZED
    │   ├── [Localized description]
    │   ├── [Localized "How to use skills"]
    │   ├── [Localized steps 1-4]
    │   ├── [Localized "Usage notes"]
    │   └── [Localized notes 1-3]
    │   └── </usage>
    ├── <available_skills>
    │   └── <skill> entries
    ├── </available_skills>
    └── <!-- SKILLS_TABLE_END -->
```

---

## Testing Requirements

### Test Case 1: Chinese Language Generation
- **Setup**: System with Chinese locale (LANG=zh_CN.UTF-8)
- **Action**: Run `node bin/sync.js`
- **Expected**:
  - AGENTS.md contains Chinese title: "## 可用技能"
  - Usage guide is in Chinese
  - All steps and notes are properly localized
  - `<usage>` tags are correctly formatted

### Test Case 2: English Language Generation
- **Setup**: System with English locale (LANG=en_US.UTF-8)
- **Action**: Run `LANG=en_US.UTF-8 node bin/sync.js`
- **Expected**:
  - AGENTS.md contains English title: "## Available Skills"
  - Usage guide is in English
  - All steps and notes are properly localized
  - `<usage>` tags are correctly formatted

### Test Case 3: Backward Compatibility
- **Setup**: AGENTS.md with existing content outside skills section
- **Action**: Run `node bin/sync.js`
- **Expected**:
  - Skills section is updated/replaced
  - Content outside markers is preserved
  - No duplicate sections or corrupted formatting

### Test Case 4: Fallback Behavior
- **Setup**: System with unsupported language (LANG=fr_FR.UTF-8)
- **Action**: Run `node bin/sync.js`
- **Expected**:
  - AGENTS.md contains English usage guide (fallback)
  - No errors or warnings

---

## Error Handling

### Missing Translation Key
- **Behavior**: Use English fallback
- **Logging**: No user-facing error (silent fallback)
- **Example**: If `agentsSkillsUsageGuide` missing in Chinese resources, use English

### Invalid Language Code
- **Behavior**: Default to English
- **Logging**: No user-facing error (silent default)
- **Example**: If `lang='invalid'`, treat as 'en'

---

## Future Enhancements

Potential future improvements (not in scope for current specification):

1. **Additional Languages**: Support for Spanish, French, Japanese, etc.
2. **Skill Localization**: Localize skill names and descriptions
3. **User Override**: Allow user to specify preferred language via config
4. **Pluralization**: Support for language-specific pluralization rules
5. **RTL Languages**: Support for right-to-left languages (Arabic, Hebrew)

---

## Change History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.1 | 2025-11-25 | Updated with EARS format requirements from localize-agents-md-usage change | OpenSpec |
| 1.0 | 2025-11-25 | Initial specification for AGENTS.md localization | OpenSpec |

---

## Archive Notes

This specification was updated on 2025-11-25 with comprehensive EARS format requirements from the `localize-agents-md-usage` change. The change added:

1. **EARS Format Requirements**: All requirements now include EARS format specifications with WHEN/THEN/AND patterns
2. **Detailed Scenarios**: Specific test scenarios for Chinese and English environments
3. **Technical Implementation Details**: Complete function signatures and file modifications
4. **Translation Resource Structure**: Detailed structure for `agentsSkillsUsageGuide` key
5. **Backward Compatibility Requirements**: Specific handling for existing AGENTS.md files

The original specification was implemented successfully and the change was archived in `spec/archive/2025-11-25-localize-agents-md-usage/`.

---

**End of Specification**
