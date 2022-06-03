import { Fragment, useEffect } from "react";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import tailwindStylesUrl from "./styles/tailwind.css";
import globalStylesUrl from "./styles/global.css";
import * as ga from "~/utils/ga";
import { getUser } from "./utils/session.server";
import { useOptionalUser } from "./utils/user";
import { WarningBanner } from "./components";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesUrl },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export const meta: MetaFunction = () => {
  const title = "BrickHub";
  const description =
    "BrickHub is the official registry for publishing, discovering, and consuming reusable brick templates.";
  const image =
    "https://raw.githubusercontent.com/brick-hub/brickhub.dev/main/assets/brick-hub-cover-image.png?hash=vg86r2r3mbs62hiv4ldop0ife5um2g5g";
  const url = "https://brickhub.dev";
  return {
    title: title,
    description: description,
    "twitter:card": "summary",
    "twitter:description": description,
    "twitter:image": image,
    "og:type": "website",
    "og:site_name": title,
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "og:url": url,
  };
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  const user = useOptionalUser();
  const location = useLocation();

  useEffect(() => {
    ga.pageview(location.pathname);
  }, [location]);

  const showEmailVerificationBanner =
    user && !user.emailVerified && location.pathname !== "/verify";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-gray-200 flex min-h-screen w-full flex-col overflow-x-hidden bg-black">
        <GoogleAnalytics />
        {showEmailVerificationBanner ? <UnverifiedEmailBanner /> : null}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function UnverifiedEmailBanner() {
  return (
    <WarningBanner content="Email verification required.">
      <a className="hover:underline" href="/verify">
        Verify
      </a>
    </WarningBanner>
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
