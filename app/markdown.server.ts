export async function markdownToHtml(markdownString: string) {
  const { unified } = await import("unified");
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remark2rehype } = await import("remark-rehype");
  const { default: rehypeRaw } = await import("rehype-raw");
  const { default: rehypeHighlight } = await import("rehype-highlight");
  const { default: rehypeStringify } = await import("rehype-stringify");
  const { default: dart } = await import("highlight.js/lib/languages/dart");
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { languages: { dart }, ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdownString);

  return result.value.toString();
}
