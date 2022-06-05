import { Fragment } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Footer, Header, SearchBar } from "~/components";
import { timeAgo } from "~/utils/time-ago";
import * as api from "~/utils/brickhub.server";
import { useOptionalUser } from "~/utils/user";

type Sort = "updated" | "popularity";

interface BrickSearchData {
  query: string;
  results?: [api.BrickSearchResult];
  total: number;
  page: number;
  sort: Sort;
}

export const meta: MetaFunction = ({ data }: { data: BrickSearchData }) => {
  return {
    title:
      data.query !== ""
        ? `${data.query} - brick search`
        : `Search | ${
            data.sort == "popularity" ? "Top bricks" : "Latest bricks"
          }`,
  };
};

const limit = 10;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sortParam = url.searchParams.get("sort") ?? "";
  const sort: Sort = sortParam === "updated" ? "updated" : "popularity";
  const query = url.searchParams.get("q") ?? "";
  const p = url.searchParams.get("page");
  const page = p ? parseInt(p) : 1;
  try {
    const results = await api.search({
      query,
      offset: (page - 1) * limit,
      limit,
      sort: sort === "updated" ? "created" : "downloads",
    });
    return {
      query,
      results: results.bricks,
      total: results.total,
      page,
      sort,
    };
  } catch (error) {
    return {
      query,
      results: [],
      total: 0,
      error: `${error}`,
      sort,
    };
  }
};

export default function BrickSearch() {
  const { query, results, total, page, sort } =
    useLoaderData<BrickSearchData>();
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
                sort={sort}
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
  sort,
}: {
  results: [api.BrickSearchResult];
  query: string;
  total: number;
  page: number;
  sort: Sort;
}) {
  return (
    <Fragment>
      <div className="flex w-full justify-between">
        <p className="text-gray-400 text-sm italic lg:pt-6">
          <span className="font-semibold text-red-500">{total}</span>{" "}
          {total === 1 ? "brick" : "bricks"} found.
        </p>
        <span className="text-gray-400 text-sm font-semibold lg:pt-6">
          SORT BY
          <SortByDropdownMenu sort={sort} query={query} page={page} />
        </span>
      </div>

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

function SortByDropdownMenu({
  sort,
  query,
  page,
}: {
  sort: Sort;
  query: string;
  page: number;
}) {
  return (
    <div className="group relative inline-block pb-2 text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center px-2 text-sm font-medium text-red-500 focus:outline-none"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {sort == "updated" ? "LAST UPDATED" : "POPULARITY"}
        </button>
      </div>

      <div
        className="absolute right-0 mt-1 hidden min-w-[7.5rem] origin-top-right bg-dark-gray hover:block focus:outline-none group-hover:block"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div role="none">
          <Form reloadDocument action="/search" method="get">
            {query ? <input type="hidden" name="q" value={query} /> : null}
            {page !== 1 ? (
              <input type="hidden" name="page" value={page} />
            ) : null}

            <button
              disabled={sort === "popularity"}
              role="menuitem"
              tabIndex={-1}
              id="menu-item-0"
              type="submit"
              className={`block w-full px-4 py-2 text-sm ${
                sort === "popularity"
                  ? "bg-red-900"
                  : "hover:bg-red-500 hover:bg-opacity-20"
              }`}
              aria-label="Sort by popularity"
            >
              popularity
            </button>
            <button
              disabled={sort === "updated"}
              role="menuitem"
              tabIndex={0}
              id="menu-item-1"
              type="submit"
              className={`block w-full px-4 py-2 text-sm ${
                sort === "updated"
                  ? "bg-red-900"
                  : "hover:bg-red-500 hover:bg-opacity-20"
              }`}
              aria-label="Sort by recently updated"
              name="sort"
              value="updated"
            >
              last updated
            </button>
          </Form>
        </div>
      </div>
    </div>
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
          className="text-xl font-bold text-red-500"
          target="_self"
          href={`/bricks/${result.name}/${result.version}`}
        >
          {result.name}
        </a>
      </div>
      <p className="italic">{result.description}</p>
      <div className="text-gray-400 flex text-sm">
        <span>
          <a
            className="font-semibold text-red-500"
            href={`/bricks/${result.name}/${result.version}`}
          >
            {result.version}
          </a>
        </span>
        <span className="px-1"></span>
        <span>({publishedAt})</span>
        <span className="px-1"></span>
        <span className="flex text-neutral-400">
          <DownloadIcon />
          {result.downloads}
        </span>
      </div>
      <div className="text-gray-400 text-sm">{result.publisher}</div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}
