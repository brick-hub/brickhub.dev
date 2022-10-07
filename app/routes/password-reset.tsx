import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Footer, PrimaryButton, SuccessBanner } from "~/components";
import { Fragment } from "react";
import { sendPasswordResetEmail } from "~/brickhub.server";
import { getUser } from "~/session.server";

export const meta: MetaFunction = () => {
  return {
    title: "BrickHub | Password Reset",
  };
};

type ActionData = {
  formError?: string;
  fieldErrors?: { email: string | undefined };
  fields?: { email: string };
  status?: "success" | "failure" | undefined;
};

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 1) {
    return `Email must not be empty`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  switch (action) {
    case "send":
      const email = form.get("email");
      if (typeof email !== "string") {
        return badRequest({
          formError: `Form not submitted correctly.`,
          status: "failure",
        });
      }
      const fields = { email };
      const fieldErrors = {
        email: validateEmail(email),
      };

      if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
      }

      try {
        await sendPasswordResetEmail({ email });
      } catch (_) {}
      return { status: "success" };
    case "done":
      return redirect("/");
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function PasswordReset() {
  const actionData = useActionData<ActionData>();
  const success = actionData?.status === "success";

  return (
    <Fragment>
      {success ? <PasswordResetEmailSuccessBanner /> : null}
      <main className="mx-0 flex h-full flex-grow items-center justify-center sm:mx-auto">
        {success ? <PasswordResetEmailSentDialog /> : <PasswordResetForm />}
      </main>
      <Footer />
    </Fragment>
  );
}

function PasswordResetForm() {
  const actionData = useActionData<ActionData>();

  return (
    <section className="mt-6 w-full max-w-sm rounded-md bg-dark-gray p-10 shadow-md sm:mt-14">
      <BrickHubLogo />
      <Form method="post" className="space-y-5">
        <h1 className="border-b-2 border-red-600 pb-2 text-lg font-semibold">
          Password Reset
        </h1>
        <p className="text-sm">
          Enter the verified email associated with your BrickHub account and
          we'll send you a password reset link.
        </p>
        <div>
          <label className="whitespace-nowrap" htmlFor="email">
            Email
          </label>
          <input
            className="w-full appearance-none bg-gray p-2 autofill:!bg-gray focus:outline-none"
            type="email"
            name="email"
            id="email"
            autoFocus={true}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-errormessage={
              actionData?.fieldErrors?.email ? "email-error" : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p className="text-sm italic text-red-600" role="alert">
              {actionData.fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="text-sm italic text-red-600" role="alert">
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <PrimaryButton
          aria-label="Send"
          name="_action"
          value="send"
          type="submit"
        >
          Send password reset email
        </PrimaryButton>
      </Form>
    </section>
  );
}

function PasswordResetEmailSentDialog() {
  return (
    <section className="max-w-lg space-y-8 rounded-md bg-dark-gray p-10 text-center shadow-md">
      <MailIcon />
      <h2 className="text-3xl font-bold">Password Reset Email Sent</h2>
      <div>
        <p>Check your inbox!</p>
        <br />
        <p>
          If an account exists, you will receive a password reset email shortly.
        </p>
      </div>
      <div>
        <Form method="post">
          <PrimaryButton
            aria-label="Done"
            name="_action"
            value="done"
            type="submit"
          >
            Got it
          </PrimaryButton>
        </Form>
      </div>
    </section>
  );
}

function PasswordResetEmailSuccessBanner() {
  return (
    <SuccessBanner content="Password reset email has been sent."></SuccessBanner>
  );
}

function BrickHubLogo() {
  return (
    <img
      className="m-auto"
      alt="Brick Hub"
      src="/images/brickhub.svg"
      width="175"
      height="175"
    />
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-16 w-16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
