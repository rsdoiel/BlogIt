
# BlogIt

I've written various scripts and programs over the years for managing my personal website and blog. __BlogIt__ is the latest incarnation taking over duties from the now venerable [pttk](https://github.com/rsdoiel/pttk).  I've found increasingly there is is good off the shelf for various chores. Example [PageFind](https://pagefind.app) and [FlatLake](https://flatlake.app). Between those two you can turn key search based on the HTML rendered from Common Mark and a JSON API based on front matter in your Common Mark documents. Flatlake is particularly nice in that it sets you up with an easy way to render RSS.  The nut result is the tools I've previously written have features no longer useful. It was time reaccess what my old "blogit" tool did. I found what was missing and needed was remarkably simple.

1. Validation and curation of front matter in my posts
2. A means, when ready, of copying those Common Mark documents into a blog directory tree.

__BlogIt__ is now implemented in TypeScript and compiled to an executable via Deno.  It is focused on curating the metadata around blog post and when "publishing" placing it in the right directory structure.

## Blog production process

1. Use whatever tool(s) you like to create a Common Mark (Markdown) document
2. Use __BlogIt__ to edit or curate the front matter.
3. Run Flatlake to render the JSON API
4. Use JSON API to render the RSS feeds and sitemaps
5. Render the Common Mark documents to HTML and run PageFind for search

## Software structure

- [mod.ts](mod.ts) (used to generate the executable and to allow BlogIt to be used in other Deno+TypeScipt projects)
- src
  - [blogit.ts](src/blogit.ts) (holds the workflows for blogit tool)
  - [commonMarkDoc.ts](src/commonMarkDoc.ts) (creates a simple object made of front matter and markdown content)
  - [editor.ts](src/editor.ts) (allows you to launch a text editor to update the field in your front matter)
  - [frontMatterEditor.ts](frontMatterEditor.ts) (this does the real work of validation and curation of the front matter)
  - [types.ts](types.ts) (holds the structure of required fields in the front matter)

The whole thing is small enough to minimize. It probably could be simplified further but that I'll leave for a future release.

## Installing __BlogIt__

__BlogIt__ is in the early stage of development and not currently built for distribution. You can easily compile __BlogIt__ using [Deno](https://deno.com).

### Required software

- Git to clone the repository, <https://github.com/rsdoiel/BlogIt>
- Deno >= 2.4.1 

### Suggested Software

- CMTools >= v0.0.35 (used to generate CITATION.cff, version.ts, etc.)
- Pandoc >= 3.5 (used to produce documentation in HTML)

Also helpful if you use BlogIt to generate a blog website.

- [PageFind](https://pagefind.app), site search from HTML documents
- [FlatLake](https:/flatlake.app), JSON API from Front Matter
- [jq](https://jqlang.org), nice for view JSON and checking for values
- [htmlq](https://github.com/mgdm/htmlq), like `jq` but for HTML documents
- FlatTools (coming soon), tools to turn FlatLake JSON API into RSS and sitemap.xml
- RenderCMark (coming soon), tool to render Common Markdown to HTML respecting front matter and allowing for handlebarsjs site templates

### Steps to build

1. Clone the repository
2. Change into the repository directory
3. Run `deno task build`
4. Check the the help
5. Copy `./bin/blogit` (or `.\bin\blogit.exe` on Windows) to someplace in your path (e.g. `$HOME/.deno/bin`)


~~~shell
git clone https://github.com/rsdoiel/BlogIt
cd BlogIt
deno task build
./bin/blogit --help
cp -v ./bin/blogit $HOME/.deno/bin/
blogit --version
~~~

Or for Windows 10/11 using PowerShell

~~~pwsh
git clone https://github.com/rsdoiel/BlogIt
cd BlogIt
deno task build
./bin/blogit --help
copy .\bin\blogit.exe $HOME\.deno\bin\
blogit --version
~~~

## Author

- R. S. Doiel, [ORCID: 0000-0003-0900-6903](https://orcid.org/0000-0003-0900-6903)

## LICENSE

GNU Afero General Public License 3.0 or newer, see <https://www.gnu.org/licenses/agpl-3.0.html#license-text>

## Questions and collaboration

- [Source Code @GitHub](https://github.com/rsdoiel/BlogIt)
- [Help, Questions and Comments](https://github.com/rsdoiel/BlogIt/issues)
- [Documentation](https://rsdoiel.github.io/BlogIt)

