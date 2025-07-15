---
title: |
  Simplifying BlogIt
author: R. S. Doiel
abstract: |

  BlogIt is a command I've written many times over the years. At it's core

  is did a two simple things.


  1. Copy Common Mark files into a blog directory three

  2. Uses Front Matter to curate blog wide a metadata as a JSON document


  In it the new incarnation it has been revised to focus on curating the front
  matter

  and disk location for my blog.


  1. Copy Common Mark files into the blog directory tree

  2. Curate Common Mark file front matter


  I how rely on tools like [FlatLake](https://flatlake.app) curating the blog
  wide metadata.
keywords:
  - blog
  - site generators
  - one more time
pubType: post
dateCreated: '2025-07-14'
dateModified: '2025-07-14'
series: ''
seriesNo: 0
license: ''
datePublished: '2025-07-15'
---

# Simplifying BlogIt

**BlogIt** is a command I've written many times over the years. Previous it was
intended to perform two tasks.

1. Copy Common Mark documents into a blog directory tree
2. Maintains a metadata document for the entire blog

Since the last time I wrote **BlogIt** I've adopted
[FlatLake](https://flatlake.app) for curating website metadata. But that has
made me realize that I really need to keep the front matter accurate and up to
date. **BlogIt** can help here. In this in new incarnation of **BlogIt** the
tasks are now.

1. Provide an convientent way to curate the front matter of the Common Mark
   document
2. Copy Common Mark published documents into the blog directory tree

There are a few related features that I think of as "nice to have" based on my
last implementation.

- BlogIt should be able to walk a directory tree and ensure that the Common Mark
  documents have the required Front Matter logging when something needs my
  attention
- BlogIt should manage "draft" attribute in Front Matter easily and based on
  that update the blog directory tree

Here's what that might look like on the command line.

```shell
blogit [OPTIONS] COMMON_MARK_FILE [DATE_OF_POST]
```

Options would be

- help, version and license
- prefix BLOG_BASE_PATH (to set an explicit path to the "blog" directory)
- check BLOG_BASE_PATH (walk the PATH and check for expected front matter
  reporting problems)
- draft (set the draft status in the front matter of a Common Mark file)
- edit COMMON_MARK_FILE [FRONT_MATTER_FIELD ...]

## Editing metadata

**BlogIt** is a terminal application. The programs scans the source Common Mark
file for existing front matter. Missing elements are then prompted for with a
question to edit the value or not. Choosing to edit then will copy a default
value (or existing value) to a temp file and launch the default system edit.
When the file is saved the value is used to update the front matter. Some fields
in the front matter are complex. Examples include author, contributor, keywords.
The default should show the desired structure as YAML with placehold values to
be edit.

## Front Matter

The basic front matter I want to use is straight forward as my blog started
almost a decade ago. I'd also like the option of including more biblio graphic
language so I could integrate my blog content into a repository system easily.

**BlogIt** will be written in TypeScript this time so I can cover my bases with
the following interfaces.

```TypeScript
/* Person's metadata */
interface Person {
  familyName: string;
  givenName?: string;
  orcid?: string; /* A unique identifier for researcher or author */
  isni?: string; /* Another unique identifier for a person */
  ror?: string; /* ROR are used to affilation with a research organization intity */
  wikiData?: string; /* An identifier pointing at Wikidata */
  wikipead?: string; /* a URL of Wikipedia entry about a person */
  url?: string; /* An OpenID url or person's website */
}

/* Organization's metadata */
interface Organization {
  name: string;
  ror?: string; /* ROR are used to affilation with a research organization intity */
  doi?: string; /* DOI identify digital objects and can be used for an object describing an organization*/
  wikiData?: string; /* An identifier pointing at Wikidata */
  wikipead?: string; /* a URL of Wikipedia entry about an organization */
  url?: string; /* An OpenID url or organization's website */
}

/* This describes the front matter metadata object */
interface Metadata {
    title?: string; /* Optional because they are optional in RSS 2 */
    author: string | (Person | Organization)[]; 
    contributor?: string | (Person | Organization)[];
    funder?: string | (Person or Organization)[];
    abstract: string; /* Maps to description in RSS 2 */
    dateCreated: string; /* ISO 8601 date */
    dateModified: string; /* ISO 8601 date */
    datePublished?: string; /* ISO 8601 date */
    draft?: boolean /* if true then BlogIt processes document as a draft */
    keywords?: string[];
    series?: string;
    seriesNo?: number;
    pubType?: string; /* document type, e.g. article, book chapter, podcast, etc. */
    copyrightYear?: string; /* Four digit year */
    copyrightHolder?: string | Agent;
    license?: string | URL; /* Text of license or a URL pointing at the license */
    enclosures?: {[key:string]: unkown }[] /* future proofing to support podcast and RSS as publication format */
    customElements?: {[key: string]: unkown }; /* for future proofing and experiments */
}
```

BlogIt expectations

- working directory contains a directory called "blog" (this is customary but
  not always the place the blog resides)
  - An explit blog directory can be set using the `prefix` option
- The directory structure is formed as `<prefix>/<YEAR>/<MONTH>/<DAY>` where
  year is four digits, month and day are two digits (zero padded).
- the default date is today, may explicitly be provided by the front matter as
  `.datePublished`
- the date fields automatically supported are `dateCreated`, `dateModified` and
  `datePublished`. The `dateModified` should be updated automatically each time
  **BlogIt** changes the document. `dateCreated` is set the first time the front
  matter is created or edited. `datePublished` is set the first time the Common
  Mark document is "published" into the blog directory tree.

Recursive blog maintainence could be supported by allowing the tool to walk a
directory tree and when it encounters Common Mark document if could check and
validate the front matter. This feature would ensure that the Common Mark
documents are ready for FlatLake processing.

## Checking for Front Matter

Front Matter traditionally is found at the start of the Common Mark file. It
starts with the a line matching `---` and terminates with same `---` line.
Anything between the two is treated as YAML. Checking the front matter means
identifying the YAML source, parsing it and the walking the object produced to
compare it with the interface expected. If an expected field is missing then
prompt for it and if the response is "y" create a temp file of the content (or
example content) and envoke a default editor for the system. When the editor is
exited the source is read back in and the front matter is updated.

## Processing the Front Matter

Aside from extracting the YAML front matter from the text, the standard Deno
library (`@std/yaml`) can be used to populate the interface for validation and
editing. Similarly the Common Mark content can be run through a Common Mark
parser and render to render a preview.

When implementing a web UI I can leverage web components for fields like author,
contributor, funder, etc. As of Deno 2.4 these can be embedded into the compiled
program.

The task for **BlogIt** is primarily orchestrating the use of existing Deno
TypeScript modules implementing the functionality I want from **BlogIt**.

## Rewriting the Common Mark document

If the front matter changes then the Common Mark document should be written to a
backup file (e.g. ".bak"). If changes are made the interface should prompt
before saving the backup and writing out the updates to the source Common Mark
document.

## Draft versus Publishing

If the front matter includes the value `draft: true` **BlotIt** will exit after
updating the front matter. If `draft: true` is not in the front matter (e.g.
`draft: false` or doesn't exist), the value of `datePublished` needs to be set
to the current date if not populated. The `datePublished` is used to calculate
the target path for coping the Common Mark document.

The option "draft" will set the `draft` value in the front matter to true. If
the draft value is set to `false` then it will remove the `draft: true` from the
front matter so it can be published. Setting the `draft` value doesn't trigger
publication, it only sets the value.

## Front Matter editor

The editable front matter interface should be implemented as it's own TypeScript
module. This will allow me to experiment with different interaction models in
the future (e.g. a localhost web page implementation).

QUESTIONS: Can I easily extend BlogIt to manage non-blog content? Could it be a
general directory and metadata layout tool? How does this fit into TextCasting?
If BlogIt a component or something separate? Should BlogIt be able to pull in an
RSS feed and extract and layout content from it?