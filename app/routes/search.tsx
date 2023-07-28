import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import * as api from "~/brickhub.server";
import { DownloadIcon, Footer, Header, SearchBar } from "~/components";
import { canonicalHref } from "~/utils/canonical-href";
import type { DynamicLinksFunction } from "~/utils/dynamic-links";
import { timeAgo } from "~/utils/time-ago";
import { useOptionalUser } from "~/utils/user";

type Sort = "updated" | "popularity";

interface BrickSearchData {
  query: string;
  results?: [api.BrickSearchResult];
  total: number;
  page: number;
  sort: Sort;
}

export const dynamicLinks: DynamicLinksFunction<BrickSearchData> = ({
  data,
}) => {
  const query = data.query ? `?q=${data.query}` : "";
  return [{ rel: "canonical", href: canonicalHref(`/search${query}`) }];
};

export const handle = { dynamicLinks };

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
        <p className="text-gray-400 text-sm lg:pt-6">
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
        sort={sort}
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
              className={`block w-full px-4 py-2 text-sm font-light ${
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
              className={`block w-full px-4 py-2 text-sm font-light ${
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
  sort,
  currentPage,
  totalPages,
}: {
  query: string;
  sort: Sort;
  currentPage: number;
  totalPages: number;
}) {
  const sortParam = sort == "updated" ? "&sort=updated" : "";

  function PageButton({
    index,
    currentPage,
  }: {
    index: number;
    currentPage: number;
  }) {
    const isCurrentPage = index === currentPage;
    return (
      <li
        className={
          isCurrentPage
            ? "rounded-sm bg-red-700 p-4"
            : "rounded-sm p-4 text-red-700"
        }
      >
        {isCurrentPage ? (
          <span>{index}</span>
        ) : (
          <a
            href={`/search?q=${query}&page=${index}${sortParam}`}
            className="cursor-pointer"
          >
            <span>{index}</span>
          </a>
        )}
      </li>
    );
  }

  function PreviousPageButton({
    isFirstPage,
    query,
    currentPage,
  }: {
    isFirstPage: boolean;
    query: string;
    currentPage: number;
  }) {
    return (
      <li
        key="prev"
        className={
          isFirstPage
            ? "rounded-sm p-4 text-slate-700"
            : "rounded-sm p-4 text-red-700"
        }
      >
        {isFirstPage ? (
          <span>&lt;</span>
        ) : (
          <a
            href={`/search?q=${query}&page=${currentPage - 1}${sortParam}`}
            className="cursor-pointer"
            rel="prev"
          >
            <span>&lt;</span>
          </a>
        )}
      </li>
    );
  }

  function NextPageButton({
    isLastPage,
    query,
    currentPage,
  }: {
    isLastPage: boolean;
    query: string;
    currentPage: number;
  }) {
    return (
      <li
        key="next"
        className={
          isLastPage
            ? "rounded-sm p-4 text-slate-700"
            : "rounded-sm p-4 text-red-700"
        }
      >
        {isLastPage ? (
          <span>&gt;</span>
        ) : (
          <a
            href={`/search?q=${query}&page=${currentPage + 1}${sortParam}`}
            className="cursor-pointer"
            rel="next"
          >
            <span>&gt;</span>
          </a>
        )}
      </li>
    );
  }

  function PaginationDots() {
    return <li className="p-4 leading-none text-slate-700">...</li>;
  }

  if (totalPages === 0) return <Fragment></Fragment>;

  const pages = [];
  const paginationResults = pagination(currentPage, totalPages);

  for (let i = 0; i < paginationResults.length; i++) {
    const result = paginationResults[i];
    pages.push(
      result === "..." ? (
        <PaginationDots key={i} />
      ) : (
        <PageButton key={i} index={result} currentPage={currentPage} />
      )
    );
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <ul className="mx-auto my-5 flex w-full list-none justify-center text-center font-semibold">
      <PreviousPageButton
        isFirstPage={isFirstPage}
        query={query}
        currentPage={currentPage}
      />
      {...pages}
      <NextPageButton
        isLastPage={isLastPage}
        query={query}
        currentPage={currentPage}
      />
    </ul>
  );
}

function ResultItem({ result }: { result: api.BrickSearchResult }) {
  const publishedAt = timeAgo(new Date(result.createdAt));
  return (
    <section className="py-6">
      <div>
        <a
          className="break-all text-xl font-bold text-red-500"
          target="_self"
          href={`/bricks/${result.name}/${result.version}`}
        >
          {result.name}
        </a>
      </div>
      <p className="max-w-full break-words">{result.description}</p>
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
          {result.downloads.toLocaleString()}
        </span>
      </div>
    </section>
  );
}

function getRange(start: number, end: number) {
  return Array(end - start + 1)
    .fill(undefined)
    .map((_, i) => i + start);
}

function pagination(current: number, length: number, delta = 2): Array<any> {
  const range = {
    start: Math.round(current - delta / 2),
    end: Math.round(current + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === length) {
    range.start += 1;
    range.end += 1;
  }

  let pages =
    current > delta
      ? getRange(
          Math.min(range.start, length - delta),
          Math.min(range.end, length)
        )
      : getRange(1, Math.min(length, delta + 1));

  const withDots = (value: number, pair: Array<any>) =>
    pages.length + 1 !== length ? pair : [value];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, "..."]).concat(pages);
  }

  if (pages[pages.length - 1] < length) {
    pages = pages.concat(withDots(length, ["...", length]));
  }

  return pages;
}
