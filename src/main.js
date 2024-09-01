import { extname, resolve, basename } from "node:path";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import parseFile from "./helpers/parse-file.js";
import generateXml from "./helpers/generate-xml.js";

const dir = "./raw";

const objects = readdirSync(dir)
  .filter((p) => extname(p) === ".md")
  .map((filename) => resolve(dir, filename))
  .map((path) => ({
    id: basename(path).replace(".md", ""),
    buffer: readFileSync(path),
  }))
  .map(parseFile);

writeFileSync("public/formulary.xml", generateXml(objects));

writeFileSync("public/formulary.json", JSON.stringify(objects));
