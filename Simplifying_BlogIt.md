---
title: Simplifying BlogIt
author: R. S. Doiel
abstract: |
  BlogIt is a command I've written many times over the years. At it's core
  is did a two simple things. 

  1. Copy CommonMark files into a blog directory three
  2. Use Front Matter as a source for aggregated blog metadata

  In it the new incarnation it is primarily focus on curating the front matter
  followed by copying the document into the blog directory structure. 

  1. Curate CommonMark file front matter
  2. Copy CommonMark files into the blog directory tree

  Other tools can aggregate blog metadata like [FlatLake](https://flatlake.app).
dateCreated: 2025-07-12
dateModified: '2025-07-21'
keywords:
  - font matter
  - CommonMark
  - blog
datePublished: '2025-07-21'
---

# Simplifying BlogIt

__BlogIt__ is a command I've written many times over the years. Previous it was intended to perform two tasks.

1. Copy CommonMark documents into a blog directory tree
2. Aggregate metadata from the document (front matter) for my blog

I am updating the way my website and blog are is built. I am adopting [FlatLake](https://flatlake.app) for fulfill the role of aggregator. This changes the role __BlogIt__ plays.  Since I am relying on an off the shelf tool to perform front matter aggregation it becomes more important to make the front matter consist. The new priorities for __BlogIt__ are.

1. Curating the front matter of CommonMark documents
2. Publishing (staging) CommonMark documents in the blog directory tree

With curating front matter the priority some additional features will be helpful.

- check a file for well formed front matter with the minimum field requirements
- check directories for CommonMark documents and their front matter

## BlogIt command line

Here's what that might look like on the command line.

~~~shell
blogit [OPTIONS] ACTION COMMONMARK_FILE [DATE_OF_POST]
~~~

## OPTIONS

- help
- version
- license
- prefix BLOG_BASE_PATH (to set an explicit path to the "blog" directory)
- process (run the processor over the CommonMark document)

## ACTION

The following actions need to be supported in the new implementation.

- check COMMONMARK_FILE | DIRECTORY 
  - validate the front matter in a file or directory of CommonMark documents
- draft
  -  set the front matter draft attribute to true, clear the published date
- edit COMMONMARK_FILE [FRONT_MATTER_FIELD ...]
  - edit all or a subset of standard front matter fields
- process COMMONMARK_FILE
  - resolve the links to markdown files with HTML links
  - include embedded code blocks
- publish COMMONMARK_FILE
  - read front matter
  - set draft to false
  - set publish date and update modified date
  - validate front matter
  - on success, save the updates then copy into blog directory tree

## Editing front matter

__BlogIt__ is a terminal application. The programs scans the source CommonMark file for existing front matter. For each expected element the current (or default) value of the element is displayed with a prompt to edit it. If editing is chosen then the value is presented in the default editor for update. The saved value is then used to update the front matter element. A temporary file is used to communicate between __BlogIt__ and the system provided text editor.

Complex fields like keywords are provided to the text edit as YAML. The default should show the desired structure as YAML with placeholder values to be edited.

## Front Matter

The basic front matter I want to use is straight forward as my blog started almost a decade ago. Essentially it is title, author, abstract, dateCreated, dateModified, datePublished and keywords. Some blog items have a series name and number so I will support those fields as well.

__BlogIt__ will be written in TypeScript this time so I can cover my bases with the following interfaces.

~~~TypeScript
/* This describes the front matter metadata object */
interface Metadata {
    title: string; /* Optional because they are optional in RSS 2 */
    author: string;
    abstract: string; /* Maps to description in RSS 2 */
    dateCreated: string; /* ISO 8601 date */
    dateModified: string; /* ISO 8601 date */
    datePublished?: string; /* ISO 8601 date */
    draft?: boolean /* if true then BlogIt processes document as a draft */
    keywords?: string[];
    series?: string;
    seriesNo?: number;
    copyrightYear?: string; /* Four digit year */
    copyrightHolder?: string;
    license?: string; /* Text of license or a URL pointing at the license */
}
~~~

BlogIt expectations

- working directory contains a directory called "blog" (this is customary but not always the place the blog resides)
  - An explicit blog directory can be set using the `prefix` option
- The directory structure is formed as `<prefix>/<YEAR>/<MONTH>/<DAY>` where year is four digits, month and day are two digits (zero padded).
- the default date is today, may explicitly be provided by the front matter as `.datePublished`
- the date fields automatically supported are `dateCreated`, `dateModified` and `datePublished`. The `dateModified` should be updated automatically each time __BlogIt__ changes the document. `dateCreated` is set the first time the front matter is created or edited.  `datePublished` is set the first time the CommonMark document  is "published" into the blog directory tree. This also results in the draft field being removed.

Recursive blog maintenance could be supported by allowing the tool to walk a directory tree and when it encounters CommonMark document it checks and validates the front matter. This feature would ensure that the CommonMark documents are ready for FlatLake processing as I migrate my site build process.

## Checking for Front Matter

Front Matter traditionally is found at the start of the CommonMark file. It starts with the a line matching `---` and terminates with same `---` line. Anything between the two is treated as YAML.  Checking the front matter means identifying the YAML source, parsing it and the walking the object produced to compare it with the interface expected. If an expected field is missing then prompt for it and if the response is "y" create a temp file of the content (or example content) and invoke a default editor for the system. When the editor is exited the source is read back in and the front matter is updated.

## Processing the Front Matter

Aside from extracting the YAML front matter from the text, the standard Deno library (`@std/yaml`) can be used to populate the interface for validation and editing.

The task for __BlogIt__ is primarily orchestrating the use of existing Deno TypeScript modules implementing the functionality I want from __BlogIt__.

## Rewriting the CommonMark document

If the front matter changes then the CommonMark document should be written to a backup file (e.g. ".bak"). If changes are made the interface should prompt before saving the backup and writing out the updates to the source CommonMark document.

## Draft versus datePublished

If the front matter includes the value `draft: true` __BlogIt__ will exit after updating the front matter.  If `draft: true` is not in the front matter (e.g. `draft: false` or doesn't exist), the value  of `datePublished` needs to be set to the current date if not already populated. The `datePublished` is used to calculate the target path for coping the CommonMark document.

The action "draft" will set the `draft` value to `true` and clear `datePublished`.

The action "publish" will remove the `draft` attribute setting the publication and modification dates. If the front matter is valid then it will save the updated metadata and proceed to copy the revised CommonMark document into the blog tree.

## The Program

### editor module

Calling out to the system's text editor and running the editor as a sub process should be implemented as it's own module. This will allow me to improve the process independently and potentially use it in other applications.

@insert-code-block src/editor.ts TypeScript

### Front Matter

The front matter handling is implemented as it's own TypeScript module, `frontMatter.ts`. This module defines all the front matter schema and the operations that maybe performed on it including the interactive prompts. 

@include-code-block src/frontMatter.ts TypeScript

### CommonMark module

My website is implemented using CommonMark documents that include front matter. It is helpful to be able to handle the documents 
in a uniform way. This is accomplished through a TypeScript module called `commonMarkDoc.ts`.  It defines an interface, `CommonMarkDoc` that contains three attributes, `frontMatter`, `markdown` and `changed`. The latter is a boolean flag that is set when something changes in the either `frontMatter` or `markdown`.

The module also supports an Object called CMarkDoc that include a pre-processor function called `process` providing two useful features.

- mapping of ".md" file links to ".html" file links
- including code blocks from external files

@include-code-block src/commonMarkDoc.ts TypeScript

### Main

The main module, `mod.ts`, will allow for processing the command line option and performing the requested actions.

@include-code-block mod.ts TypeScript