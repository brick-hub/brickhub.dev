import { Fragment } from "react";
import { Header, SearchBar, Footer } from "~/components";
import { timeAgo } from "~/utils/time-ago";
import type * as api from "~/brickhub.server";
import highlightStyleUrl from "highlight.js/styles/vs2015.css";
import styles from "~/styles/details.css";
import { useOptionalUser } from "~/utils/user";
import { useLoaderData } from "@remix-run/react";
import type { HeadersFunction, LinksFunction } from "@remix-run/node";

export const brickVersionRegExp = new RegExp(
  /^(\d+)\.(\d+)\.(\d+)(-([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?(\+([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?/
);

export interface BrickDetailsData {
  name: string;
  version: string;
  details?: api.BrickDetails;
}

export const brickDetailsLinks: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: highlightStyleUrl },
    { rel: "stylesheet", href: styles },
  ];
};

export let brickDetailsHeaders: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "no-cache",
  };
};

export function BrickDetails() {
  const { name, version, details } = useLoaderData<BrickDetailsData>();
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex h-3/4 flex-1 flex-col">
        <SearchBar defaultValue={name} />
        <div className="h-9"></div>
        {details ? (
          <BrickDetailsCard details={details} />
        ) : (
          <BrickNotFoundCard name={name} version={version} />
        )}
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
    <div className="w-full px-6">
      <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
        <h2 className="text-3xl font-semibold text-red-500">404 Not Found</h2>
        <div>
          brick "{name}" v{version} was not found.
        </div>
      </div>
    </div>
  );
}

function BrickDetailsCard({ details }: { details: api.BrickDetails }) {
  const publishedAt = timeAgo(new Date(details.updatedAt));
  return (
    <Fragment>
      <div className="w-full px-6">
        <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
          <h2 className="break-all text-2xl font-semibold text-red-500 xl:text-4xl">
            {details.name} {details.version}
          </h2>
          <div>
            <span>Published {publishedAt}</span>
            <span className="px-1">???</span>
            <span>{details.publisher}</span>
          </div>
          <div className="h-4"></div>
          <p className="italic">{details.description}</p>
          <div className="h-4"></div>
          <RepositoryUrl url={details.repository} />
          <div className="h-4"></div>
          <InstallSnippet name={details.name} />
        </div>
      </div>
      <div className="w-full">
        <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
          <div className="h-9"></div>
          <Tabs details={details} />
        </div>
      </div>
    </Fragment>
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
        className="flex max-w-full cursor-copy items-center justify-start gap-4 overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-dark-gray p-4 hover:bg-red-600/40"
        onClick={copyToClipboard}
      >
        {">"} {snippet}
        <ClipboardCopyIcon />
      </code>
    </Fragment>
  );
}

function RepositoryUrl({ url }: { url: string }) {
  const _url = new URL(url);
  const pathSegments = _url.pathname.split("/").slice(1, 3).join("/");
  const prettyUrl = `${_url.host}/${pathSegments}`;
  return (
    <Fragment>
      <p>Repository</p>
      <div className="h-1"></div>
      <a
        aria-label="repository"
        className="flex max-w-full items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-red-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={url}
      >
        <span>
          <GitIcon />
        </span>
        <span>{prettyUrl}</span>
      </a>
    </Fragment>
  );
}

function GitIcon() {
  return (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 97 97"
      enableBackground="new 0 0 97 97"
      xmlSpace="preserve"
      aria-hidden="true"
    >
      <title>Repository</title>
      <g>
        <path
          fill="#F05133"
          d="M92.71,44.408L52.591,4.291c-2.31-2.311-6.057-2.311-8.369,0l-8.33,8.332L46.459,23.19   c2.456-0.83,5.272-0.273,7.229,1.685c1.969,1.97,2.521,4.81,1.67,7.275l10.186,10.185c2.465-0.85,5.307-0.3,7.275,1.671   c2.75,2.75,2.75,7.206,0,9.958c-2.752,2.751-7.208,2.751-9.961,0c-2.068-2.07-2.58-5.11-1.531-7.658l-9.5-9.499v24.997   c0.67,0.332,1.303,0.774,1.861,1.332c2.75,2.75,2.75,7.206,0,9.959c-2.75,2.749-7.209,2.749-9.957,0c-2.75-2.754-2.75-7.21,0-9.959   c0.68-0.679,1.467-1.193,2.307-1.537V36.369c-0.84-0.344-1.625-0.853-2.307-1.537c-2.083-2.082-2.584-5.14-1.516-7.698   L31.798,16.715L4.288,44.222c-2.311,2.313-2.311,6.06,0,8.371l40.121,40.118c2.31,2.311,6.056,2.311,8.369,0L92.71,52.779   C95.021,50.468,95.021,46.719,92.71,44.408z"
        />
      </g>
    </svg>
  );
}

function Tabs({ details }: { details: api.BrickDetails }) {
  return (
    <Fragment>
      <div className="tabs w-full">
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab1"
          aria-controls="readme"
          defaultChecked
        />
        <label className="inline-block cursor-pointer p-3" htmlFor="tab1">
          Readme
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab2"
          aria-controls="usage"
        />
        <label className="inline-block cursor-pointer p-3" htmlFor="tab2">
          Usage
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab3"
          aria-controls="changelog"
        />
        <label className="inline-block cursor-pointer p-3" htmlFor="tab3">
          Changelog
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab4"
          aria-controls="license"
        />
        <label className="inline-block cursor-pointer p-3" htmlFor="tab4">
          License
        </label>

        <div className="h-4"></div>

        <div className="tab-contents max-w-5xl">
          <section id="readme" className="tab-content hidden w-full">
            <Markdown contents={details.readme} />
          </section>
          <section id="usage" className="tab-content hidden w-full">
            <Markdown contents={details.usage} />
          </section>
          <section id="changelog" className="tab-content hidden w-full">
            <Markdown contents={details.changelog} />
          </section>
          <section id="license" className="tab-content hidden w-full">
            <Markdown contents={details.license} />
          </section>
        </div>
      </div>
    </Fragment>
  );
}

function Markdown({ contents }: { contents: string }) {
  return (
    <div className="w-full break-words rounded-md bg-dark-gray p-5">
      <article
        className="prose prose-invert prose-a:inline-block prose-a:break-all prose-code:rounded-md prose-pre:bg-inherit prose-pre:p-0 prose-table:m-0 prose-table:inline-block prose-table:overflow-x-auto prose-img:m-0 prose-img:inline-block prose-hr:my-6"
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
