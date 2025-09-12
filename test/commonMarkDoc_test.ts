/**
 * commonMarkDoc_test.ts - this tests the commonMarkDoc.ts module. It is part of the BlogIt program.
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
// Import necessary modules
import { assertEquals } from "@std/assert";
import {
  CommonMarkDoc,
  commonMarkDocToString,
  stringToCommonMarkDoc,
} from "../src/commonMarkDoc.ts";

Deno.test("stringToCommonMarkDoc - with front matter", () => {
  const content = `---
title: Test Document
author: John Doe
---

# Hello World

This is a test document.`;

  const result = stringToCommonMarkDoc(content);

  assertEquals(result.frontMatter, {
    title: "Test Document",
    author: "John Doe",
  });
  assertEquals(
    result.markdown,
    `# Hello World

This is a test document.`,
  );
});

Deno.test("stringToCommonMarkDoc - without front matter", () => {
  const content = `# Hello World

This is a test document without front matter.`;

  const result = stringToCommonMarkDoc(content);

  assertEquals(result.frontMatter, {});
  assertEquals(
    result.markdown,
    `# Hello World

This is a test document without front matter.`,
  );
});

Deno.test("commonMarkDocToString - with front matter", () => {
  const cmarkDoc = {
    frontMatter: { title: "Test Document", author: "John Doe" },
    markdown: `# Hello World

This is a test document.`,
    changed: false
  } as CommonMarkDoc;

  const result = commonMarkDocToString(cmarkDoc);

  const expected = `---
title: Test Document
author: John Doe
---

# Hello World

This is a test document.`;

  assertEquals(result, expected);
});

Deno.test("commonMarkDocToString - without front matter", () => {
  const cmarkDoc: CommonMarkDoc = {
    frontMatter: {},
    changed: false,
    markdown: `

# Hello World

This is a test document without front matter.
`,
  };

  const result = commonMarkDocToString(cmarkDoc);

  const expected = `

# Hello World

This is a test document without front matter.
`;

  assertEquals(result, expected);
});
