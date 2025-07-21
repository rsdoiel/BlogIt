/**
 * commonMarkDoc.ts is a module for handling CommomMark and Markdown documents with front matter.
 * It is part of the BlogIt project.
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
import { parse, stringify } from "@std/yaml";

export interface CommonMarkDoc {
  frontMatter: Record<string, unknown>;
  markdown: string;
  changed: boolean;
}

/**
 * stringToCommonMarkDoc takes a string and splits it into a record with frontmatter and markdown
 * @param content string, the text string to transform into a CommonMarkDoc type.
 * @return `{frontMatter: Record<string, unknown>; markdown: string }`
 */
export function stringToCommonMarkDoc(
  content: string,
): CommonMarkDoc {
  const frontMatterRegex = /^---([\s\S]+?)---/;
  const match = content.match(frontMatterRegex);
  let frontMatter: Record<string, unknown> = {};
  let markdown: string = content;
  if (match) {
    frontMatter = parse(match[1]) as Record<string, unknown>;
    markdown = content.slice(match[0].length).trim();
  }
  return { frontMatter: frontMatter, markdown: markdown, changed: false };
}

/**
 * commonMarkDocToString takes a CommonMarkDoc object and renders it into string prefixed by the front matter block.
 * @param cmarkDoc CommonMarkDoc
 * @return string
 */
export function commonMarkDocToString(
  cmarkDoc: CommonMarkDoc,
): string {
  if (Object.keys(cmarkDoc.frontMatter).length > 0) {
    return `---
${stringify(cmarkDoc.frontMatter)}---

${cmarkDoc.markdown}`;
  }
  return cmarkDoc.markdown;
}

/**
 * commonMarkDocPreprocessor takes a CommonMarkDoc object and maps the ".md" links to ".html" links
 * and includes code blocks using the `@include-code-block` directive.
 *
 * @param cmarkDoc: CommmonMarkDoc
 * @return string
 */
export function commonMarkDocPreprocessor(
  cmarkDoc: CommonMarkDoc,
): string {
      // Convert markdown links to HTML links
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g;
    let processedMarkdown = cmarkDoc.markdown.replace(markdownLinkRegex, (_fullMatch, linkText, filePath) => {
      const htmlFilePath = filePath.replace(/\.md$/, '.html');
      return `[${linkText}](${htmlFilePath})`;
    });

    // Insert code blocks from external files
    const insertBlockRegex = /@include-code-block\s+([^\s]+)(?:\s+(\w+))?/g;
    processedMarkdown = processedMarkdown.replace(insertBlockRegex, (_fullMatch, filePath, language = '') => {
      const fileContent = Deno.readTextFileSync(filePath);
      if (fileContent) {
        return `~~~${language}\n${fileContent}\n~~~`;
      } else {
        return `Error inserting block from ${filePath}`;
      }
    });
    if (processedMarkdown !== cmarkDoc.markdown) {
      return commonMarkDocToString({
          frontMatter: cmarkDoc.frontMatter,
          markdown: processedMarkdown,
          changed: true
      });
    }
    return commonMarkDocToString(cmarkDoc);
}

/**
 * CMarkDoc implements the interface CommonMarkDoc
 * It supports working with CommonMark documents that contain front matter
 */
export class CMarkDoc implements CommonMarkDoc {
  frontMatter: Record<string, unknown> = {};
  markdown: string = '';
  changed: boolean = false;

  /**
   * parse takes a string hold CommonMark text and parses it into the CMarkDoc object structure.
   */
  parse(src: string): boolean {
    const cmarkDoc: CommonMarkDoc = stringToCommonMarkDoc(src);
    this.frontMatter = cmarkDoc.frontMatter;
    this.markdown = cmarkDoc.markdown;
    return (this.markdown.length > 0);
  }
  
  /**
   * stringify takes this object and returns a CommonMark representation including front matter.
   */
  stringify(): string {
    return commonMarkDocToString(this);
  }

  /**
   * processSync is a CommonMark pre-processor implementing two features. It performs two
   * fucntions.
   *   1. converts links to markdown files (ext. ".md") to their HTML file counter parts
   *   2. Any `@insert-code-block` will include a source code file block in the resulting
   *      source document.
   */
  processSync(): string {
    return commonMarkDocPreprocessor(this);
  }
}

