import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Footer, PrimaryButton, TextButtonLink } from "~/components";
import { Fragment } from "react";
import { login } from "~/utils/brickhub.server";
import { createUserSession, getUser } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return {
    title: "BrickHub | Sign In",
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
  const redirectTo = "/";
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

  const credentials = await login({ username, password });
  if (!credentials) {
    return badRequest({
      fields,
      formError: `Invalid username/password`,
    });
  }

  return createUserSession(credentials, redirectTo);
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function Login() {
  return (
    <Fragment>
      <main className="mx-0 flex-1 items-center justify-center sm:mx-auto">
        <LoginForm />
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

function LoginForm() {
  const actionData = useActionData<ActionData>();

  return (
    <section className="mt-6 w-full max-w-sm rounded-md bg-dark-gray p-10 shadow-md sm:mt-14">
      <BrickHubLogo />
      <Form method="post" className="space-y-5">
        <h1 className="border-b-2 border-red-600 pb-2 text-lg font-semibold">
          Sign In
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
            <p
              className="text-sm italic text-red-600"
              role="alert"
              id="username-error"
            >
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
          {actionData?.formError ? (
            <p className="text-sm italic text-red-600" role="alert">
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <PrimaryButton type="submit">Sign In</PrimaryButton>
        <TextButtonLink aria-label="Sign up" href="/signup">
          Create Account
        </TextButtonLink>
      </Form>
    </section>
  );
}
