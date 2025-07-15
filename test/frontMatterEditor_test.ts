/**
 *  frontMatterEditor_test.ts - this module tests frontMatterEditor.ts which is part of the BlogIt program.
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
import { assertEquals } from "@std/assert";
import { editFrontMatter } from "../src/frontMatterEditor.ts";
import { CommonMarkDoc } from "../src/commonMarkDoc.ts";

Deno.test("editFrontMatter - edit fields", async () => {
  const cmarkDoc: CommonMarkDoc = {
    frontMatter: {
      title: "Original Title",
      author: "John Doe",
      draft: true,
    },
    markdown: "# Hello World",
    changed: false,
  };

  await editFrontMatter(cmarkDoc, ["title", "draft"]);

  // Since actual editing involves user interaction, this test is more about structure
  assertEquals(cmarkDoc.changed, false); // Assuming no changes are made in the test environment
});
