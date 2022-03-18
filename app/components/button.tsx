import { forwardRef } from "react";

export const PrimaryButtonLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>((props, ref) => {
  return (
    <a
      className="box-border inline-flex h-14 w-full items-center justify-center rounded bg-red-600 px-8 font-semibold text-white hover:bg-red-700 focus:outline-none xl:h-16 xl:w-60 xl:text-lg"
      {...props}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

PrimaryButtonLink.displayName = "PrimaryButtonLink";

export const OutlineButtonLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>((props, ref) => {
  return (
    <a
      className="box-border inline-flex h-14 w-full items-center justify-center rounded border-2 border-current bg-transparent px-8 font-semibold text-white hover:border-red-600 focus:outline-none xl:h-16 xl:w-60 xl:text-lg"
      {...props}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

OutlineButtonLink.displayName = "OutlineButtonLink";
