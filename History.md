1.9.1 / 2025-03-29
==================
 * Use GitHub token from the environment for API requests if present (@gmishkin)
 * Allow curl errors to bubble up to the terminal to help troubleshoot (@gmishkin)
 * Add support for Amazon Linux 2023 (@JamesHeppenstall)
 * Add support for Pop_OS! linux (@toto-dev)

1.9.0 / 2024-03-17
==================
 * Fix: #78: Add version-based support for native arm64 Database Tools on macOS
 * Fix: #95: Add info on installing mongosh via brew for macOS users

1.8.9 / 2023-10-19
==================
 * Remove shell prompt from install examples so it doesn't get copied
 * Fix #93: Download of MongoDB 4.2 binaries on Ubuntu 22.04

1.8.8 / 2023-10-17
==================
 * Add distro detection for KDE Neon (based on Ubuntu LTS)

1.8.7 / 2023-09-27
==================
 * Use "curl -s" (silent) instead of "curl -#" (@mpobrien)

1.8.6 / 2023-09-20
==================
 * Update detection for Ubuntu 22 and RHEL9

1.8.5 / 2023-09-13
==================
 * Fix error message when using GNU egrep (@charlievieth)
 * Docs: git:// should be replaced with https:// (@michaelstruening)

1.8.4 / 2022-11-04
==================
 * Update detection for supported Linux distros as at MongoDB 6.0

1.8.3 / 2022-11-03
==================
 * Fix `m ls` error
 * Correct some overly generous release version matches

1.8.2 / 2022-10-03
==================
 * `m latest` now outputs correct version

1.8.1 / 2022-07-29
==================
 * Database tools are not available for macOS arm64 yet; install x86_64 instead
 * Remove messages suggesting Shell is always installed
 * Add link to mongosh if activating 6.0.0+ server release

1.8.0 / 2022-07-26
==================
 * Use full.json download list instead of legacy /src/ directory
 * Adjust --stable for 5.0+ versioning scheme
 * Add version-based support for native arm64 binaries on macOS
 * Replace `m custom` with info on supported platforms and building from source
 * Warn if $M_PREFIX/bin isn't included in current $PATH
 * Add missing Active version indicator
 * Fix bug preventing multiple versions from being removed
 * Check bin path using `mongod` (`mongo` is no longer included in 6.0 GA)
 * Fix matching of latest/stable versions

1.7.0 / 2021-11-19
==================
 * Update M_PREFIX behaviour to default to a writeable directory (~/.local)
 * Add support for installing on Apple Silicon with Rosetta 2
 * Fix for ANSI colour coding not working with printf in bash 3.2

1.6.0 / 2021-01-21
==================
 * Fix detection of 4.4+ Enterprise versions (@alcaeus)
 * Add support for standalone database tools: `m tools ...` (@tfogo)
 * Add Debian 10 support (@p)
 * Correct placement of the `--legacy` parameter in help example (@mbroadst)

1.5.6 / 2019-10-14
==================
 * Add distro detection for Fedora

1.5.5 / 2019-09-09
==================
 * Add distro detection for Linux Mint (@alexbevi)

1.5.4 / 2019-06-11
==================
 * Fix #52: Problem setting up on Amazon Linux 1

1.5.3 / 2019-04-12
==================
 * Fix #51: m incorrectly installs RCs for `m 4.0`
 * Improve package name check for macOS Enterprise downloads
 * Add message if version to remove was not actually installed
 * Add caching option via M_CACHE environment variable
 * Enable debug output via M_DEBUG environment variable
 * Add `m reinstall <version>`

1.5.2 / 2019-03-04
==================
 * Fix macOS Enterprise downloads for 4.1.1+
 * Support `m install <version>`
 * Add missing test for successful $builddir creation

1.5.1 / 2018-08-16
==================
 * Add targeted version checks for macOS naming conventions with support for MongoDB 4.1.x

