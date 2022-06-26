import type { ActionFunction } from "@remix-run/node";
import { destroySession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  return destroySession(request);
};
