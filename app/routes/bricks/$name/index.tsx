import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as api from "~/brickhub.server";
import { getTokens } from "~/session.server";
import type { BrickDetailsData } from "~/ui/brick-details";
import {
  BrickDetails,
  brickDetailsHeaders,
  brickDetailsLinks,
  dynamicLinks,
} from "~/ui/brick-details";

export const meta: MetaFunction = ({ data }: { data: BrickDetailsData }) => {
  const title = `${data.name} | Brick Template`;
  const description = data.details?.description;
  return {
    title: title,
    ...(description && { description: description }),
    "twitter:card": "summary",
    ...(description && { "twitter:description": description }),
    "og:type": "website",
    "og:site_name": title,
    "og:title": title,
    ...(description && { "og:description": description }),
    "og:url": `https://brickhub.dev/bricks/${data.name}`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const name = params.name;
  if (!name) return redirect("/");

  let version: string | undefined;
  try {
    const tokens = await getTokens(request);
    const details = await api.getBrickDetails({
      name,
      version: "latest",
      token: tokens?.accessToken,
    });
    version = details.version;
    return json<BrickDetailsData>(
      {
        name,
        version,
        details,
      },
      {
        headers: tokens?.headers,
      }
    );
  } catch (_) {
    return { name, version };
  }
};

export const handle = { dynamicLinks };
export const links: LinksFunction = brickDetailsLinks;
export const headers: HeadersFunction = brickDetailsHeaders;
export default BrickDetails;
