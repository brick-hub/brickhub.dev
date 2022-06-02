import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect(
    "https://github.com/brick-hub/brickhub.dev/blob/main/docs/policy.md"
  );
};
