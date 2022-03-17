import { forwardRef } from "react";

export function Header() {
  return (
    <header className="px-6 lg:px-12 py-9 flex justify-between items-center">
      <a
        className="inline-flex justify-content items-center"
        aria-label="Go home"
        href="/"
      >
        <BrickHubLogo />
        <p className="text-3xl mx-2 font-bold">BrickHub</p>
      </a>
    </header>
  );
}

const HeaderLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements["a"]>(
  (props, ref) => (
    <a
      {...props}
      className="flex items-center mx-2 sm:mx-4 last:mr-0 font-semibold"
      ref={ref}
    >
      {props.children}
    </a>
  )
);

function BrickHubLogo() {
  return (
    <img alt="Brick Hub" src="/images/brickhub.svg" width="56" height="54" />
  );
}
