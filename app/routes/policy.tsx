import { redirect } from "@remix-run/node";
import Markdoc from "@markdoc/markdoc";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { Footer, Header } from "~/components";
import { useOptionalUser } from "~/utils/user";

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
  const html = Markdoc.renderers.html(content);
  return { html };
};

export default function Policy() {
  const { html } = useLoaderData<typeof loader>();
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex h-3/4 flex-1 flex-col">
        <div
          className="prose prose-invert mx-auto w-11/12 py-6 xl:w-10/12 2xl:w-[1280px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
    </Fragment>
  );
}
