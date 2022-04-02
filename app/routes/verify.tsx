import { redirect } from "remix";
import type { LoaderFunction } from "remix";
import { Fragment } from "react";
import {
  Footer,
  PrimaryButton,
  PrimaryButtonLink,
  PrimaryButtonLinkSmall,
  TextButtonLink,
} from "~/components";
import { decodeUser, getToken } from "~/utils/session.server";
import { sendVerificationEmail } from "~/utils/brickhub.server";

export const loader: LoaderFunction = async ({ request }) => {
  //   const token = await getToken(request);
  //   if (!token) return redirect("/");

  //   const user = decodeUser(token);
  //   if (user.emailVerified) return redirect("/");

  //   await sendVerificationEmail({ token });
  return null;
};

export default function VerifyEmail() {
  return (
    <Fragment>
      <main className="mx-0 flex flex-grow items-center justify-center sm:mx-auto">
        <VerifyEmailDialog />
      </main>
      <Footer />
    </Fragment>
  );
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
        <PrimaryButtonLinkSmall href="/">Got it</PrimaryButtonLinkSmall>
        <TextButtonLink>Resend email</TextButtonLink>
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
