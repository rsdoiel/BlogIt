/**
 * mod.ts - The main entry point for BlogIt, a Common Mark front matter validator and curation tool. It is part of the BlogIt project.
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
// mod.ts
import { parse as parseArgs } from "@std/flags";
import { exists } from "@std/fs/exists";
import { checkDirectory, checkFile, createBackup, processFile } from "./src/blogit.ts";
import { Metadata } from "./src/types.ts";
import { editFrontMatter } from "./src/frontMatterEditor.ts";
import {
  CommonMarkDoc,
  commonMarkDocToString,
  stringToCommonMarkDoc,
} from "./src/commonMarkDoc.ts";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { helpText, fmtHelp } from "./helptext.ts";

async function main() {
  const appName = 'blogit';
  const args = parseArgs(Deno.args, {
    boolean: ["help", "version", "license" ],
    string: ["prefix"],
    alias: {
      h: "help",
      v: "version",
      l: "license",
      p: "prefix",
    },
    default: {
      prefix: "blog",
    },
  });

  if (args.help || args.length === 0) {
    console.log(
      fmtHelp(helpText, appName, version, releaseDate, releaseHash)
    );
    if (args.help) {
      Deno.exit(0);
    } else {
      Deno.exit(1);
    }
  }

  if (args.version) {
    console.log(`${appName} ${version} ${releaseDate} ${releaseHash}`);
    Deno.exit(0);
  }

  if (args.license) {
    console.log(licenseText);
    Deno.exit(0);
  }

  // Handle verb commands without dash prefix.
  let verb: string | null | undefined = "";
  switch (args._[0] as string) {
    case "config":
      console.log('DEBUG config not implemented'); // DEBUG
      Deno.exit(1);// DEBUG
      break;
    case "check":
      verb = args._.shift() as string;
      break;
    case "edit":
      verb = args._.shift() as string;
      break;
    case "draft":
      verb = args._.shift() as string;
      break;
    case "publish":
      verb = args._.shift() as string;
      break;
    case "help":
      args._.shift();
      args.help = true;
      break;
    default:
      verb = null;
      break;
  }
  if (verb === undefined || verb === null) {
      console.error(`"${verb}" is not supported action (${appName} ${version})`);
      Deno.exit(1);
  }
  verb = (verb as string).toLocaleLowerCase();

  const filePath = args._[0] as string; // Explicitly assert filePath as string
  const dateOfPost = args._[1] as string | undefined; // If explicity provided it should overwrite the value and set draft to false

  if (verb === 'check') {
    if (await exists(filePath, {isDirectory: true})) {
      console.log(`Checking the directory ${filePath}`);
      await checkDirectory(filePath);
    }
    if (await exists(filePath, { isFile: true})) {
      console.log(`Checking the file ${filePath}`);
      await checkFile(filePath)
    }
    Deno.exit(0);
  }


  if (!filePath) {
    console.error("No file specified.");
    Deno.exit(1);
  }

  // Make sure file exists and is readable before proceeding.
  if (!await exists(filePath, { isFile: true, isReadable: true })) {
    console.error(`Cannot find ${filePath}`);
    Deno.exit(1);
  }

  const content = await Deno.readTextFile(filePath);
  const cmarkDoc: CommonMarkDoc = stringToCommonMarkDoc(content);

  if (verb in [ "draft", "edit" ]) {
    // Set to draft is args.draft is true
    if (verb == 'draft') {
      if (cmarkDoc.frontMatter.draft === false) {
        cmarkDoc.frontMatter.draft = true;
        delete cmarkDoc.frontMatter.datePublished;
        cmarkDoc.changed = true;
      }
    }

    // if args.edit then edit the front matter
    if (verb === 'edit') {
      const fields = args._.slice(1) as Array<keyof Metadata>; // Explicitly assert fields as string array
      await editFrontMatter(cmarkDoc, fields);
    }

    // NOTE: either edit or draft setting caused a change, backup, write it out and exit
    if (cmarkDoc.changed) {
      if (confirm(`save ${filePath}?`)) {
        // Backup original file
        await createBackup(filePath);
        // Write output updated version
        await Deno.writeTextFile(filePath, commonMarkDocToString(cmarkDoc));
        console.log(`Wrote ${filePath}`);
      }
    }
    Deno.exit(0);
  }

  // OK, we must intend to engage the publication process.
  if (verb === 'publish') {
    await processFile(filePath, args.prefix, dateOfPost);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
