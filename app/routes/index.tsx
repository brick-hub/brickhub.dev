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
        <section className="px-6 pt-9 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-12 lg:pt-0">
          <div className="lg:mx-auto lg:max-w-2xl">
            <h2 className="text-[length:48px] font-extrabold leading-[48px] lg:text-[length:72px] lg:leading-[72px]">
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
            <div className="h-9 xl:h-10"></div>
          </div>
          <div className="flex w-full max-w-full items-center justify-start overflow-hidden lg:mx-auto lg:h-[48rem] lg:w-10/12 lg:max-w-3xl">
            <div className="w-full rounded-lg bg-dark-gray p-8 md:p-10 lg:p-16">
              <Terminal />
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
    <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap">
      <span className="text-[length:28px] font-black text-red-600 sm:text-[length:42px] 2xl:text-[length:72px]">
        &gt;
      </span>
      <div className="w-2 lg:w-3"></div>
      <span className="text-[length:36px] font-extrabold sm:text-[length:48px] 2xl:text-[length:72px]">
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
