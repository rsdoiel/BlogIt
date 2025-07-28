/**
 * frontMatterEditor.ts module curates front matter for Common Mark or Markdown documents. It is part of the BlogIt project. 
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
import { CommonMarkDoc } from "./commonMarkDoc.ts";
import { editTempData } from "./editor.ts";

export const metadataFields: Array<keyof Metadata> = [
  "title",
  "author",
  "contributor",
  "abstract",
  "draft",
  "dateCreated",
  "dateModified",
  "datePublished",
  "keywords",
  "series",
  "seriesNo",
  "copyrightYear",
  "copyrightHolder",
  "license"
];


export interface Metadata {
  title?: string;
  author: string;
  contributor?: string;
  abstract: string;
  dateCreated: string;
  dateModified: string;
  datePublished?: string;
  draft?: boolean;
  keywords?: string[];
  series?: string;
  seriesNo?: number;
  pubType?: string;
  copyrightYear?: number;
  copyrightHolder?: string;
  license?: string | URL;
}


function yyyymmdd(s: string): boolean {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormatRegex.test(s);
}

function assignValue<T extends keyof Metadata>(
  frontMatter: Record<string, unknown>,
  field: T,
  newValue: string,
) {
  let seriesNo = 0;
  if (newValue.trim() === '') {
    delete frontMatter[field];
    return;
  }
  switch (field) {
    case "abstract":
      frontMatter[field] = newValue;
      break;
    case "draft":
      if (newValue.toLowerCase() === "true") {
        frontMatter[field] = true;
      }
      break;
    case "keywords":
      frontMatter[field] = parse(newValue);
      //FIXME: if there are no keywords then we could remove the field
      break;
    case "series":
      frontMatter[field] = newValue;
      break;
    case "seriesNo":
      seriesNo = Number(newValue) || 0;
      if (seriesNo > 0) {
        frontMatter.seriesNo = seriesNo;
      } else {
        delete frontMatter.seriesNo;
      }
      break;
    case "copyrightYear":
      if (newValue.trim() === '') {
        delete frontMatter.copyrightYear;
      } else {
        frontMatter[field] = Number(newValue);
      }
      break;
    case "dateCreated":
    case "dateModified":
    case "datePublished":
      if (newValue.trim() !== '' && yyyymmdd(newValue.trim())) {
        frontMatter[field] = newValue.trim();
        delete frontMatter['draft'];
      } else {
        delete frontMatter[field];
      }
      break;
    default:
      frontMatter[field] = newValue.trim();
      break;
  }
}

function getDefaultValueAsString(frontMatter: Record<string, unknown>, field: string): string {
  switch (field) {
    case "draft":
	  if (frontMatter.datePublished === undefined || frontMatter.datePublished === null || frontMatter.datePublished === '') {
      	//NOTE: The default value is draft === true
      	return "true";
	  }
	  return '';
    case "dateCreated":
    case "dateModified":
      return (new Date()).toISOString().split("T")[0];
    default:
      return "";
  }
}

function getAttributeAsString(
  frontMatter: Record<string, unknown>,
  field: string,
): string {
  if (frontMatter[field] === undefined) {
    return '';
  }
  switch (field) {
    case "keywords":
      return stringify(frontMatter[field]);
    case "seriesNo":
    case "copyrightYear":
    case "draft":
      return `${frontMatter[field]}`;
  }
  return frontMatter[field] as string;
}

async function promptToEditFields(
  cmarkDoc: CommonMarkDoc,
  fields: Array<keyof Metadata>,
) {
  let keys = metadataFields;
  if (fields.length > 0) {
    keys = fields;
  }

  let changed = false;
  for (const key of keys) {
    // dateModified gets updated when the changed record is saved. We can skip it.
    if (key === 'dateModified') {
      continue
    }
    if (cmarkDoc.frontMatter[key] === undefined) {
      assignValue(cmarkDoc.frontMatter, key, getDefaultValueAsString(cmarkDoc.frontMatter, key));
    }
    // NOTE: draft and pub date are connected. A draft can't have a datePublished
    if (key === 'draft' && cmarkDoc.frontMatter.draft)  {
      delete cmarkDoc.frontMatter.datePublished;
    }
    // NOTE: Need to handle the case where draft has been set to false and a pub date is not yet set.
    // It should default to today like dateCreated and dateModified do.
    if (key === 'datePublished' && cmarkDoc.frontMatter.datePublished === '') {
      if (cmarkDoc.frontMatter.draft === undefined || cmarkDoc.frontMatter.draft === false) {
        cmarkDoc.frontMatter.datePublished = (new Date()).toISOString().split("T")[0];
      }
    }
    // NOTE: we need to display the value in string form to prompt for editing.
    let val: string = getAttributeAsString(cmarkDoc.frontMatter, key);
    if (confirm(`${key}:\n${val}\nedit ${key}?`)) {
      const oldVal = val;
      //FIXME: call the editor to edit the value then convert it back usign assignValue
      val = await editTempData(val);
      if (oldVal !== val) {
        changed = true;
        assignValue(cmarkDoc.frontMatter, key, val);
      }
    }
  }
  cmarkDoc.changed = changed;
  // Make sure that date modified is updated on change
  if (cmarkDoc.changed && cmarkDoc.frontMatter !== undefined && cmarkDoc.frontMatter.dateModified !== "") {
    cmarkDoc.frontMatter.dateModified = (new Date()).toISOString().split("T")[0];
  }
}

export async function editFrontMatter(
  cmarkDoc: CommonMarkDoc,
  fields: Array<keyof Metadata>,
) {
  await promptToEditFields(cmarkDoc, fields);
}

export function applyDefaults(cmarkDoc: CommonMarkDoc, defaults: Record<string, unknown>) {
  for (const k of Object.keys(defaults)) {
    switch (cmarkDoc.frontMatter[k]) {
      case undefined:
        cmarkDoc.frontMatter[k] = defaults[k];
        cmarkDoc.changed = true;
        break;
      case null:
        cmarkDoc.frontMatter[k] = defaults[k];
        cmarkDoc.changed = true;
        break;
      case '':
        cmarkDoc.frontMatter[k] = defaults[k];
        cmarkDoc.changed = true;
        break;
      case 0:
        cmarkDoc.frontMatter[k] = defaults[k];
        cmarkDoc.changed = true;
        break;
    }
  }
}
