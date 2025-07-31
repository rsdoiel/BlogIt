%BlogIt(1) user manual | version 0.0.3 fe85f97
% R. S. Doiel
% 2025-07-30

# NAME

BlogIt

# SYNOPSIS

BlogIt [OPTIONS] COMMONMARK_FILE

# DESCRIPTION

BlogIt provides a means of currating front matter in a CommonMark or Markdown
document. When you're ready to publish (when the front matter validates) it'll copy
the document into a blog directory structure.

You can provides a defaults for front matter for BlogIt by providing a YAML
file with the name of "BlogIt.yaml". It will be the default values for front matter
fields.

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

apply, --apply, -a YAML_FILENAME
: This will apply the YAML_FILENAME as default values in the front matter of a COMMONMARK_FILE.

check, --check, -c
: check COMMONMARK_FILE or directory PATH expected front matter reporting problems.

draft, --draft, -d
: Set the draft status to true in the front matter of COMMONMARK_FILE. Removes datePublished.

edit, --edit, -e
: Edit specific front matter fields in a CommonMark file use FIELD_LIST.

process, --process, -P
: run COMMONMARK_FILE through the pre-processor writing the result to standard output.

show
: Display (pretty print) the front matter for the given COMMONMARK_FILE.

publish
: Run the publication process. If front matter pass validation the original front matter will be updated
the published file will be written to the blog directory tree. This can be combined with the process option
to run the pre-processor on the file before writing to the directory tree.

# CONFIGURATION

BlogIt will look for a "BlogIt.yaml" file in the current directory of where BlogIt is being executed.
The file's YAML provides minimum front matter default values. To apply the defaults from BlogIt.yaml you use the
apply action.

# EXAMPLES

## Setting up a blog

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

You are ready to run additional processing like [FlatLake](https://flatlake.app)
to render your blog's JSON API, [Pandoc](https://pandoc.org) to render HTML and 
[PageFind](https://pagefind.com) to complete your website.

## Apply default front matter

Here is an example of using the "apply" action front matter values.

1. create a "defaults.yaml" file
2. Apply the defaults to the post "FirstPost.md"

~~~shell
BlogIt --apply=defaults.yaml FirstPost.md
~~~


