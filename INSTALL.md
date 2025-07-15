Installation for development of **BlogIt**
===========================================

**BlogIt** __BlogIt__ is a command line program for curating front matter in Common Mark (Markdown) documents used in producing a blog. It also copies the Common Mark document which validated 
front matter into your blog&#x27;s directory tree.

Here&#x27;s an example of creating a blog from scratch while levaraging __BlogIt__

~~~shell
# Pick an editor, example nano in the case
export EDITOR&#x3D;nano
mkdir -p $HOME/Site/website/blog
cd $HOME/Site/website
# Create your first post
nano $HOME/Documents/FirstPost.md
# Create/curate the Front Matter for your first blog post
BlogIt edit $HOME/Documents/FirstPost.md
# Check to make sure everything is ready to go
BlogIt check $HOME/Documents/FirstPost.md
# Publishing into your blog&#x27;s directory tree
BlogIt $HOME/Document/FirstPost.md
# See the blog post ready in your blog directory
tree blog
~~~

Run a Common Mark to HTML converter like Pandoc on the Common Mark files to produce HTML. Then you&#x27;re ready to run [PageFind](https://pagefind.com) for search and 
[FlatLake](https://flatlake.app) to render your blog&#x27;s JSON API.

Quick install with curl or irm
------------------------------

There is an experimental installer.sh script that can be run with the following command to install latest table release. This may work for macOS, Linux and if you’re using Windows with the Unix subsystem. This would be run from your shell (e.g. Terminal on macOS).

~~~shell
curl https://rsdoiel.github.io/BlogIt/installer.sh | sh
~~~

This will install the programs included in BlogIt in your `$HOME/bin` directory.

If you are running Windows 10 or 11 use the Powershell command below.

~~~ps1
irm https://rsdoiel.github.io/BlogIt/installer.ps1 | iex
~~~

Installing from source
----------------------

### Required software

- Deno &gt;&#x3D; 2.4.1
- Git &gt;&#x3D; 2.3

### Steps

1. git clone https://github.com/rsdoiel/BlogIt
2. Change directory into the `BlogIt` directory
3. Make to build, test and install

~~~shell
git clone https://github.com/rsdoiel/BlogIt
cd BlogIt
make
make test
make install
~~~

