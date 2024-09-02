import markdownit from "markdown-it";
import { parse } from "yaml";

const md = markdownit();

export function sectionsFromHeadings(body) {
  const headingRegex = /\n#{2} (.*)/g;
  const headings = [...body.matchAll(headingRegex)];

  const sections = [];
  for (let i = 0; i < headings.length; i++) {
    const [match, capture] = headings[i];
    const start = headings[i].index;

    const offset =
      i + 1 === headings.length ? body.length : headings[i + 1].index;

    const content = body.slice(start + match.length, offset).trim();
    sections.push({
      title: capture,
      content,
      content_html: md.render(content).trim(),
    });
  }

  return sections;
}

export default function parseFile({ id, buffer }) {
  const source = buffer.toString();
  const [header, headerContent] = source.match(/---\n(.*)---\n/s);

  let body = source.replace(header, "");
  body = md.render(body);

  const meta = parse(headerContent);

  if ("layout" in meta) {
    delete meta.layout;
  }

  return {
    id,
    title: meta.title,
    body,
    meta,
    sections: sectionsFromHeadings(source),
  };
}