1.5.0 / 2018-08-14
==================
 * Add Linux distribution-specific versions #40 (thanks [Oleg Pudeyev](https://github.com/p), [Kev Pulo](https://github.com/devkev), and [Kevin Adistambha](https://github.com/kevinadi)!). Where possible `m` will try to download Linux distro-specific tarballs which include extras like SSL support. Use `m --legacy <version>` to install the generic Linux version.
 * Support filtering available versions with `m ls <release series>` (eg: `m ls 3.6`)
 * Add `available` as an alias for `ls` (for consistency with mongodb-version-manager)
 * Include `m` version number in usage info

1.4.1 / 2018-07-11
==================
 * Add aliases aligned with standard binary names: `m mongo|mongod|mongos <version>`
 * Add `m sh` as an alias for `m shell|mongo <version>`
 * Add `m lls` as an alias for `m installed`

1.4.0 / 2018-06-30
==================
 * fixed; Insecure temporary file use #38
 * fixed; Handle the case of no installed versions when listing installed versions #35
 * changed; Default installation prompt to yes #36
 * changed; Use symlinks instead of copying binaries #46
 * added; Prompt to allow removing the current MongoDB version #30
 * added; Support aliases for MongoDB release series (for example: `m 3.6`) #34
 * added; `m use stable` and `m use latest` aliases #37
 * added; note about using `yes` for download without confirmation  #27

Thanks to [stennie](https://github.com/stennie) and [Oleg Pudeyev](https://github.com/p) for their contributions.

1.3.3 / 2018-06-04
==================
 * fixed; MongoDB 4.0.0-rc# macOS binaries not found #32 [stennie](https://github.com/stennie)

1.3.2 / 2017-11-01
==================
 * added; `m installed [--json]` Output installed versions available (optionally, in JSON format) #28 [stennie](https://github.com/stennie)

1.3.1 / 2016-11-05
==================

 * fixed; sort ordering of version numbers #25 from JamesKovacs
 * fixed; getcwd warnings #24 from VictorDenisov

1.3.0 / 2016-08-30
==================

 * added enterprise version support `m 3.2.3-ent` #20 from Dabz

1.2.2 / 2016-08-30
==================

 * Generalize cp for BSD+GNU #23 from vmenajr

1.2.1 / 2016-06-23
==================

 * fixed; check_current_version to display version 3.2.7 with OpenSSL correctly #22 [kevinadi](https://github.com/kevinadi)

1.2.0 / 2016-05-23
==================

 * change; Download OS X binaries with SSL support where available #21 [stennie](https://github.com/stennie)

1.1.0 / 2015-09-18
==================

 * added; mongos support #19 from [sindbach](https://github.com/sindbach)

1.0.1 / 2015-01-04
==================

 * fix 'm ls' warning #17 [gianpaj](https://github.com/gianpaj)

1.0.0 / 2014-12-01
==================

 * fixed; sort versions properly #16 [gianpaj](https://github.com/gianpaj)

0.2.6 / 2013-10-11
==================

 * minor: fixing my mistake in version regex #15 [brandonblack](https://github.com/brandonblack)

0.2.5 / 2013-10-07
==================

 * minor: relaxing the version regex #14 [brandonblack](https://github.com/brandonblack)
 * docs; mention scons dependency
 * Update README.md

0.2.4 / 2013-03-19
==================

  * fixed; removal of multiple versions #11

0.2.3 / 2013-03-07
==================

  * fixed; handle weird format of 2.4.0.rc1 tag

0.2.2 / 2013-01-29
==================

  * fixed; do not trigger hooks when already active #10

0.2.1 / 2013-01-22
==================

  * better logging
  * fix cp errors #9

0.2.0 / 2013-01-20
==================

  * build from source when config is passed
  * install using pre-built binaries
  * remove "-" alias

0.1.2 / 2012-12-13
==================

  * confirm from user before installation

0.1.1 / 2012-09-04
==================

  * added; m src <version>
  * added; m shell <version>

0.1.0 / 2012-09-04
==================

  * `use` should launch mongod not mongo shell (#7) [matulef](https://github.com/matulef)

0.0.3 / 2012-08-29
==================

  * fixed; ubuntu support (#5)

0.0.2 / 2012-08-27
==================

  * added pre/post install/change hooks

0.0.1 / 2012-08-25
==================

  * initial release
