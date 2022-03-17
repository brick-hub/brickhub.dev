import { Fragment } from "react";
import {
  HeadersFunction,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { Header, SearchBar, Markdown, Footer } from "~/components";
import { BrickBundle, timeAgo } from "~/utils";
import * as api from "~/utils/brickhub.server";

interface BrickDetailsData {
  name: string;
  version: string;
  bundle?: BrickBundle;
}

const brickVersionRegExp = new RegExp(
  /^(\d+)\.(\d+)\.(\d+)(-([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?(\+([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?/
);

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
  return (
    <Fragment>
      <Header />
      <main className="flex flex-1 flex-col h-3/4">
        <SearchBar placeholder={name} />
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
    <div className="w-full max-w-[51rem] m-auto flex flex-col justify-center items-start">
      <h2 className="text-red-500 text-3xl font-semibold">404 Not Found</h2>
      <div>
        brick "{name}" v{version} was not found.
      </div>
    </div>
  );
}

function BrickDetailsCard({ bundle }: { bundle: BrickBundle }) {
  const publishedAt = timeAgo(new Date(bundle.createdAt));
  return (
    <div className="w-full max-w-[51rem] m-auto flex flex-col justify-center items-start">
      <h2 className="text-red-500 text-4xl font-semibold">
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
      <Readme readme={bundle.readme}></Readme>
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
        className="p-4 bg-dark-gray rounded-md hover:bg-red-600/40 overflow-ellipsis whitespace-nowrap flex gap-4 justify-center items-top cursor-copy"
        onClick={copyToClipboard}
      >
        {">"} {snippet}
        <ClipboardCopyIcon />
      </code>
    </Fragment>
  );
}

function Readme({ readme }: { readme: string }) {
  return (
    <div className="w-full bg-dark-gray p-6 rounded-md">
      <Markdown content={readme} />
    </div>
  );
}

function ClipboardCopyIcon() {
  return (
    <svg
      className="w-5 h-5"
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
