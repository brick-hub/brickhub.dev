import type { ActionFunction } from "remix";
import { destroySession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return destroySession(request);
};
