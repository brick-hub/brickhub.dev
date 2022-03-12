import { marked } from "marked";

function Markdown({ content }: { content: string }) {
  return (
    <article
      className="prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    ></article>
  );
}

export { Markdown };
