%blogit(1) user manual | version 0.0.1 2cc2aafc
% R. S. Doiel
% 2025-07-15

# NAME

blogit

# SYNOPSIS

blogit [OPTIONS] VERB COMMON_MARK_FILE

# DESCRIPTION

blogit provides a means of currating front matter in a Common Mark or Markdown
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

VERB

config
: This will create a configuration file for default settings to use in the front matter.

check
: check COMMON_MARK_FILE or directory PATH expected front matter reporting problems.

draft
: Set the draft status to true in the front matter of COMMON_MARK_FILE.
(Removes datePublished if pupulated. Will cause dateModified to be updated.)

edit
: Edit specific front matter fields in a Common Mark file use FIELD_LIST.
(Automatically sets dateModified and populates dateCreated if needed.
The draft field will be set to true if datePublished is not populated)

publish
: Validate then publish post on success validation (will set the draft/datePublished explicitly,
sets dateModified and will populate dateCreated if not previously set)

# EXAMPLES

Here's an example of setting up a blog levaraging __BlogIt__.

~~~shell
# Pick an editor, example nano in the case
export EDITOR=nano
mkdir -p $HOME/Site/website/blog
cd $HOME/Site/website
# Create your first post
nano $HOME/Documents/FirstPost.md
# Create/curate the Front Matter for your first blog post
blogit edit $HOME/Documents/FirstPost.md
# Check to make sure everything is ready to go
blogit check $HOME/Documents/FirstPost.md
# Publishing into your blog's directory tree
blogit publish $HOME/Document/FirstPost.md
# See the blog post ready in your blog directory
tree blog
~~~

Run a Common Mark to HTML converter like Pandoc on the Common Mark files to produce HTML.
Then you're ready to run [PageFind](https://pagefind.com) for search and 
[FlatLake](https://flatlake.app) to render your blog's JSON API.


