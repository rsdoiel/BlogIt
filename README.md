
# BlogIt

I've written various scripts and programs over the years for managing my personal website and blog. __BlogIt__ is the latest incarnation taking over duties from the now venerable [pttk](https://github.com/rsdoiel/pttk).  I've found increasingly there are  good off the shelf options for software chores. Examples include [PageFind](https://pagefind.app) and [FlatLake](https://flatlake.app). Between those two you have a turn key search system and a JSON API. FlatLake itself can turn your CommonMark front matter into an aggregated JSON API.  This is particularly nice for implementing features like RSS feeds and sitemap XML files. The net result is the tools I've previously written for similar tasks are no longer needed. This lead to re-access what my old "blogit" tool did. Core features are as follows.

1. Validation and curation of front matter in my posts
2. A means, when ready, of copying those CommonMark documents into a blog directory tree.

__BlogIt__ is now implemented in TypeScript and compiled to an executable via Deno.  It is focused on curating the metadata around blog post and "publishing" it to a blog staging directory.

## BlogIt blogging process

1. Use my favorite edit to create CommonMark (Markdown) documents
2. Use __BlogIt__ to edit or curate the front matter and include any required code samples.
3. Run FlatLake to render the JSON API
4. Use JSON API to render the RSS feeds and sitemaps
5. Render the CommonMark documents to HTML
6. Run PageFind for search
7. Review the staged site and deploy when ready

## BlogIt Software structure

- [mod.ts](mod.ts) (used to generate the executable and to allow BlogIt to be used in other Deno+TypeScript projects)
- src
  - [blogit.ts](src/blogit.ts) (holds workflows for blogit tool)
  - [commonMarkDoc.ts](src/commonMarkDoc.ts) (defines a simple object made of front matter and markdown content)
  - [editor.ts](src/editor.ts) (allows you to launch a text editor to update the field in your front matter)
  - [frontMatter.ts](frontMatter.ts) (this does the real work of validation and curation of the front matter)
  
Presently the prototype is less than 2000 lines of TypeScript.

## Installing __BlogIt__

__BlogIt__ is in the early stage of development and not currently built for distribution. You can easily compile __BlogIt__ using [Deno](https://deno.com).

### Required software

- Git to clone the repository, <https://github.com/rsdoiel/BlogIt>
- Deno >= 2.4.2

### Suggested Software

- CMTools >= v0.0.35 (used to generate CITATION.cff, version.ts, etc.)
- Pandoc >= 3.5 (used to produce documentation in HTML)

Also helpful if you use BlogIt to generate a blog website.

- [PageFind](https://pagefind.app), site search from HTML documents
- [FlatLake](https:/flatlake.app), JSON API from Front Matter
- [jq](https://jqlang.org), nice for view JSON and checking for values
- [htmlq](https://github.com/mgdm/htmlq), like `jq` but for HTML documents

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

GNU Affero General Public License 3.0 or newer, see <https://www.gnu.org/licenses/agpl-3.0.html#license-text>

## Questions and collaboration

- [Source Code @GitHub](https://github.com/rsdoiel/BlogIt)
- [Help, Questions and Comments](https://github.com/rsdoiel/BlogIt/issues)
- [Documentation](./user_manual.md)
