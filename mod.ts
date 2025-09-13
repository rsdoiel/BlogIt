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
import * as yaml from "@std/yaml";
import { checkDirectory, checkFile, createBackup, publishFile, showFrontMatter } from "./src/blogit.ts";
import { Metadata, editFrontMatter, applyDefaults, getFileCreationDate } from "./src/frontMatter.ts";
import {
  CommonMarkDoc,
  commonMarkDocPreprocessor,
  commonMarkDocToString,
  stringToCommonMarkDoc,
} from "./src/commonMarkDoc.ts";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { helpText, fmtHelp } from "./helptext.ts";


async function main() {
  const appName = 'blogit';
  const args = parseArgs(Deno.args, {
    boolean: ["help", "version", "license", "draft", "check", "edit", "publish", "process", "show" ],
    string: ["prefix", "apply"],
    alias: {
      h: "help",
      v: "version",
      l: "license",
      a: "apply",
      p: "prefix",
      c: "check",
      d: "draft",
      e: "edit",
      P: "process",
      s: "show",
    },
    default: {
      prefix: "blog",
      apply: "",
    },
  });

  if (args.help) {
    console.log(
      fmtHelp(helpText, appName, version, releaseDate, releaseHash)
    );
    Deno.exit(0);
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
  switch (args._[0] as string) {
    case "apply":
      // Shift "apply" off the args, then assign the value from the next parameter
      args._.shift();
      if (args._[0] !== undefined) {
        args.apply = args._.shift() as string;
      } else {
        console.error(`Missing defaults YAML filename`);
        Deno.exit(1);
      }
      break;
    case "check":
      args.check = true;
      args._.shift();
      break;
    case "edit":
      args.edit = true;
      args._.shift();
      break;
    case "draft":
      args.draft = true;
      args._.shift();
      break;
    case "process":
      args.process = true;
      args._.shift();
      break;
    case "publish":
      args.publish = true
      args._.shift();
      break;
    case "show":
      args.show = true
      args._.shift();
      break;
  }

  const filePath = args._[0] as string; // Explicitly assert filePath as string
  const dateOfPost = args._[1] as string | undefined; // Explicitly assert dateOfPost as string or undefined

  if (args.check) {
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
  const today = (new Date()).toISOString().split('T')[0];

  if (cmarkDoc.frontMatter.dateCreated === undefined) {
    // Get the file creation date
    let fileDateCreated = await (getFileCreationDate(filePath));
    if (fileDateCreated == null) {
      cmarkDoc.frontMatter.dateCreated = today;
    } else {
      cmarkDoc.frontMatter.dateCreated = fileDateCreated.toISOString().split('T')[0];
    }
    cmarkDoc.changed = true;
  }
  if (args.draft || args.edit || args.apply !== "") {
    // Set to draft is args.draft is true
    if (args.draft) {
      console.log(`DEBUG cmarkDoc.frontMatter -> ${JSON.stringify(cmarkDoc.frontMatter)}`);
      if (cmarkDoc.frontMatter.draft === undefined || cmarkDoc.frontMatter.draft === false) {
        cmarkDoc.frontMatter.draft = true;
        delete cmarkDoc.frontMatter.datePublished;
        cmarkDoc.changed = true;
      }
    }

    // Apply defaults if requested
    if (args.apply !== "") {
      const data = await Deno.readTextFile(args.apply);
      const dafaults: Record<string, unknown> = yaml.parse(data) as Record<string, unknown>;
      applyDefaults(cmarkDoc, dafaults);
    }

    // if args.edit then edit the front matter
    if (args.edit) {
      const fields = args._.slice(1) as Array<keyof Metadata>; // Explicitly assert fields as string array
      await editFrontMatter(cmarkDoc, fields);
    }
    if (cmarkDoc.frontMatter.dateModified === undefined) {
      cmarkDoc.frontMatter.dateModified = today;
      cmarkDoc.changed = true;
    }

  	// Display the front matter
    showFrontMatter(cmarkDoc);
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

  if (args.show) {
    // Display the front matter
    showFrontMatter(cmarkDoc);
    Deno.exit(0);
  }

  if (args.publish) {
    // OK, we must intend to engage the publication process.
    await publishFile(filePath, args.prefix, args.process, dateOfPost);
    Deno.exit(0);
  }

  // If args.process then run the preprocessor and write the output to standard out
  if (args.process) {
    let src: string = '';
    try {
      src = commonMarkDocPreprocessor(cmarkDoc);
    } catch (err) {
      console.error(err);
      Deno.exit(1);
    }
    if (src === '') {
      console.error(`no content after preprocessor ran for ${filePath}`)
      Deno.exit(1);
    }
    console.log(src);
    Deno.exit(0);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
