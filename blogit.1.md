%BlogIt(1) user manual | version 0.0.1 2ef3d9a
% R. S. Doiel
% 2025-07-21

# NAME

BlogIt

# SYNOPSIS

BlogIt [OPTIONS] COMMONMARK_FILE

# DESCRIPTION

BlogIt provides a means of currating front matter in a CommonMark or Markdown
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
: check COMMONMARK_FILE or directory PATH expected front matter reporting problems.

draft, --draft, -d
: Set the draft status to true in the front matter of COMMONMARK_FILE. Removes datePublished.

edit, --edit, -e
: Edit specific front matter fields in a CommonMark file use FIELD_LIST.

process, --process, -pp
: run COMMONMARK_FILE through the pre-processor writing the result to standard output.

publish
: Run the publication process. If front matter pass validation the original front matter will be updated
the published file will be written to the blog directory tree. This can be combined with the process option
to run the pre-processor on the file before writing to the directory tree.

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
BlogIt publish $HOME/Document/FirstPost.md
# See the blog post ready in your blog directory
tree blog
~~~

You are ready to run [FlatLake](https://flatlake.app) to render your blog's JSON API. You can
then generate your RSS feeds and sitemap from the JSON API.

Run a CommonMark to HTML converter like Pandoc on the CommonMark files to produce HTML.
Then you're ready to run [PageFind](https://pagefind.com) for search support.


