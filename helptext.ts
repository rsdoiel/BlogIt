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

// Commonn Mark help text
export const helpText =
  `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] VERB COMMON_MARK_FILE

# DESCRIPTION

{app_name} provides a means of currating front matter in a Common Mark or Markdown
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
{app_name} edit $HOME/Documents/FirstPost.md
# Check to make sure everything is ready to go
{app_name} check $HOME/Documents/FirstPost.md
# Publishing into your blog's directory tree
{app_name} publish $HOME/Document/FirstPost.md
# See the blog post ready in your blog directory
tree blog
~~~

Run a Common Mark to HTML converter like Pandoc on the Common Mark files to produce HTML.
Then you're ready to run [PageFind](https://pagefind.com) for search and 
[FlatLake](https://flatlake.app) to render your blog's JSON API.

`;
