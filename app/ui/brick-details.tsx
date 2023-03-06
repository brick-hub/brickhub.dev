import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import highlightStyleUrl from "highlight.js/styles/vs2015.css";
import { Fragment, useState } from "react";
import type * as api from "~/brickhub.server";
import {
  BuildingLibraryIcon,
  CheckIcon,
  CogIcon,
  DocumentTextIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
  Footer,
  Header,
  LightBulbIcon,
  Modal,
  PrimaryButton,
  SearchBar,
  SparklesIcon,
  TrashIcon,
} from "~/components";
import type { PublishersActionData } from "~/routes/bricks/$name/publishers";
import styles from "~/styles/details.css";
import { canonicalHref } from "~/utils/canonical-href";
import type { DynamicLinksFunction } from "~/utils/dynamic-links";
import { timeAgo } from "~/utils/time-ago";
import { useOptionalUser } from "~/utils/user";

export const brickVersionRegExp = new RegExp(
  /^(\d+)\.(\d+)\.(\d+)(-([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?(\+([0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?/
);

export interface BrickDetailsData {
  name: string;
  version?: string;
  details?: api.BrickDetails;
}

export const dynamicLinks: DynamicLinksFunction<BrickDetailsData> = ({
  data,
}) => {
  const brick = data.name;
  return [{ rel: "canonical", href: canonicalHref(`/bricks/${brick}`) }];
};

export const brickDetailsLinks: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: highlightStyleUrl },
    { rel: "stylesheet", href: styles },
  ];
};

export const brickDetailsHeaders: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "no-cache",
  };
};

export function BrickDetails() {
  const { name, version, details } = useLoaderData<BrickDetailsData>();
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex h-3/4 flex-1 flex-col">
        <SearchBar />
        <div className="h-9"></div>
        {details ? (
          <BrickDetailsCard details={details} />
        ) : (
          <BrickNotFoundCard name={name} version={version} />
        )}
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
  version?: string;
}) {
  return (
    <div className="w-full px-6">
      <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
        <h2 className="text-3xl font-semibold text-red-500">404 Not Found</h2>
        <div>
          {name} {version ? `v${version}` : ""} was not found.
        </div>
      </div>
    </div>
  );
}

function BrickDetailsCard({ details }: { details: api.BrickDetails }) {
  const publishedAt = timeAgo(new Date(details.createdAt));
  return (
    <Fragment>
      <div className="w-full px-6">
        <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
          <h2 className="break-all text-2xl font-semibold text-red-500 xl:text-4xl">
            {details.name}
          </h2>
          <div className="flex items-center justify-center">
            <span className="font-semibold text-red-500">
              {details.version}
            </span>
            <span className="px-1"></span>
            <span>({publishedAt})</span>
            <span className="px-1"></span>
            <span className="flex items-center text-neutral-400">
              <DownloadIcon />
              {details.downloads.toLocaleString()}
            </span>
          </div>
          <div className="h-4"></div>
          <p className="max-w-full break-all italic">{details.description}</p>
          <div className="h-4"></div>
          <RepositoryUrl url={details.repository} />
          <div className="h-4"></div>
          <InstallSnippet name={details.name} />
        </div>
      </div>
      <div className="w-full">
        <div className="m-auto flex w-full max-w-[56rem] flex-col items-start justify-center">
          <div className="h-9"></div>
          <Tabs details={details} />
        </div>
      </div>
    </Fragment>
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
        className="flex max-w-full cursor-copy items-center justify-start gap-4 overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-dark-gray p-4 hover:bg-red-600/40"
        onClick={copyToClipboard}
      >
        {">"} {snippet}
        <ClipboardCopyIcon />
      </code>
    </Fragment>
  );
}

function RepositoryUrl({ url }: { url: string }) {
  const _url = new URL(url);
  const pathSegments = _url.pathname.split("/").slice(1, 3).join("/");
  const prettyUrl = `${_url.host}/${pathSegments}`;
  return (
    <Fragment>
      <p>Repository</p>
      <div className="h-1"></div>
      <a
        aria-label="repository"
        className="flex max-w-full items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-red-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={url}
      >
        <span>
          <GitIcon />
        </span>
        <span>{prettyUrl}</span>
      </a>
    </Fragment>
  );
}

