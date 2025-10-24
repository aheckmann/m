# Copilot Instructions

This directory contains instructions for GitHub Copilot and other AI coding assistants to help maintain code quality and consistency in this repository.

## Instruction Files

Each instruction file includes a YAML frontmatter section that specifies which files the instructions apply to using glob patterns.

### `general.instructions.md`
**Applies to**: `**/*` (all files)

Provides general context about the project:
- Project overview and characteristics
- Core development principles
- Guidelines for code changes, documentation, and testing
- File organization
- Safety and security practices

### `m.instructions.md`
**Applies to**: `bin/m` (main Bash script)

Detailed guidelines for the main Bash executable:
- Style and formatting conventions
- Logging and error handling patterns
- CLI/dispatch conventions
- Version and regex handling
- Networking and downloads
- OS/distro/arch detection
- Filesystem operations and hooks
- Safety and portability checks
- Quick review checklist

### `docs.instructions.md`
**Applies to**: `/**/*.md` (all Markdown files)

Documentation-specific guidelines:
- Focus on clarity and accuracy
- Maintain consistency with `.editorconfig` settings
- Special handling for tables, code blocks, and frontmatter

## Related Files

### `.editorconfig`
Defines code formatting standards for various file types in the repository. The documentation instructions reference this file to ensure consistency.

## How It Works

When GitHub Copilot or similar AI assistants work on files in this repository, they automatically read and apply the relevant instructions based on the `applyTo` patterns. This helps ensure:

1. **Consistency**: All changes follow established patterns
2. **Safety**: Critical checks and validations are not bypassed
3. **Quality**: Code reviews catch common issues
4. **Context**: AI has necessary background about the project

## Maintaining Instructions

When updating these instructions:
1. Keep the YAML frontmatter with `applyTo` patterns
2. Be specific and actionable
3. Include examples where helpful
4. Test that the instructions improve code quality
5. Keep them focused on guidance that can be applied programmatically

## References

- [GitHub Copilot Instructions Documentation](https://gh.io/copilot-coding-agent-tips)
- [EditorConfig Specification](https://editorconfig.org)
