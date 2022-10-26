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

export const TextButtonLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>((props, ref) => {
  return (
    <a
      className="inline-flex h-14 w-full cursor-pointer items-center justify-center rounded px-8 font-semibold text-white underline hover:text-red-600 focus:outline-none"
      {...props}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

TextButtonLink.displayName = "TextButtonLink";

export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>((props, ref) => {
  return (
    <button
      className="box-border inline-flex h-10 w-full items-center justify-center rounded bg-red-600 px-8 font-semibold text-white hover:bg-red-700 focus:bg-red-700 focus:outline-none disabled:opacity-40 disabled:hover:bg-red-600"
      {...props}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

PrimaryButton.displayName = "PrimaryButton";

export const TextButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>((props, ref) => {
  return (
    <button
      className="inline-flex h-14 w-full cursor-pointer items-center justify-center rounded px-8 font-semibold text-white underline hover:text-red-600 focus:outline-none"
      {...props}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

TextButton.displayName = "TextButton";
