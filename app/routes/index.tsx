import { OutlineButtonLink, PrimaryButtonLink } from "~/components/button";
import { Header } from "~/components/header";
import { SearchBar } from "~/components/search-bar";

export default function Index() {
  return (
    <div className="flex flex-col flex-1 h-screen">
      <Header />
      <main className="items-center justify-center h-3/4">
        <SearchBar />
        <section className="px-6 sm:px-8 pt-9 lg:pt-0 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-12">
          <div className="lg:max-w-2xl lg:mx-auto">
            <h2 className="text-[length:48px] leading-[48px] lg:text-[length:72px] lg:leading-[72px] font-extrabold">
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
              <PrimaryButtonLink href="#">Get Started</PrimaryButtonLink>
              <OutlineButtonLink
                target="_blank"
                href="https://github.com/felangel/mason/tree/master/packages/mason_cli#readme"
              >
                Read the Docs
              </OutlineButtonLink>
            </div>
            <div className="h-9 xl:h-10"></div>
          </div>
          <div className="lg:mx-auto lg:max-w-3xl lg:h-[48rem] overflow-hidden flex items-center justify-center">
            <img
              alt="Mason Hero"
              src="images/mason_hero.png"
              width="768"
              height="361"
            ></img>
          </div>
        </section>
      </main>
    </div>
  );
}
