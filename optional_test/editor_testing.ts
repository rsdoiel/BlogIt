/**
 * editor_test.ts - is a module that tests the editor.ts module. It is part of the BlogIt project.
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
import { assertEquals, assertNotEquals } from "@std/assert";
import * as edit from "../src/editor.ts";

function testEditorFromEnv() {
  // Set a temporary environment value.
  const oldVal: string = Deno.env.has("EDITOR")
    ? Deno.env.get("EDITOR") + ""
    : "";
  Deno.env.set("EDITOR", "micro");
  let editor = edit.getEditorFromEnv();
  assertNotEquals(editor, "", "should have EDITOR env set");
  assertEquals(editor, "micro", `EDITOR should be 'micro', got ${editor}`);
  if (oldVal !== "") {
    Deno.env.set("EDITOR", oldVal);
  }
  // Mock Deno.env.get for testing purposes
  Deno.env.set("EDITOR", "nano");
  editor = edit.getEditorFromEnv("EDITOR");
  assertEquals(editor, "nano");
}

async function testEditTempData() {
  const editor = edit.getEditorFromEnv();
  assertNotEquals(
    editor,
    undefined,
    `aborting testEditTempData, EDITOR not defined`,
  );
  const expectedTempData = "Hello World!!";
  console.log('Launching editor so you can edit temp data, "Hello World!!"');
  console.log("Save the file without changes to complete test.");

  let result: string | undefined = await edit.editTempData(expectedTempData);
  result === undefined ? "" : result = result.trim();
  assertNotEquals(
    result,
    undefined,
    `editTempData should not have returned undefined for "${expectedTempData}"`,
  );
  assertEquals(
    expectedTempData,
    result,
    `expected "${expectedTempData}", got "${result}"`,
  );

  // Mocking editTempData is more complex and might require a custom mock setup
  const testData = "Test data";
  console.log('Launching test to edit "Test data" value.');
  result = await edit.editTempData(testData);
  // This test is more about ensuring the function runs without errors
  assertEquals(result, testData);
}

async function main() {
  testEditorFromEnv();
  await testEditTempData();
}

if (import.meta.main) {
  await main();
} else {
  Deno.test(
    "test getEditorFromEnv - without EDITOR env variable",
    testEditorFromEnv,
  );
  Deno.test("test editTempData - basic functionality", await testEditTempData);
}
