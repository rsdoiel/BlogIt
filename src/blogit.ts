/**
 * blogit.ts is a module for managing front matter curation workflow. It is part of the BlogIt project.
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
import { copy, ensureDir, walk } from "@std/fs";
import * as path from "@std/path";
import { metadataFields } from "./frontMatter.ts";
import {
  CommonMarkDoc,
  commonMarkDocToString,
  commonMarkDocPreprocessor,
  stringToCommonMarkDoc,
} from "./commonMarkDoc.ts";

export async function publishFile(
  filePath: string,
  prefix: string,
  preprocesor?: boolean,
  dateOfPost?: string,
) {
  // FIXME: if options includes draft then the draft value might cause a change.
  const content = await Deno.readTextFile(filePath);
  const cmarkDoc: CommonMarkDoc = stringToCommonMarkDoc(content);
  let datePublished: string = '';
  if (dateOfPost !== undefined) {
    datePublished = dateOfPost;
  } else if (cmarkDoc.frontMatter.datePublished !== undefined && cmarkDoc.frontMatter.datePublished) {
    datePublished = cmarkDoc.frontMatter.datePublished as string;
  } else {
    datePublished = (new Date()).toISOString().split('T')[0] as string;
  }
  if (cmarkDoc.frontMatter.datePublished !== datePublished) {
    cmarkDoc.frontMatter.datePublished = datePublished;
    cmarkDoc.frontMatter.dateModified = datePublished;
    cmarkDoc.changed = true;
  }
  // We are attempting to publish so we always remove "draft"
  if (cmarkDoc.frontMatter.draft !== undefined) {
    delete cmarkDoc.frontMatter.draft;
  }
  // Validate the front matter before take a publication action.
  let res = validateFrontMatter(cmarkDoc);
  if (!res.ok) {
    console.error(`${filePath} not ready to publish, ${res.error}`);
    return;
  }
  // We've past validation so we should save any changes.
  if (cmarkDoc.changed) {
    if (confirm(`save changes ${filePath}?`)) {
      // Backup original file
      await createBackup(filePath);
      // Write output updated version
      await Deno.writeTextFile(filePath, commonMarkDocToString(cmarkDoc));
      console.log(`Wrote ${filePath}`);
    } else {
      console.log("Aborted changes not saved.");
      return;
    }
  }
  // Calculate expected path
  const [year, month, day] = datePublished.toString().split("-");
  const targetDir = `${prefix || "blog"}/${year}/${month}/${day}`;
  // Ensure path exists
  await ensureDir(targetDir);
  // Handle case where we want to publish using preprocessor.
  if (preprocesor) {
    await Deno.writeTextFile(`${targetDir}/${path.basename(filePath)}`, commonMarkDocPreprocessor(cmarkDoc));
    return;
  }
  await copy(filePath, `${targetDir}/${path.basename(filePath)}`);
}

function getBackupFilename(originalFilename: string): string {
  // Split the filename into name and extension
  const lastDotIndex = originalFilename.lastIndexOf(".");

  if (lastDotIndex === -1) {
    // If there's no extension, simply append '.bak'
    return originalFilename + ".bak";
  } else {
    // Replace the extension with '.bak'
    return originalFilename.substring(0, lastDotIndex) + ".bak";
  }
}

// Function to create a backup
export async function createBackup(originalPath: string) {
  const backupPath = getBackupFilename(originalPath);
  try {
    // Read the original file
    const data = await Deno.readTextFile(originalPath);

    // Write the data to the backup file
    await Deno.writeTextFile(backupPath, data);
    console.log(`Backup created successfully: ${backupPath}`);
  } catch (error) {
    console.error("Error creating backup:", error);
  }
}

function isDate(object: any): object is Date {
  return object instanceof Date;
}

function assertType(
  val: unknown,
  vTypeOf: string,
  vSubType?: string,
): { ok: boolean; error?: string } {
  let aType: string = typeof val;
  if (val === null && vTypeOf !== 'null') {
    return { ok: false, error: `expected ${vTypeOf}, got null` };
  }
  if (aType !== vTypeOf) {
    // Are we expecting a date sub-type?
    if (vSubType !== undefined && vSubType === 'date') {
      if (! isDate(val)) {
        // If we don't have a date object, do we have something that acts like a date?
        try {
          new Date(`${val}`);
        } catch (error) {
          return { ok: false, error: `${error}` };
        }
      }
    } else {
      return { ok: false, error: `expected type ${vTypeOf}, got ${aType}` };
    }
  }
  return { ok: true };
}

function validateFrontMatter(
  cmarkDoc: CommonMarkDoc,
): { ok: boolean; error?: string } {
  const frontMatter = cmarkDoc.frontMatter;
  if (Object.keys(frontMatter).length === 0) {
    return { ok: false, error: `missing all front matter` };
  }
  for (const field of metadataFields) {
    // Make sure the minimum fields are present.
    if (frontMatter[field] === undefined) {
      switch (field) {
        case "title":
        case "author":
        case "abstract":
        case "dateCreated":
        case "dateModified":
          return { ok: false, error: `missing ${field}` };
        case "draft":
          if (
            frontMatter.datePublished === undefined ||
            frontMatter.datePublished === ""
          ) {
            return { ok: false, error: "missing draft and datePublished" };
          }
          break;
        case "datePublished":
          if (frontMatter.draft == undefined || frontMatter.draft === false) {
            return {
              ok: false,
              error: "missing datePublished or draft not set correctly",
            };
          }
          break;
      }
    } else {
      // If type is defined then check typeof and formatting
      let res: { ok: boolean; error?: string } = { ok: true };
      switch (field) {
        case "title":
        case "author":
        case "abstract":
          res = assertType(frontMatter[field], "string");
          if (res.ok) {
            if ((frontMatter[field] as string).trim() === '') {
              res.ok = false;
              res.error = `${field} is an empty string`;
            }
          }
          break;
        case "dateCreated":
        case "dateModified":
          res = assertType(frontMatter[field], "string", "date");
          break;
        case "draft":
          res = assertType(frontMatter[field], "boolean");
          break;
        case "datePublished":
          if (frontMatter[field] !== "") {
            res = assertType(frontMatter[field], "string", "date");
          }
          break;
        case "keywords":
          res = assertType(frontMatter[field], "object", "string");
          break;
      }
      if (!res.ok) {
        res.error = `(${field}) ${res.error}`;
        return res;
      }
    }
  }
  // Make sure that draft and publish date make sense
  if (frontMatter.draft && frontMatter.datePublished !== undefined && frontMatter.datePublished !== "") {
    return { ok: false, error: `conflict draft is true and datePublished is set to ${frontMatter.datePublished}` };
  } else if ((frontMatter.datePublished === undefined || frontMatter.datePublished === "") && !frontMatter.draft) {
    return { ok: false, error: "missing draft or datePublished must be set." };
  }
  return { ok: true };
}

export async function checkFile(filePath: string) {
  const content = await Deno.readTextFile(filePath);
  const cmarkDoc = stringToCommonMarkDoc(content);
  const res = validateFrontMatter(cmarkDoc);
  res.ok ? "" : console.error(`${filePath}: ${res.error}`);
}

export async function checkDirectory(dirPath: string) {
  for await (const entry of walk(dirPath)) {
    if (entry.isFile && entry.path.endsWith(".md")) {
      const content = await Deno.readTextFile(entry.path);
      const cmarkDoc = stringToCommonMarkDoc(content);
      const res = validateFrontMatter(cmarkDoc);
      res.ok ? "" : console.error(`${entry.path}: ${res.error}`);
    }
  }
}
