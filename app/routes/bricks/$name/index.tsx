import { json, redirect } from "@remix-run/node";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import * as api from "~/brickhub.server";
import {
  BrickDetails,
  brickDetailsHeaders,
  brickDetailsLinks,
} from "~/ui/brick-details";
import type { BrickDetailsData } from "~/ui/brick-details";
import { getTokens } from "~/session.server";

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
    return json(
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

export const links: LinksFunction = brickDetailsLinks;
export let headers: HeadersFunction = brickDetailsHeaders;
export default BrickDetails;
