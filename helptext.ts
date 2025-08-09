/**
 * helptext.ts - this modules provides the help text displayed with the help option. It is part of the BlogIt project.
 *
 *  Copyright (C) 2025  R. S. Doiel
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
export function fmtHelp(
  txt: string,
  appName: string,
  version: string,
  releaseDate: string,
  releaseHash: string,
): string {
  return txt.replaceAll("{app_name}", appName).replaceAll("{version}", version)
    .replaceAll("{release_date}", releaseDate).replaceAll(
      "{release_hash}",
      releaseHash,
    );
}

// CommonMark help text
export const helpText =
  `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] COMMONMARK_FILE

# DESCRIPTION

{app_name} provides a means of currating front matter in a CommonMark or Markdown
document. When you're ready to publish (when the front matter validates) it'll copy
the document into a blog directory structure.

You can provides a defaults for front matter for {app_name} by providing a YAML
file with the name of "{app_name}.yaml". It will be the default values for front matter
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

{app_name} will look for a "{app_name}.yaml" file in the current directory of where {app_name} is being executed.
The file's YAML provides minimum front matter default values. To apply the defaults from {app_name}.yaml you use the
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
{app_name} --apply=defaults.yaml FirstPost.md
~~~

`;
