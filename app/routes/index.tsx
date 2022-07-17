import { Fragment, useState } from "react";
import { OutlineButtonLink, PrimaryButtonLink } from "~/components/button";
import { Footer, Header, SearchBar, Typer } from "~/components";
import { useOptionalUser } from "~/utils/user";

export default function Index() {
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex-1 items-center justify-center">
        <SearchBar />
        <section className="px-6 pt-9 xl:flex xl:w-full xl:items-center xl:justify-between xl:gap-12 xl:pt-0">
          <div className="xl:mx-auto xl:max-w-3xl">
            <h2 className="text-[length:42px] font-extrabold leading-[48px] lg:text-[length:72px] lg:leading-[72px]">
              Generate <span className="text-red-700">consistent</span> code{" "}
              <span className="text-red-500">fast</span>.
            </h2>
            <div className="h-6"></div>
            <p className="text-xl xl:pr-56">
              Discover, publish, and install reusable templates called bricks to
              supercharge your workflow.
            </p>
            <div className="h-6"></div>
            <div className="flex flex-col gap-4 xl:flex-row">
              <PrimaryButtonLink href="/search">
                Discover Bricks
              </PrimaryButtonLink>
              {user ? <DocsButton /> : <RequestAccessButton />}
            </div>
            <div className="h-14 xl:h-10"></div>
          </div>
          <div className="flex w-full max-w-full items-center justify-start overflow-hidden xl:mx-auto xl:h-[48rem] xl:w-10/12 xl:max-w-3xl">
            <div className="w-full rounded-lg bg-gray">
              <div className="flex gap-2 px-4 py-3 lg:gap-3 lg:px-6 lg:py-5">
                <div className="h-3 w-3 rounded-full bg-red-600 lg:h-4 lg:w-4"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-600 lg:h-4 lg:w-4"></div>
                <div className="h-3 w-3 rounded-full bg-green-600 lg:h-4 lg:w-4"></div>
              </div>
              <div className="rounded-b-lg bg-dark-gray px-4 py-3 pb-4 lg:px-6 lg:py-5 lg:pb-4">
                <Terminal />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
}

function Terminal() {
  const [toTypeWords] = useState([
    "hello",
    "bloc",
    "flutter_project",
    "amplify_starter",
    "mit_license",
    "model",
    "app_ui",
    "cubit",
    "service",
    "feature_brick",
    "macosui_starter",
    "web_components",
    "pdf",
    "dot_github",
  ]);
  return (
    <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap font-mono">
      <span className="text-[length:28px] text-red-600 lg:text-[length:56px]">
        &gt;
      </span>
      <div className="w-2 lg:w-3"></div>
      <span className="text-[length:32px] lg:text-[length:56px]">
        mason make
      </span>
      <div className="w-2 lg:w-3"></div>
      <div className="basis-full">
        <Typer
          words={toTypeWords}
          delay={3000}
          defaultText={toTypeWords[0] || "hello"}
        />
      </div>
    </div>
  );
}

function DocsButton() {
  return (
    <OutlineButtonLink
      target="_blank"
      rel="noreferrer"
      href="https://pub.dev/documentation/mason_cli/latest"
    >
      Read the Docs
    </OutlineButtonLink>
  );
}

function RequestAccessButton() {
  return (
    <OutlineButtonLink
      target="_blank"
      rel="noreferrer"
      href="https://forms.gle/cG8XoR1wiVxPgyWW9"
    >
      Request access
    </OutlineButtonLink>
  );
}
