# m

 MongoDB version manager

## Installation

    $ npm install -g m

or

    $ git clone git://github.com/aheckmann/m.git && cd m && make install

### Installing Binaries

The version given becomes the active MongoDB binary once installation is complete. With `m` you can install mutiple versions of MongoDB and switch between them.

    $ m 3.2.16
    $ m 3.4.9

List installed binaries:

    $ m

      3.2.15
    ο 3.2.16
      3.4.9

Use or install the latest official release:

    $ m latest

Use or install the stable official release:

    $ m stable

Install a custom or patched version of MongoDB from a tarball:

    $ m custom 3.5.13-me https://github.com/aheckmann/mongo/tarball/r3.5.13

Install a version of MongoDB from source (requires `scons`):

    $ m 3.4.9-rc0 source

Install an Enterprise release

    $ m 3.4.9-ent
### Removing Binaries

Remove some previous installed versions:

    $ m rm 3.2.15 3.4.9-rc0 3.4.9-ent

_Note that you cannot remove the actively running version. Change to a different version before removing._

### Binary Usage

When running multiple versions of MongoDB, we can target them directly by asking `m` for the binary path:

    $ m bin 3.4.9
    /usr/local/m/versions/3.4.9/bin/

Start up `mongod` 3.4.9 regardless of the active version:

    $ m use 3.4.9 --port 29000 --dbpath /data/3.4.9/

Execute a script with the 3.4.9 `mongo` shell regardless of the active version:

    $ m shell 3.4.9 some.js

with flags:

    $ m s 3.4.9 --port 29000 --eval 1+1

When installing or changing the active version we might want to run custom scripts:

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

Remove all post install hooks:

    $ m post install rm

## Usage

Output from `m --help`:

```
  Usage: m [options] [COMMAND] [config]

  Commands:

    m                            Output versions installed
    m latest [config ...]        Install or activate the latest MongoDB release
    m stable [config ...]        Install or activate the latest stable MongoDB release
    m <version> [config ...]     Install and/or use MongoDB <version>
    m custom <version> <tarball> [config ...]  Install custom MongoDB <tarball> with [args ...]
    m use <version> [args ...]   Execute mongod <version> with [args ...]
    m shard <version> [args ...] Execute mongos <version> with [args ...]
    m shell <version> [args ...] Open a mongo shell <version> with [args ...]
    m bin <version>              Output bin path for <version>
    m rm <version ...>           Remove the given version(s)
    m --latest                   Output the latest MongoDB version available
    m --stable                   Output the latest stable MongoDB version available
    m ls                         Output the versions of MongoDB available
    m src <version>              Output the url for source used for the given <version> (useful if installed from source)
    m pre <event> [script]       Declare one or list scripts to execute before <event> (scripts must use absolute paths)
    m post <event> [script]      Declare one or list scripts to execute after <event> (scripts must use absolute paths)
    m pre <event> rm [script]    Remove pre <event> script
    m post <event> rm [script]   Remove post <event> script

  Events:

    change   Occurs when switching MongoDB versions
    install  Occurs when installing a previously uninstalled MongoDB version

  Options:

    -V, --version   Output current version of m
    -h, --help      Display help information

  Aliases:

    which   bin
    use     as
    shard   sd
    list    ls
    custom  c
    shell   s
```

## Details

 `m` by default installs MongoDB to _/usr/local/m/versions_, from
 which it can see what you have currently installed, and activate previously installed versions of MongoDB when `m <version>` is invoked again.

 Activated MongoDB versions are then installed to the prefix _/usr/local_, which may be altered via the __M_PREFIX__ environment variable.

 To alter where `m` operates simply export __M_PREFIX__ to whatever you prefer.

## License

[MIT](https://github.com/aheckmann/m/blob/master/LICENSE)

## Inspiration

Yes tj, this is nearly identical to [n](https://github.com/visionmedia/n). Huge thanks!

