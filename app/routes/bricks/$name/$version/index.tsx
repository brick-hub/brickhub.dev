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
  brickVersionRegExp,
} from "~/pages/brick-details";
import type { BrickDetailsData } from "~/pages/brick-details";

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
    "og:url": `https://brickhub.dev/bricks/${data.name}/${data.version}`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const name = params.name;
  const version = params.version;
  if (!name || !version) return redirect("/");

  const isSemanticVersion = brickVersionRegExp.test(version);
  if (!isSemanticVersion) return redirect("/");

  try {
    const details = await api.getBrickDetails({ name, version });
    const headers = { "Cache-Control": "max-age=3600, immutable" };
    return json(
      {
        name,
        version,
        details,
      },
      { headers }
    );
  } catch (_) {
    return { name, version };
  }
};

export const links: LinksFunction = brickDetailsLinks;
export let headers: HeadersFunction = brickDetailsHeaders;
export default BrickDetails;
