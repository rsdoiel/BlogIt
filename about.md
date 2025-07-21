---
title: BlogIt
abstract: "__BlogIt__ is a command line program for curating front matter in CommonMark (Markdown) documents used in producing a blog. __BlogIt__ primary purpose is curating the fornt matter 
posts. It also supports a preprocessor for handling markdown linked files as HTML linked files and code include blocks. Additional functionality includes editing, checking and 
publishing the CommonMark document to a blog directory structure.

Here&#x27;s an example of creating a blog from scratch while levaraging __BlogIt__.

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
[FlatLake](https://flatlake.app) to render your blog&#x27;s JSON API."
authors:
  - family_name: Doiel
    given_name: Robert
    id: https://orcid.org/0000-0003-0900-6903


maintainer:
  - family_name: Doiel
    given_name: Robert
    id: https://orcid.org/0000-0003-0900-6903

repository_code: https://github.com/rsdoiel/BlogIt
version: 0.0.1
license_url: https://www.gnu.org/licenses/agpl-3.0.html#license-text

programming_language:
  - TypeScript

keywords:
  - blog
  - front matter
  - CommonMark
  - Markdown

date_released: 2025-07-21
---

About this software
===================

## BlogIt 0.0.1

Initial sketch and working prototype of BlogIt.

### Authors

- Robert Doiel, <https://orcid.org/0000-0003-0900-6903>




### Maintainers

- Robert Doiel, <https://orcid.org/0000-0003-0900-6903>


__BlogIt__ is a command line program for curating front matter in CommonMark (Markdown) documents used in producing a blog. __BlogIt__ primary purpose is curating the fornt matter 
posts. It also supports a preprocessor for handling markdown linked files as HTML linked files and code include blocks. Additional functionality includes editing, checking and 
publishing the CommonMark document to a blog directory structure.

Here&#x27;s an example of creating a blog from scratch while levaraging __BlogIt__.

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

- License: <https://www.gnu.org/licenses/agpl-3.0.html#license-text>
- GitHub: <https://github.com/rsdoiel/BlogIt>
- Issues: <https://github.com/rsdoiel/BlogIt/issues>

### Programming languages

- TypeScript




### Software Requirements

- Deno &gt;&#x3D; 2.4.2
- Git &gt;&#x3D; 2.3


### Software Suggestions

- CMTools &gt;&#x3D; v0.0.35
- Pandoc &gt;&#x3D; 3.6


