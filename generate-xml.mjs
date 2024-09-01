import { create } from "xmlbuilder2";

export default function generateXml(objects) {
  const doc = create({ version: "1.0", encoding: "UTF-8" });

  const root = doc.ele("formulary", { version: "6.6.6" });
  for (let i = 0; i < objects.length; i++) {
    const drug = root
      .ele("drug", { id: objects[i].id })
      .ele("title")
      .dat(objects[i].title)
      .up()
      .ele("body")
      .dat(objects[i].body)
      .up();

    drug.ele("meta").ele("scope").dat(objects[i].meta.scope);

    const sections = drug.ele("sections");

    objects[i].sections.forEach((section) => {
      sections
        .ele("section", { title: section.title })
        .ele("content", { format: "markdown" })
        .dat(section.content)
        .up()
        .ele("content", { format: "html" })
        .dat(section.content_html);
    });
  }

  return doc.end({
    prettyPrint: true,
  });
}
