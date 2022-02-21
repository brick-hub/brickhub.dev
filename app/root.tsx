import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import tailwind from "./tailwind.css";
import type { MetaFunction } from "remix";

export function links() {
  return [{ rel: "stylesheet", href: tailwind }];
}

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
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
