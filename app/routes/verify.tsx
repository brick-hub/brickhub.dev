import { Form, redirect, useActionData } from "remix";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { Fragment } from "react";
import {
  ErrorBanner,
  SuccessBanner,
  Footer,
  PrimaryButton,
  TextButton,
} from "~/components";
import {
  createUserSession,
  decodeUser,
  getTokens,
} from "~/utils/session.server";
import {
  refresh,
  sendVerificationEmail,
  ServerError,
} from "~/utils/brickhub.server";

export const meta: MetaFunction = () => {
  return {
    title: "BrickHub | Verify Email",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const tokens = await getTokens(request);
  if (!tokens) return redirect("/");

  const user = decodeUser(tokens.accessToken);
  if (user.emailVerified) return redirect("/");

  return null;
};

interface ActionData {
  resend: "success" | "failure" | undefined;
  resendError?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const tokens = await getTokens(request);
  if (!tokens) return redirect("/");

  const user = decodeUser(tokens.accessToken);
  if (user.emailVerified) return redirect("/");

  const form = await request.formData();
  const action = form.get("_action");

  switch (action) {
    case "continue":
      const credentials = await refresh({ token: tokens.refreshToken });
      return createUserSession(credentials, "/");
    case "resend":
      try {
        await sendVerificationEmail({ token: tokens.accessToken });
        return { resend: "success" };
      } catch (error) {
        console.log(error);
        const resendError = error instanceof ServerError ? error.message : null;
        return { resend: "failure", resendError };
      }
  }
  return null;
};

export default function VerifyEmail() {
  const data = useActionData<ActionData>();
  return (
    <Fragment>
      {data?.resend === "success" ? (
        <EmailResendSuccessBanner />
      ) : data?.resend === "failure" ? (
        <EmailResendFailureBanner message={data.resendError} />
      ) : null}
      <main className="mx-0 flex flex-grow items-center justify-center sm:mx-auto">
        <VerifyEmailDialog />
      </main>
      <Footer />
    </Fragment>
  );
}

function EmailResendSuccessBanner() {
  return (
    <SuccessBanner content="Verification email has been resent."></SuccessBanner>
  );
}

function EmailResendFailureBanner({ message }: { message?: string }) {
  const content =
    message ?? "Failed to resend verification email. Please try again later.";
  return <ErrorBanner content={content}></ErrorBanner>;
}

function VerifyEmailDialog() {
  return (
    <section className="max-w-lg space-y-8 rounded-md bg-dark-gray p-10 text-center shadow-md">
      <MailIcon />
      <h2 className="text-3xl font-bold">Verify your email</h2>
      <div>
        <p>Almost there!</p>
        <br />
        <p>
          We've sent you a verification email. You will need to verify your
          email address in order to publish bricks.
        </p>
      </div>
      <div>
        <Form method="post">
          <PrimaryButton
            aria-label="Continue"
            name="_action"
            value="continue"
            type="submit"
          >
            Got it
          </PrimaryButton>
          <TextButton
            aria-label="Resend email"
            name="_action"
            value="resend"
            type="submit"
          >
            Resend email
          </TextButton>
        </Form>
      </div>
    </section>
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
