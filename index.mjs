import { extname, resolve } from "node:path";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { create } from "xmlbuilder2";
import markdownit from "markdown-it";
const dir = "./raw";

const md = markdownit();

const objects = readdirSync(dir)
  .filter((p) => extname(p) === ".md")
  .map((fileName) => {
    const markdown = readFileSync(resolve(dir, fileName)).toString();
    const body = md.render(markdown);
    const [[match, title]] = [...body.matchAll(/<p>(.*)<\/p>/g)];
    return {
      id: fileName.replace(".md", ""),
      title,
      body,
    };
  });

const doc = create({ version: "1.0", encoding: "UTF-8" });

const root = doc.ele("formulary", { version: "6.6.6" });
for (let i = 0; i < objects.length; i++) {
  root
    .ele("drug", { id: objects[i].id })
    .ele("title")
    .dat(objects[i].title)
    .up()
    .ele("body")
    .dat(objects[i].body);
}

writeFileSync(
  "formulary.xml",
  doc.end({
    prettyPrint: true,
  })
);
