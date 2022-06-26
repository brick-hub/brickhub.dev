import { Form } from "@remix-run/react";
import type { User } from "~/brickhub.server";

export function Header({ user }: { user?: User }) {
  return (
    <header className="flex items-center justify-between px-6 py-9 lg:px-12">
      <a
        className="justify-content inline-flex items-center"
        aria-label="Go home"
        href="/"
      >
        <BrickHubLogo />
        <p className="mx-2 text-3xl font-bold">BrickHub</p>
      </a>
      {user ? <DropdownMenu user={user} /> : <SignInButton />}
    </header>
  );
}

function SignInButton() {
  return (
    <a
      className="text-sm hover:text-red-500"
      aria-label="Sign in"
      href="/login"
    >
      Sign In
    </a>
  );
}

function BrickHubLogo() {
  return (
    <img alt="Brick Hub" src="/images/brickhub.svg" width="56" height="54" />
  );
}

function DropdownMenu({ user }: { user: User }) {
  return (
    <div className="group relative inline-block pb-2 text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <UserAvatar email={user.email} />
        </button>
      </div>

      <div
        className="absolute right-0 mt-1 hidden w-56 origin-top-right rounded-md bg-dark-gray shadow-lg ring-1 ring-black ring-opacity-5 hover:block focus:outline-none group-hover:block"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="px-4 py-2 text-sm">
          {user.email}{" "}
          {user.emailVerified ? (
            <span className="text-green-500">&#x2713;</span>
          ) : null}
        </div>
        <hr className="mx-4 text-slate-600" />
        <div className="py-1" role="none">
          <Form action="/logout" method="post">
            <button
              role="menuitem"
              tabIndex={-1}
              id="menu-item-0"
              type="submit"
              className="block px-4 py-2 text-sm hover:text-red-500"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function UserAvatar({ email }: { email: string }) {
  return (
    <img
      alt="avatar"
      className="rounded-full"
      height="38"
      width="38"
      src={`https://avatars.dicebear.com/api/initials/${email}.svg?size=38&background=%23ef4444&fontSize=42`}
    ></img>
  );
}
