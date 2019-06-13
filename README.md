# m - MongoDB Version Manager

`m` helps you download, use, and manage multiple versions of the MongoDB server
and command-line tools.

This can be useful for development & testing environments. For example, testing
release upgrades/downgrades or potential behavior differences between versions.

Where possible `m` will try to download the distro-specific binaries for your
O/S and version. If a binary appears to be unavailable, `m` will ask if you want
to try building from source.

NOTE: [Building MongoDB from source](https://github.com/mongodb/mongo/wiki/Build-Mongodb-From-Source)
requires you to preinstall all of the relevant dependencies & toolchain to build
the desired version of MongoDB. Installing those is outside the scope of what
`m` does.

## Prerequisites

To install binary packages `m` requires a 64-bit O/S which:
 - is a [Supported Platform for the version of MongoDB you are trying to install](https://docs.mongodb.com/manual/administration/production-notes/#supported-platforms)
 - includes the `bash` shell

Environments that should work include:
 - Linux (RHEL/CentOS, Debian/Ubuntu, Amazon Linux)
 - macOS 10.11 (El Capitan) and later
 - Windows 10 with [Ubuntu on Windows](https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6?activetab=pivot%3Aoverviewtab)
 - Docker using a supported Linux distro

## Installation

`m` is a `bash` script which can be installed & updated via `npm` for convenience:

    $ npm install -g m

or installed by cloning the GitHub repo and running `make install`:

    $ git clone git://github.com/aheckmann/m.git && cd m && make install

or fetched via `wget` and copied to a location of your choice:

    $ wget https://raw.githubusercontent.com/aheckmann/m/master/bin/m && chmod +x ./m

### Downloading MongoDB Binaries

Specify a MongoDB server version to try download a binary package (if available for your current O/S) or switch to a previously downloaded copy. After `m` successfully downloads or switches to a specified version of MongoDB, those binaries will become the default in the install path (typically `/usr/local/bin/`; see _Details_ below for more information).

    $ m 3.2.16
    $ m 3.4.9

You can also specify a release series to download the latest available revision:

    $ m 3.6
    $ m 4.0

List installed binaries:

    $ m

      3.2.16
    ο 3.4.9
      3.6.0-rc1

Use or download the latest official release:

    $ m latest

Use or download the stable official release:

    $ m stable

Check what the latest available release is:

    $ m --latest
    $ m --latest 3.6

Check what the current stable release is:

    $ m --stable
    $ m --stable 3.6

Download a custom or patched version of MongoDB from a tarball:

    $ m custom 3.5.13-me https://github.com/mongodb/mongo/tarball/r3.5.13

Download and build a version of MongoDB from source (NOTE: assumes [build requirements](https://github.com/mongodb/mongo/wiki/Build-Mongodb-From-Source) are installed):

    $ m 3.6.5 source

Download an Enterprise release:

    $ m 3.4.9-ent

Select a MongoDB version without prompting for confirmation if a download is required:

    $ yes | m 4.0.0

### Removing Binaries

Remove some previously installed versions:

    $  m rm 3.2.16 3.5.13-me

### Binary Usage

Multiple versions of MongoDB can be downloaded and targeted directly.

Ask `m` for the binary path for a specific version that has already been downloaded:

    $ m bin 3.4.9
    /usr/local/m/versions/3.4.9/bin/

Ask `m` for the binary path for the latest revision of a release already downloaded:

    $ m bin 3.6
    /usr/local/m/versions/3.6.5/bin/

Start up `mongod` 3.4.9 regardless of the active version:

    $ m use 3.4.9 --port 29000 --dbpath /data/3.4.9/

Execute a script with the 3.4.9 `mongo` shell regardless of the active version:

    $ m shell 3.4.9 some.js

Execute a script with a 3.4.9 `mongo` shell and some additional flags:

    $ m shell 3.4.9 --port 29000 --norc

When installing or changing the active version you might want to run custom scripts:

    $ m pre install /path/to/my/script
    $ m post install /path/to/script
    $ m pre change /path/to/my/script
    $ m post change /path/to/script

Multiple scripts may be added for any event. To add two `pre change` scripts:

    $ m pre change /path/to/script1
    $ m pre change /path/to/script2

Scripts are executed in the order they were added.

List all pre change hooks:

    $ m pre change

    /path/to/script1
    /path/to/script2

List all post install hooks:

    $ m post install

    /path/to/scriptA
    /path/to/scriptB
    /path/to/scriptC

To remove a post install hook:

    $ m post install rm /path/to/scriptB

To remove all post install hooks:

    $ m post install rm

## Usage

Output from `m --help`:

```
  Usage: m [options] [COMMAND] [config]

  Commands:

    m                            Output versions installed
    m stable [config ...]        Install or activate the latest stable MongoDB release
    m latest [config ...]        Install or activate the latest MongoDB release (including dev & RCs)
    m X.Y                        Install or activate the latest patch release for MongoDB X.Y (eg. 3.6)
    m <version> [config ...]     Install and/or use MongoDB <version>
    m --legacy <version>         Install generic Linux version (does not include SSL)
    m custom <version> <tarball> [config ...]  Install custom MongoDB <tarball> with [args ...]
    m use <version> [args ...]   Execute mongod <version> with [args ...]
    m shard <version> [args ...] Execute mongos <version> with [args ...]
    m shell <version> [args ...] Open a mongo shell <version> with [args ...]
    m bin <version>              Output bin path for <version>
    m rm <version ...>           Remove the given version(s)
    m --stable                   Output the latest stable MongoDB version available
    m --stable X.Y                .. for release series X.Y (eg. 3.6)
    m --latest                   Output the latest MongoDB version available (including dev & RCs)
    m --latest X.Y                .. for release series X.Y (eg. 3.6)
    m ls                         Output the versions of MongoDB available
    m installed [--json]         Output installed versions available (optionally, in JSON format)
    m src <version>              Output the url for source used for the given <version>
                                   (useful if installed from source)
    m pre <event> [script]       Declare one or list scripts to execute before <event>
                                   (scripts must use absolute paths)
    m post <event> [script]      Declare one or list scripts to execute after <event>
                                   (scripts must use absolute paths)
    m pre <event> rm [script]    Remove pre <event> script
    m post <event> rm [script]   Remove post <event> script

  Events:

    change   Occurs when switching MongoDB versions
    install  Occurs when installing a previously uninstalled MongoDB version

  Options:

    -V, --version   Output current version of m
    -h, --help      Display help information

  Aliases:

    custom     c
    installed  lls
    shard      sd, mongos
    shell      s, sh, mongo
    list       ls, available, avail
    use        as, mongod
    which      bin
```

## Details

 By default `m` downloads MongoDB binaries to _/usr/local/m/versions_ in subdirectories named after the release version (3.2.16, 3.4.9, ...). Activated MongoDB binaries are symlinked into the `bin` directory in _/usr/local_.  To alter where `m` operates, export the __M_PREFIX__ environment variable with your preferred path prefix.

Previously downloaded versions of MongoDB can be activated using `m <version>` or
selected using of the variations in the _Binary Usage_ section above. 

## License

[MIT](https://github.com/aheckmann/m/blob/master/LICENSE)

## Inspiration

Yes tj, this is nearly identical to [n](https://github.com/tj/n). Huge thanks!

## Disclaimer

This software is not supported by MongoDB, Inc. under any of their commercial support subscriptions or otherwise. Any usage of `m` is at your own risk. Bug reports, feature suggestions, and questions can be posted in the [Issues](https://github.com/aheckmann/m/issues) section on GitHub.