import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Footer, PrimaryButton } from "~/components";
import { Fragment } from "react";
import { sendVerificationEmail, ServerError, signup } from "~/brickhub.server";
import type { Credentials } from "~/brickhub.server";
import { createUserSession, getUser } from "~/session.server";

export const meta: MetaFunction = () => {
  return {
    title: "BrickHub | Sign Up",
  };
};

type ActionData = {
  formError?: string;
  fieldErrors?: { username: string | undefined; password: string | undefined };
  fields?: { username: string; password: string };
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 1) {
    return `Username must not be empty`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 1) {
    return `Password must not be empty`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = "/verify";
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest({ formError: `Form not submitted correctly.` });
  }
  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  let credentials: Credentials;
  try {
    credentials = await signup({ username, password });
  } catch (error) {
    if (error instanceof ServerError) {
      return badRequest({
        fields,
        formError: error.message,
      });
    } else {
      return badRequest({
        fields,
        formError: "An error occurred.",
      });
    }
  }

  sendVerificationEmail({ token: credentials.accessToken }).catch((_) => {});

  return createUserSession(credentials, redirectTo);
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function SignUp() {
  return (
    <Fragment>
      <main className="mx-0 h-full flex-1 items-center justify-center sm:mx-auto">
        <SignUpForm />
      </main>
      <Footer />
    </Fragment>
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

function SignUpForm() {
  const actionData = useActionData<ActionData>();

  return (
    <section className="mt-6 w-full max-w-sm rounded-md bg-dark-gray p-10 shadow-md sm:mt-14">
      <BrickHubLogo />
      <Form method="post" className="space-y-5">
        <h1 className="border-b-2 border-red-600 pb-2 text-lg font-semibold">
          Sign Up
        </h1>
        <div>
          <label className="whitespace-nowrap" htmlFor="username">
            Email
          </label>
          <input
            className="w-full appearance-none bg-gray p-2 autofill:!bg-gray focus:outline-none"
            type="email"
            name="username"
            id="username"
            autoFocus={true}
            aria-invalid={Boolean(actionData?.fieldErrors?.username)}
            aria-errormessage={
              actionData?.fieldErrors?.username ? "username-error" : undefined
            }
          />
          {actionData?.fieldErrors?.username ? (
            <p className="text-sm italic text-red-600" role="alert">
              {actionData.fieldErrors.username}
            </p>
          ) : null}
        </div>
        <div>
          <label className="whitespace-nowrap" htmlFor="password">
            Password
          </label>
          <input
            className="w-full appearance-none bg-gray p-2 focus:outline-none"
            type="password"
            name="password"
            id="password"
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-errormessage={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
          />
          {actionData?.fieldErrors?.password ? (
            <p className="text-sm italic text-red-600" role="alert">
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-sm">
            <b>Note:</b> Signup is only available for individuals who are part
            of the closed alpha. <br /> <br />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/cG8XoR1wiVxPgyWW9"
              className="underline hover:text-red-500"
              aria-label="Request access"
            >
              Request access
            </a>
            .
          </p>
        </div>
        <div>
          {actionData?.formError ? (
            <p className="text-sm italic text-red-600" role="alert">
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
      </Form>
    </section>
  );
}
