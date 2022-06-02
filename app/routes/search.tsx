import { Fragment } from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Footer, Header, SearchBar } from "~/components";
import { timeAgo } from "~/utils/time-ago";
import * as api from "~/utils/brickhub.server";
import { useOptionalUser } from "~/utils/user";

interface BrickSearchData {
  query: string;
  results?: [api.BrickSearchResult];
  total: number;
  page: number;
}

export const meta: MetaFunction = ({ data }: { data: BrickSearchData }) => {
  const query = data.query === "" ? "top bricks" : data.query;
  return {
    title: `Search results for ${query}.`,
  };
};

const limit = 10;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const p = url.searchParams.get("page");
  const page = p ? parseInt(p) : 1;
  try {
    const results = await api.search({
      query,
      offset: (page - 1) * limit,
      limit,
    });
    return {
      query,
      results: results.bricks,
      total: results.total,
      page,
    };
  } catch (error) {
    return { query, results: [], total: 0, error: `${error}` };
  }
};

export default function BrickSearch() {
  const { query, results, total, page } = useLoaderData<BrickSearchData>();
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex-1">
        <SearchBar defaultValue={query} />
        <div className="px-6 pt-9 lg:pt-0">
          <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
            {results ? (
              <SearchResults
                results={results}
                query={query}
                total={total}
                page={page}
              />
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
  total,
  page,
}: {
  results: [api.BrickSearchResult];
  query: string;
  total: number;
  page: number;
}) {
  return (
    <Fragment>
      <p className="text-gray-400 text-sm italic lg:pt-6">
        Found {total} result(s) {query !== "" ? `for "${query}"` : ""}
      </p>

      <div className="w-full divide-y divide-slate-400/25">
        {results.map((result) => {
          return <ResultItem key={result.name} result={result} />;
        })}
      </div>

      <Pagination
        query={query}
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
      />
    </Fragment>
  );
}

function Pagination({
  query,
  currentPage,
  totalPages,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages === 0) return <Fragment></Fragment>;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    const isCurrentPage = i == currentPage;
    pages.push(
      <li
        key={i}
        className={
          isCurrentPage
            ? "rounded-sm bg-red-700 py-4 px-5"
            : "rounded-sm py-4 px-5 text-red-700"
        }
      >
        {isCurrentPage ? (
          <span>{i}</span>
        ) : (
          <a href={`/search?q=${query}&page=${i}`} className="cursor-pointer">
            <span>{i}</span>
          </a>
        )}
      </li>
    );
  }
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;
  return (
    <ul className="my-5 mx-auto flex w-full list-none justify-center text-center font-semibold">
      <li
        key="prev"
        className={
          isFirstPage
            ? "rounded-sm py-4 px-5 text-slate-700"
            : "rounded-sm py-4 px-5 text-red-700"
        }
      >
        {isFirstPage ? (
          <span>&lt;</span>
        ) : (
          <a
            href={`/search?q=${query}&page=${currentPage - 1}`}
            className="cursor-pointer"
            rel="prev"
          >
            <span>&lt;</span>
          </a>
        )}
      </li>
      {...pages}
      <li
        key="next"
        className={
          isLastPage
            ? "rounded-sm py-4 px-5 text-slate-700"
            : "rounded-sm py-4 px-5 text-red-700"
        }
      >
        {isLastPage ? (
          <span>&gt;</span>
        ) : (
          <a
            href={`/search?q=${query}&page=${currentPage + 1}`}
            className="cursor-pointer"
            rel="next"
          >
            <span>&gt;</span>
          </a>
        )}
      </li>
    </ul>
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
