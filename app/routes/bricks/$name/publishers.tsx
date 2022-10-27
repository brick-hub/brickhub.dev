import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { addPublisher, removePublisher, ServerError } from "~/brickhub.server";
import { getTokens, decodeUser } from "~/session.server";

export interface PublishersActionData {
  addPublisher?: "success" | "failure" | undefined;
  removePublisher?: "success" | "failure" | undefined;
  addPublisherError?: string;
  removePublisherError?: string;
  error?: string;
}

const badRequest = (data: PublishersActionData) => json(data, { status: 400 });

export let action: ActionFunction = async ({ request }) => {
  const tokens = await getTokens(request);
  if (!tokens) return redirect("/");

  const user = decodeUser(tokens.accessToken);
  if (!user.emailVerified) return redirect("/");

  const form = await request.formData();
  const action = form.get("_action");
  const brick = form.get("brick");
  const publisher = form.get("publisher");

  if (typeof brick !== "string" || typeof publisher !== "string") {
    return badRequest({ error: `Form not submitted correctly.` });
  }

  switch (action) {
    case "addPublisher":
      try {
        await addPublisher({ token: tokens.accessToken, brick, publisher });
        return json({ addPublisher: "success" });
      } catch (error) {
        const addPublisherError =
          error instanceof ServerError
            ? `${error.message} ${error.details ?? ""}`
            : JSON.stringify(error);
        return json({ addPublisher: "failure", addPublisherError });
      }
    case "removePublisher":
      try {
        await removePublisher({ token: tokens.accessToken, brick, publisher });
        return json({ removePublisher: "success" });
      } catch (error) {
        const removePublisherError =
          error instanceof ServerError
            ? `${error.message} ${error.details ?? ""}`
            : JSON.stringify(error);
        return json({ removePublisher: "failure", removePublisherError });
      }
  }

  return badRequest({ error: `Unsupported form action.` });
};
