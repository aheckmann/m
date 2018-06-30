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
