# m

 [visionmedia](https://github.com/visionmedia/n)s flavor of binary management, ported for MongoDB.

## Installation

    $ npm install -g m

or

    $ make install

### Installing Binaries

Install a few versions, the version given becomes the active mongodb binary once installation is complete.

    $ m 2.0.7
    $ m 2.2.0-rc2

List installed binaries:

    $ m

      2.0.6
    ο 2.0.7
      2.2.0-rc2

Use or install the latest official release:

    $ m latest

Use or install the stable official release:

    $ m stable

Install a custom or patched version of mongodb from a tarball:

    $ m custom 2.1.2-me https://github.com/aheckmann/mongo/tarball/r2.1.2

### Removing Binaries

Remove some versions:

    $ m rm 2.2.0-rc1

Instead of using `rm` we can simply use `-`:

    $ m - 2.2.0-rc1

### Binary Usage

When running multiple versions of mongodb, we can target
them directly by asking `m` for the binary path:

    $ m bin 2.0.7
    /usr/local/m/versions/2.0.7/bin/

Execute a script with 2.0.7 regardless of the active version:

    $ m use 2.0.7 some.js

with flags:

    $ m as 2.0.7 --debug some.js
    
When installing or changing the active version we might want to run custom scripts:

    $ m pre install /path/to/my/script
    $ m post install /path/to/script
    $ m pre change /path/to/my/script
    $ m post change /path/to/script
    
List all post change hooks:

    $ m post change
    
To remove a pre install hook:

    $ m pre install rm /path/to/script
    
Remove all post install hooks:

    $ m post install rm

## Usage

Output from `m --help`:

  Usage: m [options] [COMMAND] [config]

  Commands:

    m                            Output versions installed
    m latest [config ...]        Install or activate the latest mongodb release
    m stable [config ...]        Install or activate the latest stable mongodb release
    m <version> [config ...]     Install and/or use mongodb <version>
    m custom <version> <tarball> [config ...]  Install custom mongodb <tarball> with [args ...]
    m use <version> [args ...]   Execute mongodb <version> with [args ...]
    m bin <version>              Output bin path for <version>
    m rm <version ...>           Remove the given version(s)
    m --latest                   Output the latest mongodb version available
    m --stable                   Output the latest stable mongodb version available
    m ls                         Output the versions of mongodb available
    m pre <event> [script]       Declare one or list scripts to execute before <event> (scripts must use absolute paths)
    m post <event> [script]      Declare one or list scripts to execute after <event> (scripts must use absolute paths)
    m pre <event> rm [script]    Remove pre <event> script
    m post <event> rm [script]   Remove post <event> script

  Events:

    change   Occurs when switching mongodb versions
    install  Occurs when installing a previously uninstalled mongodb version

  Options:

    -V, --version   Output current version of m
    -h, --help      Display help information

  Aliases:

    -       rm
    which   bin
    use     as
    list    ls
    custom  c

## Details

 `m` by default installs mongodb to _/usr/local/m/versions_, from
 which it can see what you have currently installed, and activate previously installed versions of mongodb when `m <version>` is invoked again.

 Activated mongodb versions are then installed to the prefix _/usr/local_, which of course may be altered via the __M_PREFIX__ environment variable.

 To alter where `m` operates simply export __M_PREFIX__ to whatever you prefer.

## License

[LICENSE](https://github.com/aheckmann/m/blob/master/LICENSE)

## Inspiration

Yes tj, this is nearly identical to [n](https://github.com/visionmedia/n). Huge thanks!

