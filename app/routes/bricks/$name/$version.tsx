import {
  HeadersFunction,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { Header, SearchBar, Markdown, Footer } from "~/components";
import { BrickArtifact, getArtifact, timeAgo } from "~/utils";
import { Fragment } from "react";

interface BrickResponse {
  name: string;
  version: string;
  artifact?: BrickArtifact;
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
    const artifact = await getArtifact({ name, version });
    const headers = { "Cache-Control": "max-age=3600, immutable" };
    return json(
      {
        name,
        version,
        artifact,
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
  const response = useLoaderData<BrickResponse>();
  return (
    <Fragment>
      <Header />
      <main className="flex flex-1 flex-col h-3/4">
        <SearchBar placeholder={response.name} />
        <div className="h-9"></div>
        <div className="px-6">
          {response.artifact ? (
            <BrickDetailsCard brick={response.artifact} />
          ) : (
            <BrickNotFoundCard {...response} />
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

function BrickDetailsCard({ brick }: { brick: BrickArtifact }) {
  const publishedAt = timeAgo(new Date(brick.createdAt));
  return (
    <div className="w-full max-w-[51rem] m-auto flex flex-col justify-center items-start">
      <h2 className="text-red-500 text-4xl font-semibold">
        {brick.name} {brick.version}
      </h2>
      <div>
        <span>Published {publishedAt}</span>
        <span className="px-1">•</span>
        <span>{brick.publisher}</span>
      </div>
      <div className="h-4"></div>
      <p className="italic">{brick.description}</p>
      <div className="h-4"></div>
      <InstallSnippet name={brick.name} />
      <div className="h-9"></div>
      <Readme readme={brick.readme}></Readme>
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
        onClick={copyToClipboard}
        className="p-4 bg-dark-gray overflow-ellipsis whitespace-nowrap rounded-md hover:bg-red-600/40 cursor-pointer"
      >
        {">"} {snippet}
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
