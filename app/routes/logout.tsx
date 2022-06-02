import type { ActionFunction } from "@remix-run/node";
import { destroySession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return destroySession(request);
};
