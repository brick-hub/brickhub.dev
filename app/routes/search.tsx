import { LoaderFunction, useLoaderData } from "remix";
import { Header } from "~/components/header";
import { SearchBar } from "~/components/search-bar";
import { BrickMetaData } from "~/services/brickhub-service";
import { timeAgo } from "~/utils";

interface BricksResponse {
  query: string;
  results: [BrickMetaData];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const results = Array<BrickMetaData>(20).fill({
    name: "hello",
    description: "An example brick.",
    version: "0.1.0+1",
    environment: {
      mason: ">=0.1.0-dev <0.1.0",
    },
    vars: {
      name: {
        type: "string",
        description: "Your name",
        default: "Dash",
        prompt: "What is your name?",
      },
    },
    hooks: [],
    publisher: "felangelov@gmail.com",
    createdAt: "2022-03-11T04:05:43.793879Z",
  });
  return {
    query,
    results,
  };
};

export default function Search() {
  const { query, results } = useLoaderData<BricksResponse>();
  return (
    <div className="flex flex-col flex-1 h-screen">
      <Header />
      <main className="h-3/4">
        <SearchBar placeholder={query} />
        <div className="px-6 sm:px-8 pt-9 lg:pt-0">
          <p className="text-gray-400 lg:pt-6 italic text-sm">
            Found {results.length} results for "{query}"
          </p>

          <div className="divide-y divide-slate-400/25">
            {results.map((result) => {
              return <ResultTile result={result} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function ResultTile({ result }: { result: BrickMetaData }) {
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
