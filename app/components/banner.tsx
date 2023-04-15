import type { PropsWithChildren } from "react";

interface BannerElement {
  content: string;
}

export function SuccessBanner(props: PropsWithChildren<BannerElement>) {
  return (
    <div
      className="flex items-center justify-between border-b border-t border-green-500 bg-green-100 px-4 py-3 text-green-700"
      role="alert"
    >
      <div>
        <p className="font-semibold">{props.content}</p>
      </div>
      <div>{props?.children}</div>
    </div>
  );
}

export function WarningBanner(props: PropsWithChildren<BannerElement>) {
  return (
    <div
      className="flex items-center justify-between border-l-4 border-orange-500 bg-orange-100 p-2 text-orange-700"
      role="alert"
    >
      <div>
        <p className="font-semibold">{props.content}</p>
      </div>
      <div>{props?.children}</div>
    </div>
  );
}

export function ErrorBanner(props: PropsWithChildren<BannerElement>) {
  return (
    <div
      className="flex items-center justify-between border-b border-t border-red-400 bg-red-100 px-4 py-3 text-red-700"
      role="alert"
    >
      <div>
        <p className="font-semibold">{props.content}</p>
      </div>
      <div>{props?.children}</div>
    </div>
  );
}
