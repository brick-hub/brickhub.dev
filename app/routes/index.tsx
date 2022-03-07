import { Header } from "~/components/header";

export default function Index() {
  return (
    <div className="flex flex-col flex-1 h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center h-3/4">
        <BrickHubLogo />
      </main>
    </div>
  );
}

function BrickHubLogo() {
  return <img alt="Brick Hub" src="images/brickhub.svg" className="w-52" />;
}
