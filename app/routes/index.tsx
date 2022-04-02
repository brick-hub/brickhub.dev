import { Fragment } from "react";
import { OutlineButtonLink, PrimaryButtonLink } from "~/components/button";
import { Footer, Header, SearchBar } from "~/components";
import { useOptionalUser } from "~/utils/user";

export default function Index() {
  const user = useOptionalUser();
  return (
    <Fragment>
      <Header user={user} />
      <main className="flex-1 items-center justify-center">
        <SearchBar />
        <section className="px-6 pt-9 sm:px-8 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-12 lg:pt-0">
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
              {user ? (
                <PrimaryButtonLink href="/search">
                  Discover Bricks
                </PrimaryButtonLink>
              ) : (
                <PrimaryButtonLink
                  target="_blank"
                  href="https://forms.gle/cG8XoR1wiVxPgyWW9"
                >
                  Request Access
                </PrimaryButtonLink>
              )}

              <OutlineButtonLink
                target="_blank"
                href="https://pub.dev/documentation/mason_cli/latest"
              >
                Read the Docs
              </OutlineButtonLink>
            </div>
            <div className="h-9 xl:h-10"></div>
          </div>
          <div className="flex items-center justify-center overflow-hidden lg:mx-auto lg:h-[48rem] lg:max-w-3xl">
            <img
              alt="Mason Hero"
              src="images/mason_hero.png"
              width="768"
              height="361"
            ></img>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
}
