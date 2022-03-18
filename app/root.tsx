import { Fragment, useEffect } from "react";
import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "remix";
import type { MetaFunction } from "remix";
import tailwindStylesUrl from "./styles/tailwind.css";
import globalStylesUrl from "./styles/global.css";
import * as ga from "~/utils/ga";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesUrl },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: "BrickHub",
    description:
      "BrickHub is the official registry for publishing, discovering, and consuming reusable brick templates.",
  };
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    ga.pageview(location.pathname);
  }, [location]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-gray-200">
        <GoogleAnalytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function GoogleAnalytics() {
  return (
    <Fragment>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${ga.GA_TRACKING_ID}`}
      />
      <script
        async
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </Fragment>
  );
}