function GitIcon() {
  return (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 97 97"
      enableBackground="new 0 0 97 97"
      xmlSpace="preserve"
      aria-hidden="true"
    >
      <title>Repository</title>
      <g>
        <path
          fill="#F05133"
          d="M92.71,44.408L52.591,4.291c-2.31-2.311-6.057-2.311-8.369,0l-8.33,8.332L46.459,23.19   c2.456-0.83,5.272-0.273,7.229,1.685c1.969,1.97,2.521,4.81,1.67,7.275l10.186,10.185c2.465-0.85,5.307-0.3,7.275,1.671   c2.75,2.75,2.75,7.206,0,9.958c-2.752,2.751-7.208,2.751-9.961,0c-2.068-2.07-2.58-5.11-1.531-7.658l-9.5-9.499v24.997   c0.67,0.332,1.303,0.774,1.861,1.332c2.75,2.75,2.75,7.206,0,9.959c-2.75,2.749-7.209,2.749-9.957,0c-2.75-2.754-2.75-7.21,0-9.959   c0.68-0.679,1.467-1.193,2.307-1.537V36.369c-0.84-0.344-1.625-0.853-2.307-1.537c-2.083-2.082-2.584-5.14-1.516-7.698   L31.798,16.715L4.288,44.222c-2.311,2.313-2.311,6.06,0,8.371l40.121,40.118c2.31,2.311,6.056,2.311,8.369,0L92.71,52.779   C95.021,50.468,95.021,46.719,92.71,44.408z"
        />
      </g>
    </svg>
  );
}

