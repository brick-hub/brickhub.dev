import { Fragment } from "react";
import { json, redirect, useLoaderData } from "remix";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "remix";
import highlightStyleUrl from "highlight.js/styles/base16/tender.css";
import styles from "~/styles/details.css";
import { Header, SearchBar, Footer } from "~/components";
import { timeAgo } from "~/utils/time-ago";
import * as api from "~/utils/brickhub.server";
import { useOptionalUser } from "~/utils/user";

interface BrickDetailsData {
  name: string;
  version: string;
  bundle?: api.BrickBundle;
}

const brickVersionRegExp = new RegExp(
  /^(\d+)\.(\d+)\.(\d+)(-([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?(\+([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?/
);

export const meta: MetaFunction = ({ data }: { data: BrickDetailsData }) => {
  const title = `${data.name} | Brick Template`;
  const description = data.bundle?.description;
  return {
    title: title,
    ...(description && { description: description }),
    "twitter:card": "summary",
    ...(description && { "twitter:description": description }),
    "og:type": "website",
    "og:site_name": title,
    "og:title": title,
    ...(description && { "og:description": description }),
    "og:url": `https://brickhub.dev/bricks/${data.name}/${data.version}`,
  };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: highlightStyleUrl },
    { rel: "stylesheet", href: styles },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const name = params.name;
  const version = params.version;
  if (!name || !version) return redirect("/");

  const isSemanticVersion = brickVersionRegExp.test(version);
  if (!isSemanticVersion) return redirect("/");

  try {
    const bundle = await api.getBundle({ name, version });
    const headers = { "Cache-Control": "max-age=3600, immutable" };
    return json(
      {
        name,
        version,
        bundle,
      },
      { headers }
    );
  } catch (_) {
    return { name, version };
  }
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "no-cache",
  };
};

export default function BrickDetails() {
  const { name, version, bundle } = useLoaderData<BrickDetailsData>();
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex h-3/4 flex-1 flex-col">
        <SearchBar defaultValue={name} />
        <div className="h-9"></div>
        <div className="px-6">
          {bundle ? (
            <BrickDetailsCard bundle={bundle} />
          ) : (
            <BrickNotFoundCard name={name} version={version} />
          )}
        </div>
      </main>
      <Footer />
    </Fragment>
  );
}

function BrickNotFoundCard({
  name,
  version,
}: {
  name: string;
  version: string;
}) {
  return (
    <div className="m-auto flex w-full max-w-[51rem] flex-col items-start justify-center">
      <h2 className="text-3xl font-semibold text-red-500">404 Not Found</h2>
      <div>
        brick "{name}" v{version} was not found.
      </div>
    </div>
  );
}

function BrickDetailsCard({ bundle }: { bundle: api.BrickBundle }) {
  const publishedAt = timeAgo(new Date(bundle.createdAt));
  return (
    <div className="m-auto flex w-full max-w-[51rem] flex-col items-start justify-center">
      <h2 className="break-all text-4xl font-semibold text-red-500">
        {bundle.name} {bundle.version}
      </h2>
      <div>
        <span>Published {publishedAt}</span>
        <span className="px-1">•</span>
        <span>{bundle.publisher}</span>
      </div>
      <div className="h-4"></div>
      <p className="italic">{bundle.description}</p>
      <div className="h-4"></div>
      <InstallSnippet name={bundle.name} />
      <div className="h-9"></div>
      <Tabs bundle={bundle} />
    </div>
  );
}

function InstallSnippet({ name }: { name: string }) {
  const snippet = `mason add ${name}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(snippet);
  }

  return (
    <Fragment>
      <p>Install</p>
      <div className="h-1"></div>
      <code
        className="flex cursor-copy items-center justify-start gap-4 overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-dark-gray p-4 hover:bg-red-600/40"
        onClick={copyToClipboard}
      >
        {">"} {snippet}
        <ClipboardCopyIcon />
      </code>
    </Fragment>
  );
}

function Tabs({ bundle }: { bundle: api.BrickBundle }) {
  return (
    <Fragment>
      <div className="tabs w-full bg-dark-gray">
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab1"
          aria-controls="readme"
          defaultChecked
        />
        <label className="inline-block cursor-pointer p-4" htmlFor="tab1">
          Readme
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab2"
          aria-controls="changelog"
        />
        <label className="inline-block cursor-pointer p-4" htmlFor="tab2">
          Changelog
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab3"
          aria-controls="license"
        />
        <label className="inline-block cursor-pointer p-4" htmlFor="tab3">
          License
        </label>

        <div className="tab-contents max-w-5xl">
          <section id="readme" className="tab-content hidden w-full">
            <Markdown contents={bundle.readme} />
          </section>
          <section id="changelog" className="tab-content hidden w-full">
            <Markdown contents={bundle.changelog} />
          </section>
          <section id="license" className="tab-content hidden w-full">
            <Markdown contents={bundle.license} />
          </section>
        </div>
      </div>
    </Fragment>
  );
}

function Markdown({ contents }: { contents: string }) {
  return (
    <div className="w-full break-words rounded-md bg-dark-gray p-6">
      <article
        className="prose prose-invert prose-pre:bg-inherit prose-pre:p-0 prose-table:inline-block prose-table:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: contents }}
      ></article>
    </div>
  );
}

function ClipboardCopyIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>Copy to clipboard</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
      ></path>
    </svg>
  );
}
