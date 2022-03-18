export function Header() {
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
    </header>
  );
}

function BrickHubLogo() {
  return (
    <img alt="Brick Hub" src="/images/brickhub.svg" width="56" height="54" />
  );
}