function Tabs({ details }: { details: api.BrickDetails }) {
  const user = useOptionalUser();
  const isPublisher = user?.email && details.publishers?.includes(user.email);
  const location = useLocation();
  const hash = location.hash;
  return (
    <Fragment>
      <div className="tabs w-full">
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab1"
          aria-controls="readme"
          checked={hash === "#readme" || hash === ""}
          onChange={() => {}}
        />
        <label
          className="inline-block cursor-pointer p-3"
          htmlFor="tab1"
          onClick={() => (window.location.hash = "#readme")}
        >
          <span className="inline-flex gap-2">
            <DocumentTextIcon /> Readme
          </span>
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab2"
          aria-controls="usage"
          checked={hash === "#usage"}
          onChange={() => {}}
        />
        <label
          className="inline-block cursor-pointer p-3"
          htmlFor="tab2"
          onClick={() => (window.location.hash = "#usage")}
        >
          <span className="inline-flex gap-2">
            <LightBulbIcon /> Usage
          </span>
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab3"
          aria-controls="changelog"
          checked={hash === "#changelog"}
          onChange={() => {}}
        />
        <label
          className="inline-block cursor-pointer p-3"
          htmlFor="tab3"
          onClick={() => (window.location.hash = "#changelog")}
        >
          <span className="inline-flex gap-2">
            <SparklesIcon /> Changelog
          </span>
        </label>
        <input
          className="hidden"
          type="radio"
          name="tabs"
          id="tab4"
          aria-controls="license"
          checked={hash === "#license"}
          onChange={() => {}}
        />
        <label
          className="inline-block cursor-pointer p-3"
          htmlFor="tab4"
          onClick={() => (window.location.hash = "#license")}
        >
          <span className="inline-flex gap-2">
            <BuildingLibraryIcon /> License
          </span>
        </label>
        {isPublisher ? (
          <Fragment>
            <input
              className="hidden"
              type="radio"
              name="tabs"
              id="tab5"
              aria-controls="settings"
              checked={hash === "#settings"}
              onChange={() => {}}
            />
            <label
              className="inline-block cursor-pointer p-3"
              htmlFor="tab5"
              onClick={() => (window.location.hash = "#settings")}
            >
              <span className="inline-flex gap-2">
                <CogIcon /> Settings
              </span>
            </label>
          </Fragment>
        ) : null}

        <div className="h-4"></div>

        <div className="tab-contents max-w-5xl">
          <section id="readme" className="tab-content hidden w-full">
            <Markdown contents={details.readme} />
          </section>
          <section id="usage" className="tab-content hidden w-full">
            <Markdown contents={details.usage} />
          </section>
          <section id="changelog" className="tab-content hidden w-full">
            <Markdown contents={details.changelog} />
          </section>
          <section id="license" className="tab-content hidden w-full">
            <Markdown contents={details.license} />
          </section>
          {isPublisher ? (
            <section id="settings" className="tab-content hidden w-full">
              <SettingsTab details={details} />
            </section>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}

function SettingsTab({ details }: { details: api.BrickDetails }) {
  return (
    <div className="rounded-md bg-dark-gray p-5">
      <Publishers brick={details.name} publishers={details.publishers!} />
    </div>
  );
}

function Publishers({
  brick,
  publishers,
}: {
  brick: string;
  publishers: string[];
}) {
  const [addPublisherModalVisible, showAddPublisherModal] = useState(false);
  const [publisherToDelete, setPublisherToDelete] = useState<
    string | undefined
  >();
  return (
    <Fragment>
      {addPublisherModalVisible ? (
        <AddPublisherModal
          brick={brick}
          onClose={() => showAddPublisherModal(false)}
        />
      ) : null}
      {publisherToDelete ? (
        <RemovePublisherModal
          publisher={publisherToDelete}
          brick={brick}
          onClose={() => setPublisherToDelete(undefined)}
        />
      ) : null}
      <div className="mb-4 inline-flex w-full items-center justify-between">
        <p className="text-2xl">Publishers</p>
        <button
          onClick={() => showAddPublisherModal(true)}
          className="box-border h-10 justify-center rounded bg-red-600 px-3 font-semibold text-white hover:bg-red-700 focus:bg-red-700 focus:outline-none"
        >
          Add Publisher
        </button>
      </div>
      <div className="border-[1px] border-charcoal">
        <div className="border-b-[1px] border-b-charcoal">
          <p className="p-3 text-left">Email</p>
        </div>
        {publishers.map((publisher) => (
          <Publisher
            key={publisher}
            publisher={publisher}
            onDelete={
              publishers.length > 1
                ? (publisher) => setPublisherToDelete(publisher)
                : undefined
            }
          />
        ))}
      </div>
    </Fragment>
  );
}

function Publisher({
  publisher,
  onDelete,
}: {
  publisher: string;
  onDelete?: (publisher: string) => void;
}) {
  const disabled = !onDelete;
  return (
    <Fragment key={publisher}>
      <div className="inline-flex w-full flex-row items-center justify-between border-b-[1px] border-b-charcoal">
        <div className="overflow-auto p-3 ">{publisher}</div>
        <div className="p-3">
          <button
            aria-label="delete publisher"
            disabled={disabled}
            onClick={!disabled ? () => onDelete(publisher) : undefined}
            className={`${
              !disabled ? "cursor-pointer hover:bg-red-500" : ""
            } rounded p-2 disabled:opacity-40`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </Fragment>
  );
}

function Markdown({ contents }: { contents: string }) {
  return (
    <div className="w-full break-words rounded-md bg-dark-gray p-5">
      <article
        className="prose prose-invert prose-h1:mt-6 prose-h1:mb-4 prose-h1:border-b-[1px] prose-h1:border-b-charcoal prose-h1:pb-2 prose-h2:mt-6 prose-h2:mb-4 prose-h2:border-b-[1px] prose-h2:border-b-charcoal prose-h2:pb-2 prose-p:mt-0 prose-p:mb-4 prose-a:inline-block prose-a:break-all prose-code:rounded-md prose-pre:bg-inherit prose-pre:p-0 prose-ul:mb-4 prose-li:m-0 prose-table:m-0 prose-table:inline-block prose-table:overflow-x-auto prose-img:m-0 prose-img:inline-block prose-hr:my-6 prose-hr:border-2"
        dangerouslySetInnerHTML={{ __html: contents }}
      ></article>
    </div>
  );
}

function ClipboardCopyIcon() {
  return (
    <svg
      className="h-5 w-5"
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

function AddPublisherModal({
  brick,
  onClose,
}: {
  brick: string;
  onClose: () => void;
}) {
  const fetcher = useFetcher();
  const data: PublishersActionData | undefined = fetcher.data;
  const isPending = fetcher.submission?.formData.get("brick") === brick;
  const isDone = fetcher.type === "done";
  const error = data?.addPublisherError;

  return (
    <Modal onClose={isPending ? undefined : onClose}>
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex items-center">
          <div className="mt-3 text-left">
            <h3
              className="text-gray-900 text-center text-lg font-medium leading-6"
              id="add-publisher"
            >
              Add Publisher
            </h3>
            <div className="h-4"></div>
            <p>
              You can invite a new publisher to this brick. Publishers must have
              a verified BrickHub account before they can be added.
            </p>
            <br />
            <p>
              Once a publisher is added, they have full administrative rights,
              with the following abilities:
            </p>
            <div className="h-2"></div>
            <ul className="list-disc">
              <li className="mx-6 py-1">Publish new versions of the brick</li>
              <li className="mx-6 py-1">
                Add and remove publishers of the brick
              </li>
            </ul>
          </div>
        </div>
      </div>
      <fetcher.Form method="post" action={`/bricks/${brick}/publishers`}>
        <div className="flex flex-col px-4 py-4 sm:px-6">
          <label className="whitespace-nowrap" htmlFor="publisher">
            Email Address
          </label>
          <input
            className="my-2 w-full appearance-none bg-gray p-2 autofill:!bg-gray focus:outline-none"
            type="email"
            name="publisher"
            id="publisher"
            autoFocus={true}
            disabled={isDone}
          />
          <input hidden id="brick" name="brick" value={brick} readOnly />
          <div className="h-2"></div>
          {error ? (
            <ErrorMessage message={error} />
          ) : isDone ? (
            <SuccessMessage message="Publisher Added" />
          ) : (
            <PrimaryButton
              disabled={isPending}
              type="submit"
              name="_action"
              value="addPublisher"
            >
              Add Publisher
            </PrimaryButton>
          )}
        </div>
      </fetcher.Form>
    </Modal>
  );
}

function RemovePublisherModal({
  brick,
  publisher,
  onClose,
}: {
  brick: string;
  publisher: string;
  onClose: () => void;
}) {
  const fetcher = useFetcher();
  const data: PublishersActionData | undefined = fetcher.data;
  const isPending = fetcher.submission?.formData.get("brick") === brick;
  const isDone = fetcher.type === "done";
  const error = data?.removePublisherError;

  return (
    <Modal onClose={isPending ? undefined : onClose}>
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex items-center">
          <div className="mt-3 text-left">
            <h3
              className="text-gray-900 text-center text-lg font-medium leading-6"
              id="remove-publisher"
            >
              Remove Publisher
            </h3>
            <div className="h-4"></div>
            <p>
              Are you sure you want to remove{" "}
              <span className="font-bold text-red-500">{publisher}</span> as a
              publisher?
            </p>
            <br />
            <p>
              Once a publisher is removed, they will no longer have
              administrative rights.
            </p>
          </div>
        </div>
      </div>
      <fetcher.Form method="post" action={`/bricks/${brick}/publishers`}>
        <div className="flex flex-col px-4 py-4 sm:px-6">
          <input
            hidden
            id="publisher"
            name="publisher"
            readOnly
            value={publisher}
          />
          <input hidden id="brick" name="brick" value={brick} readOnly />
          <div className="h-2"></div>
          {error ? (
            <ErrorMessage message={error} />
          ) : isDone ? (
            <SuccessMessage message="Publisher Removed" />
          ) : (
            <PrimaryButton
              disabled={isPending}
              type="submit"
              name="_action"
              value="removePublisher"
            >
              Remove Publisher
            </PrimaryButton>
          )}
        </div>
      </fetcher.Form>
    </Modal>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <p className="box-border inline-flex h-10 w-full items-center justify-center text-green-600 focus:outline-none">
      <CheckIcon /> <p className="">{message}</p>
    </p>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="box-border inline-flex h-10 w-full items-center justify-center text-red-600 focus:outline-none">
      <ExclamationTriangleIcon /> <p className="px-2">{message}</p>
    </p>
  );
}
