import { marked } from "marked";

export function Markdown({ content }: { content: string }) {
  return (
    <article
      className="prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    ></article>
  );
}
