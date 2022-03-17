import { Fragment } from "react";
import { LoaderFunction, useLoaderData } from "remix";
import { Footer, Header, SearchBar } from "~/components";
import { searchBricks, BrickSearchResult, timeAgo } from "~/utils";

interface BricksResponse {
  query: string;
  results?: [BrickSearchResult];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  try {
    const results = await searchBricks({ query });
    return {
      query,
      results,
    };
  } catch (error) {
    return { query, results: [], error: `${error}` };
  }
};

export default function Search() {
  const { query, results } = useLoaderData<BricksResponse>();
  return (
    <Fragment>
      <Header />
      <main className="flex-1">
        <SearchBar placeholder={query} />
        <div className="px-6 pt-9 lg:pt-0">
          <div className="w-full max-w-[51rem] m-auto flex flex-col justify-center items-start">
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
      <p className="text-red-600 lg:pt-6 italic text-sm">
        An error occurred while searching for "{query}".
      </p>
    </Fragment>
  );
}

function SearchResults({
  results,
  query,
}: {
  results: [BrickSearchResult];
  query: string;
}) {
  return (
    <Fragment>
      <p className="text-gray-400 lg:pt-6 italic text-sm">
        Found {results.length} result(s) for "{query}"
      </p>

      <div className="divide-y divide-slate-400/25 w-full">
        {results.map((result) => {
          return <ResultTile key={result.name} result={result} />;
        })}
      </div>
    </Fragment>
  );
}

function ResultTile({ result }: { result: BrickSearchResult }) {
  const publishedAt = timeAgo(new Date(result.createdAt));
  return (
    <section className="py-6">
      <div>
        <a
          className="text-red-500 text-xl"
          target="_self"
          href={`/bricks/${result.name}/${result.version}`}
        >
          {result.name}
        </a>
      </div>
      <p className="italic">{result.description}</p>
      <div className="text-gray-400 text-sm">
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
