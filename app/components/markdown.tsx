import { marked } from "marked";

export function Markdown({ content }: { content: string }) {
  return (
    <article
      className="prose prose-invert"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    ></article>
  );
}
