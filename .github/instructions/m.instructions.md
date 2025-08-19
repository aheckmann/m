---
applyTo: "bin/m"
---

# LLM Code Review Guidelines for `m` (Bash)

These instructions guide an automated reviewer to evaluate changes in this repository, with special focus on the Bash executable at `bin/m`. They codify the style, structure, and safety patterns used in the codebase.

## Goals

- Preserve existing behavior and cross-platform support (Linux and macOS).
- Maintain consistent style, naming, and logging conventions.
- Ensure safe shell practices aligned with how the current code is written (do not introduce incompatible patterns by default).
- Keep downloads, version parsing, and filesystem operations robust and predictable.

## Style and Formatting

- Bash options: extended globbing is enabled (`shopt -s extglob`) and used; do not disable or break it.
- Indentation: two spaces; no tabs.
- Function names: lower_snake_case, concise and action-oriented (e.g., `install_bin`, `display_help`).
- Global constants/config: UPPER_SNAKE_CASE (e.g., `M_PREFIX`, `VERSIONS_DIR`, `VERSION`).
- Locals/temporaries: lowercase, prefer `local` within functions (`local version=$1`).
- Blank lines: separate logical blocks and before/after function definitions.
- Comments:
  - Use `#` lines above functions to explain purpose and simple usage.
  - Use section headers like `### Setup` or `# Handle arguments` for structure.
  - Keep comments short, action-focused, and in the same style as existing ones.

## Logging, Errors, and Output

- Use the provided helpers consistently:
  - `log` for normal progress messages (stdout).
  - `debug` for debug-only output (stderr).
  - `abort` to print an error and exit nonzero; prefer it for fatal conditions.
  - `abort_not_installed` for version-not-installed cases.
- Prefer `printf` over `echo` for predictable formatting.
- Keep JSON output valid (no trailing commas, correct brackets). Follow `display_versions`/`display_tools_versions` patterns.

## CLI/Dispatch Conventions

- Main argument handling is via a `case` on `$1` with aliases (e.g., `ls|list|available|avail`). Maintain existing alias patterns.
- Help/version options: `-h|--help|help`, `-V|--version` are supported; preserve and update help text when adding user-facing commands.
- For commands that act on versions, accept release series such as `X.Y` as well as full `X.Y.Z` and `-ent` flavors where applicable.

## Version and Regex Handling

- Use existing helpers for comparisons:
  - `verlt`, `verlte`, `vergte` (which rely on `sort -V`).
  - `numeric_version` for `X.Y.Z` to padded integer.
- When matching versions, prefer portable ERE classes like `[0-9]` instead of `\d` (GNU `grep -E` does not treat `\d` as a digit). Ensure regexes are anchored or made specific to avoid accidental matches.
- Keep the distinction between “latest” (may include RCs) and “stable” (no RCs) consistent with existing code paths.

## Networking and Downloads

- Downloader abstraction: `$GET` is set once to stream output (either `curl -sSLf` or `wget -q -O-`).
  - Use `$GET URL | tar ...` for streaming downloads (as done in `download`).
- Preserve existing failure handling: check exit statuses, and on failure clean up and print actionable messages (see `download`, `install_tools_bin`).
- Respect `CACHE`, `CACHE_SRC`, and `CACHE_EXPIRY` behavior when touching version metadata caching.
- When calling public APIs (e.g., GitHub), support optional `GH_TOKEN` for authenticated requests as shown.

## OS/Distro/Arch Detection

- Continue to use `get_distro_and_arch` to populate `os`, `arch`, `sslbuild`, and `distros`.
- Don’t duplicate distro-mapping logic; prefer centralizing changes in `get_distro_and_arch` if needed.

## Filesystem, Symlinks, and Hooks

- Create directories with `mkdir -p` and check for permissions; fail early with `abort` when needed.
- Use `ln -fs` to (re)point symlinks and binaries; preserve use of extglob to exclude tools when appropriate.
- Clean temporary build directories with `cleanup` on both success and failure paths.
- Maintain hook semantics:
  - `pre <event>` and `post <event>` scripts must be executable, absolute paths.
  - Use `pre`/`post` invocations around installation/activation per current code.

## Safety and Portability Checks

When reviewing changes, verify:

- Quoting and word-splitting:
  - Quote variables in tests and command invocations unless globs/word-splitting are explicitly intended (e.g., extglob list expansion).
  - Quote URLs and file paths that may contain spaces.
- Exit codes and short-circuits:
  - Check and handle non-zero exit codes; preserve `exit 0` for success paths where used.
  - Do not introduce `set -euo pipefail` globally; the codebase manages errors manually and relies on controlled short-circuits.
- No `eval`, no untrusted command construction.
- JSON/text output remains stable for consumers (e.g., scripts parsing `installed --json`).
- RC/stable selection logic still correct after changes (review regexes and sorts).
- Symlink targets always exist prior to linking; `M_BIN_DIR` is created as needed.
- Cleanup always runs on failures that create temp dirs or partial artifacts.

## Reviews of Version Discovery Logic

- Prefer using `get_all_versions` (and `get_all_tools_versions`) rather than re-fetching inside new code paths.
- Ensure that sorting is stable and uses `sort -V` or numeric field sorts comparable to existing code.
- If adding new series logic (e.g., handling future major versions), mirror stable/latest rules already present.

## Messaging and UX

- Keep messages short and consistent (e.g., "Activating: MongoDB Server X, MongoDB Database Tools Y").
- Warn clearly when PATH doesn’t include `M_BIN_DIR`.
- For macOS, preserve helpful brew hints for `mongosh` installation.

## Quick Review Checklist

Use this as a fast pass before approving:

1. Naming/structure
   - [ ] Functions lower_snake_case; globals UPPER_SNAKE_CASE; locals `local`.
   - [ ] Two-space indent; section headers/comments match existing tone.
2. Safety
   - [ ] Variables quoted unless intentional globbing/splitting.
   - [ ] No `eval`; exit codes checked; failures call `abort` and clean up.
3. Networking
   - [ ] `$GET` only used for streaming; file-writing uses explicit curl/wget handling.
   - [ ] `GH_TOKEN` respected where relevant.
4. Versions/regex
   - [ ] Use `ver*` helpers and `numeric_version` for comparisons.
   - [ ] Regex uses `[0-9]` classes, not `\d`; anchored/filtered to avoid false matches.
5. OS/Distro/Arch
   - [ ] Changes funnel through `get_distro_and_arch` if needed; Apple Silicon caveats preserved.
6. FS and hooks
   - [ ] `mkdir -p` before writes; symlinks via `ln -fs`; hooks executed around change/install.
7. Output/UX
   - [ ] JSON output well-formed; help text updated if new flags/commands added.
8. Backward compatibility
   - [ ] Aliases preserved; stable/latest semantics unchanged; existing users not broken.

## Notes on Known Footguns to Flag

- Using `$GET ... -o file` is incorrect for `wget -q -O-`; prefer explicit curl/wget file-download handling or a small helper.
- `grep -E "\\d"` isn’t portable; use `[0-9]`.
- Unquoted path variables in `rm`, `mv`, or `ln` can be dangerous; quote unless globbing intended.
- Avoid introducing `set -e` globally; it can break flows relying on manual error checks.
