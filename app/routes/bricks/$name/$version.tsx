import { LoaderFunction, redirect, useLoaderData } from "remix";
import { Header } from "~/components/header";
import { SearchBar } from "~/components/search-bar";
import { BrickArtifact, getArtifact } from "~/services/brickhub-service";
import { Markdown } from "~/components/markdown";
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
        <div className="px-6 w-full">
          <BrickDetailsCard brick={brick} />
        </div>
      </main>
    </div>
  );
}

function BrickDetailsCard({ brick }: { brick: BrickArtifact }) {
  return (
    <div className="max-w-[59rem] m-auto flex flex-col justify-center items-start">
      <div>
        <h2 className="text-red-500 text-4xl">
          {brick.name} {brick.version}
        </h2>
      </div>
      <p className="italic">{brick.description}</p>
      <Tabs brick={brick} />
    </div>
  );
}

function Tabs({ brick }: { brick: BrickArtifact }) {
  return (
    <Fragment>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li>
            <a
              href="#"
              className="inline-block py-4 px-4 text-sm font-medium text-center text-red-600 rounded-t-lg border-b-2 border-red-600 active dark:text-red-500 dark:border-red-500"
              aria-current="page"
            >
              README
            </a>
          </li>
        </ul>
      </div>
      <div className="h-4"></div>
      <Markdown content={brick.readme} />
    </Fragment>
  );
}
