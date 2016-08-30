# m

 MongoDB version manager

## Installation

    $ npm install -g m

or

    $ git clone git://github.com/aheckmann/m.git && cd m && make install

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
    
Install a version of mongodb from source (requires `scons`):

    $ m 2.2.3-rc0 source

Install an enterprise release

    $ m 3.2.8-ent

### Removing Binaries

Remove some versions:

    $ m rm 2.2.0-rc1 2.0.4 2.4.0-rc0 3.2.8-ent

_Note that you cannot remove the actively running version. Change to a different version before removing._

### Binary Usage

When running multiple versions of mongodb, we can target
them directly by asking `m` for the binary path:

    $ m bin 2.0.7
    /usr/local/m/versions/2.0.7/bin/
    
Start up mongod 2.0.7 regardless of the active version:

    $ m use 2.0.7 --port 29000 --dbpath /data/2.0.7/

Execute a script with the 2.0.7 shell regardless of the active version:

    $ m shell 2.0.7 some.js

with flags:

    $ m s 2.0.7 --port 29000 --eval 1+1
    
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
    m latest [config ...]        Install or activate the latest mongodb release
    m stable [config ...]        Install or activate the latest stable mongodb release
    m <version> [config ...]     Install and/or use mongodb <version>
    m custom <version> <tarball> [config ...]  Install custom mongodb <tarball> with [args ...]
    m use <version> [args ...]   Execute mongod <version> with [args ...]
    m shard <version> [args ...] Execute mongos <version> with [args ...]
    m shell <version> [args ...] Open a mongo shell <version> with [args ...]
    m bin <version>              Output bin path for <version>
    m rm <version ...>           Remove the given version(s)
    m --latest                   Output the latest mongodb version available
    m --stable                   Output the latest stable mongodb version available
    m ls                         Output the versions of mongodb available
    m src <version>              Output the url for source used for the given <version> (useful if installed from source)
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

    which   bin
    use     as
    shard   sd
    list    ls
    custom  c
    shell   s
```

## Details

 `m` by default installs mongodb to _/usr/local/m/versions_, from
 which it can see what you have currently installed, and activate previously installed versions of mongodb when `m <version>` is invoked again.

 Activated mongodb versions are then installed to the prefix _/usr/local_, which may be altered via the __M_PREFIX__ environment variable.

 To alter where `m` operates simply export __M_PREFIX__ to whatever you prefer.

## License

[MIT](https://github.com/aheckmann/m/blob/master/LICENSE)

## Inspiration

Yes tj, this is nearly identical to [n](https://github.com/visionmedia/n). Huge thanks!

