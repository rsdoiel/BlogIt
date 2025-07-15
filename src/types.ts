/**
 * types.ts module defines the metadata expected in the front matter. It is part of the BlogIt program.
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
  "pubType",
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
