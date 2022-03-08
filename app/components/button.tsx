import { forwardRef } from "react";

const PrimaryButtonLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>((props, ref) => {
  return (
    <a
      className="inline-flex items-center justify-center xl:text-lg h-14 xl:h-16 box-border px-8 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none font-semibold w-full xl:w-60"
      {...props}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

const OutlineButtonLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>((props, ref) => {
  return (
    <a
      className="inline-flex items-center justify-center xl:text-lg h-14 xl:h-16 box-border px-8 rounded bg-transparent text-white border-current hover:border-red-600 focus:outline-none font-semibold border-2 w-full xl:w-60"
      {...props}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

export { PrimaryButtonLink, OutlineButtonLink };
