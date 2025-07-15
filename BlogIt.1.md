%BlogIt(1) user manual | version 0.0.1 2cc2aafc
% R. S. Doiel
% 2025-07-15

# NAME

BlogIt

# SYNOPSIS

BlogIt [OPTIONS] COMMON_MARK_FILE [DATE_OF_POST]

# DESCRIPTION

BlogIt provides a means of currating front matter in a Common Mark or Markdown
document. When you're ready to publish (when the front matter validates) it'll copy
the document into a blog directory structure.

# OPTIONS

Options come as the last parameter(s) on the command line.

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

--prefix, -p
: Set an explicit path to the "blog" directory.

check, --check, -c
: check COMMON_MARK_FILE or directory PATH expected front matter reporting problems.

draft, --draft, -d
: Set the draft status to true in the front matter of COMMON_MARK_FILE. Removes datePublished.

edit, --edit, -e
: Edit specific front matter fields in a Common Mark file use FIELD_LIST.

# EXAMPLES

front matter into your blog's directory tree.

Here's an example of creating a blog from scratch while levaraging __BlogIt__

~~~shell
# Pick an editor, example nano in the case
export EDITOR=nano
mkdir -p $HOME/Site/website/blog
cd $HOME/Site/website
# Create your first post
nano $HOME/Documents/FirstPost.md
# Create/curate the Front Matter for your first blog post
BlogIt edit $HOME/Documents/FirstPost.md
# Check to make sure everything is ready to go
BlogIt check $HOME/Documents/FirstPost.md
# Publishing into your blog's directory tree
BlogIt $HOME/Document/FirstPost.md
# See the blog post ready in your blog directory
tree blog
~~~

Run a Common Mark to HTML converter like Pandoc on the Common Mark files to produce HTML.
Then you're ready to run [PageFind](https://pagefind.com) for search and 
[FlatLake](https://flatlake.app) to render your blog's JSON API.


