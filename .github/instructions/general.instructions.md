---
applyTo: "**/*"
---

# General Instructions for m Repository

## About the Project

`m` is a MongoDB version management tool written in Bash. It helps users download, install, and manage multiple versions of MongoDB server and command-line tools.

## Key Characteristics

- **Primary Language**: Bash scripting (bin/m is the main executable)
- **Cross-platform**: Supports Linux and macOS (including Apple Silicon)
- **Package Manager**: Distributed via npm but implemented as a Bash script
- **Testing**: Node.js-based test suite (test/suite.mjs)

## Core Principles

1. **Minimal Dependencies**: The tool should work with standard Unix utilities and Bash
2. **Cross-platform Compatibility**: Changes must work on both Linux and macOS
3. **Backward Compatibility**: Preserve existing behavior and CLI interface
4. **Safety First**: Handle errors gracefully, validate inputs, and clean up on failures

## Development Guidelines

### Code Changes

- Follow existing code style and conventions (see file-specific instructions)
- Test on both Linux and macOS when possible
- Ensure all existing tests pass before submitting changes
- Add tests for new functionality when appropriate

### Documentation

- Keep README.md up to date with CLI changes
- Use clear, concise language suitable for technical users
- Include examples for new features
- Follow the existing documentation structure and tone

### Testing

- Run the test suite with `npm test` before submitting changes
- Test manually with actual MongoDB downloads when modifying installation logic
- Verify cross-platform behavior for platform-specific changes

## File Organization

- `bin/m` - Main Bash executable
- `test/` - Node.js test suite
- `.github/instructions/` - Copilot AI instructions for code review
- `README.md` - User-facing documentation
- `CONTRIBUTING.md` - Contribution guidelines

## Common Tasks

- **Version Bumping**: Update VERSION variable in bin/m and version in package.json
- **Adding CLI Commands**: Update help text, case statement, and add tests
- **Documentation Updates**: Keep README.md in sync with code changes

## Safety and Security

- Never expose credentials or API tokens
- Validate all user inputs
- Use quotes around variables to prevent word splitting issues
- Clean up temporary files and directories on failure
- Check exit codes and handle errors appropriately
