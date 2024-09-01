import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { sectionsFromHeadings } from "./parse-file.mjs";
const text = readFileSync("raw/asa.md").toString();

const [header, headerContent] = text.match(/---\n(.*)---/s);

const body = text.replace(header, "");

const sections = sectionsFromHeadings(body);

console.log(sections);
