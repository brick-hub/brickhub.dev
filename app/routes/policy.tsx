import Markdoc from "@markdoc/markdoc";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { h } from "hastscript";
import { Fragment } from "react";
import { rehype } from "rehype";
import rehypeAutolinkHeadings, { type Options } from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { Footer, Header } from "~/components";
import { useOptionalUser } from "~/utils/user";

const AnchorLinkIcon = h(
  "span",
  { ariaHidden: "true", class: "anchor-icon" },
  h(
    "svg",
    { width: 24, height: 24, viewBox: "0 0 24 24" },
    h("path", {
      fill: "currentcolor",
      d: "m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z",
    })
  )
);

const options: Options = {
  properties: { class: "anchor-link" },
  behavior: "after",
  group: ({ tagName }) =>
    h("div", { tabIndex: -1, class: `heading-wrapper level-${tagName}` }),
  content: () => [AnchorLinkIcon],
};

export const loader: LoaderFunction = async ({ request }) => {
  const response = await fetch(
    "https://raw.githubusercontent.com/brick-hub/brickhub.dev/refs/heads/main/docs/policy.md"
  );

  // Fallback to previous behavior.
  if (response.status != 200) {
    return redirect(
      "https://github.com/brick-hub/brickhub.dev/blob/main/docs/policy.md"
    );
  }

  const doc = await response.text();
  const ast = Markdoc.parse(doc);
  const content = Markdoc.transform(ast);
  const raw = Markdoc.renderers.html(content);
  const html = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, options)
    .process(raw.replace("<h1>brickhub.dev policy</h1>", ""));

  return { html: String(html) };
};

export default function Policy() {
  const { html } = useLoaderData<typeof loader>();
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex h-3/4 flex-1 flex-col">
        <div
          className="markdown-content mx-auto w-11/12 xl:w-10/12 2xl:w-[1280px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
    </Fragment>
  );
}
