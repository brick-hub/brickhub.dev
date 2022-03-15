import { LoaderFunction, redirect, useLoaderData } from "remix";
import { Header, SearchBar, Markdown } from "~/components";
import { BrickArtifact, getArtifact, timeAgo } from "~/utils";
import { Fragment } from "react";

export const loader: LoaderFunction = async ({ params }) => {
  const name = params.name;
  const version = params.version;
  if (!name || !version) return redirect("/");
  return await getArtifact({ name, version });
};

export default function BrickDetails() {
  const brick = useLoaderData<BrickArtifact>();
  return (
    <div className="h-screen">
      <Header />
      <main className="h-3/4">
        <SearchBar placeholder={brick.name} />
        <div className="h-9"></div>
        <div className="px-6">
          <BrickDetailsCard brick={brick} />
        </div>
      </main>
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
  const snippet = `mason add -g ${name}`;
  return (
    <Fragment>
      <p>Install</p>
      <div className="h-1"></div>
      <code className="p-3 bg-dark-gray overflow-ellipsis whitespace-nowrap rounded-md hover:bg-red-500/60 cursor-pointer">
        {">"} {snippet}
      </code>
    </Fragment>
  );
}

function Readme({ readme }: { readme: string }) {
  return (
    <div className="w-full">
      <h2 className="text-4xl font-bold">README</h2>
      <hr className="my-4 border-slate-700" />
      <Markdown content={readme} />
    </div>
  );
}
