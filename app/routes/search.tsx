import { Fragment } from "react";
import { useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import { Footer, Header, SearchBar } from "~/components";
import { timeAgo } from "~/utils/time-ago";
import * as api from "~/utils/brickhub.server";

interface BrickSearchData {
  query: string;
  results?: [api.BrickSearchResult];
}

export const meta: MetaFunction = ({ data }: { data: BrickSearchData }) => {
  const query = data.query === "" ? "top bricks" : data.query;
  return {
    title: `Search results for ${query}.`,
    description:
      "BrickHub is the official registry for publishing, discovering, and consuming reusable brick templates.",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  try {
    const results = await api.search({ query });
    return {
      query,
      results,
    };
  } catch (error) {
    return { query, results: [], error: `${error}` };
  }
};

export default function BrickSearch() {
  const { query, results } = useLoaderData<BrickSearchData>();
  return (
    <Fragment>
      <Header />
      <main className="flex-1">
        <SearchBar defaultValue={query} />
        <div className="px-6 pt-9 lg:pt-0">
          <div className="m-auto flex w-full max-w-[51rem] flex-col items-start justify-center">
            {results ? (
              <SearchResults results={results} query={query} />
            ) : (
              <SearchError query={query} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
}

function SearchError({ query }: { query: string }) {
  return (
    <Fragment>
      <p className="text-sm italic text-red-600 lg:pt-6">
        An error occurred while searching for "{query}".
      </p>
    </Fragment>
  );
}

function SearchResults({
  results,
  query,
}: {
  results: [api.BrickSearchResult];
  query: string;
}) {
  return (
    <Fragment>
      <p className="text-sm italic text-gray-400 lg:pt-6">
        Found {results.length} result(s) {query !== "" ? `for "${query}"` : ""}
      </p>

      <div className="w-full divide-y divide-slate-400/25">
        {results.map((result) => {
          return <ResultItem key={result.name} result={result} />;
        })}
      </div>
    </Fragment>
  );
}

function ResultItem({ result }: { result: api.BrickSearchResult }) {
  const publishedAt = timeAgo(new Date(result.createdAt));
  return (
    <section className="py-6">
      <div>
        <a
          className="text-xl text-red-500"
          target="_self"
          href={`/bricks/${result.name}/${result.version}`}
        >
          {result.name}
        </a>
      </div>
      <p className="italic">{result.description}</p>
      <div className="text-sm text-gray-400">
        <span>
          v
          <a
            className="text-red-500"
            href={`/bricks/${result.name}/${result.version}`}
          >
            {result.version}
          </a>
        </span>
        <span className="px-1"></span>
        <span>({publishedAt})</span>
        <span className="px-1"></span>
        <span>{result.publisher}</span>
      </div>
    </section>
  );
}
