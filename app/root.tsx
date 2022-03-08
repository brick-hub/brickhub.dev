import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import tailwind from "./tailwind.css";
import globalStylesUrl from "./styles/global.css";
import type { MetaFunction } from "remix";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwind },
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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col w-full overflow-x-hidden bg-black text-gray-200">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
