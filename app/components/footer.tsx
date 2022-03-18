import { forwardRef } from "react";

export function Footer() {
  return (
    <footer className="mt-24 flex items-center justify-between bg-dark-gray px-6 py-4 lg:px-12">
      <a
        className="justify-content inline-flex items-center"
        aria-label="Go home"
        href="/"
      >
        <BrickHubLogo />
      </a>
      <nav className="flex gap-1">
        <FooterLink
          aria-label="Go to GitHub"
          target="_blank"
          href="https://github.com/brick-hub"
        >
          <GitHubLogo />
        </FooterLink>
        <FooterLink
          aria-label="Report an issue"
          target="_blank"
          href="https://github.com/brick-hub/brickhub.dev/issues/new/choose"
        >
          <ExclamationCircleIcon />
        </FooterLink>
      </nav>
    </footer>
  );
}

const FooterLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements["a"]>(
  (props, ref) => (
    <a
      {...props}
      className="mx-2 flex items-center font-semibold last:mr-0 sm:mx-4"
      ref={ref}
    >
      {props.children}
    </a>
  )
);

FooterLink.displayName = "FooterLink";

function BrickHubLogo() {
  return (
    <img alt="Brick Hub" src="/images/brickhub.svg" width="40" height="38" />
  );
}

function GitHubLogo() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>Go to GitHub</title>
      <path
        d="M20.0002 0C9.01496 0 0 9.01496 0 20.0002C0 29.3743 6.57781 37.8897 15.3126 40.0003V33.3834C14.4471 33.5729 13.6506 33.5784 12.7696 33.3187C11.5876 32.9699 10.6272 32.1826 9.91432 30.982C9.45991 30.2154 8.65455 29.3841 7.81439 29.4451L7.6084 27.1105C9.42512 26.9549 10.9968 28.2174 11.9297 29.7848C12.3441 30.4818 12.8211 30.8904 13.4333 31.0711C14.0251 31.2454 14.6605 31.1617 15.4008 30.9002C15.5867 29.4179 16.2657 28.8631 16.7787 28.0819V28.0807C11.5693 27.3037 9.49318 24.54 8.66919 22.3586C7.57727 19.4621 8.16321 15.8436 10.0941 13.5569C10.1316 13.5124 10.1994 13.3958 10.1731 13.3143C9.28779 10.64 10.3666 8.4278 10.4063 8.19312C11.428 8.49524 11.594 7.88916 14.8445 9.86397L15.4063 10.2015C15.6413 10.3416 15.5674 10.2616 15.8024 10.2439C17.1596 9.87526 18.5902 9.6717 19.9998 9.65339C21.4201 9.6717 22.8417 9.87526 24.2549 10.2589L24.4368 10.2772C24.421 10.2747 24.4863 10.2656 24.5958 10.2003C28.6562 7.74084 28.5103 8.54468 29.5992 8.19068C29.6386 8.42566 30.7031 10.6739 29.8272 13.3143C29.7091 13.6781 33.3474 17.0097 31.3308 22.3577C30.5068 24.54 28.431 27.3037 23.2216 28.0807V28.0819C23.8893 29.0996 24.6917 29.641 24.6874 31.7407V40.0003C33.4225 37.8897 40 29.3743 40 20.0002C40.0003 9.01496 30.9853 0 20.0002 0V0Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function ExclamationCircleIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>Report an issue</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
}
