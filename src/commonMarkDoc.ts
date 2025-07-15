/**
 * commonMarkDoc.ts is a module for handling Commom Mark and Markdown documents with front matter. It is part of the BlogIt project.
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
 * @param content string, the text string to transform into a CommonMarkDoc type, `{ frontMatter: Record<string, unknown>; markdown: string }
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
 * commonMarkDocToString takes a ``{ frontMatter: Record<string, unknown>; markdown: string }` and folders into string prefixed by the front matter block.
 * @param cmarkDoc `{ frontMatter: Record<string, unknown>; markdown: string }`
 * @return string
 */
export function commonMarkDocToString(
  cmarkDoc: { frontMatter: Record<string, unknown>; markdown: string },
): string {
  if (Object.keys(cmarkDoc.frontMatter).length > 0) {
    return `---
${stringify(cmarkDoc.frontMatter)}---

${cmarkDoc.markdown}`;
  }
  return cmarkDoc.markdown;
}
