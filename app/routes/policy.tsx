import { redirect } from "remix";
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect(
    "https://github.com/brick-hub/brickhub.dev/blob/main/docs/policy.md"
  );
};
