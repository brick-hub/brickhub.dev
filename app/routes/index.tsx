import { Header } from "~/components/header";

export default function Index() {
  return (
    <div className="flex flex-col flex-1 h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center h-3/4">
        <AnimatedLogo />
      </main>
    </div>
  );
}

function AnimatedLogo() {
  return (
    <video
      src="media/animated_logo.mp4"
      aria-label="Brick Hub"
      className="w-52"
      autoPlay
      muted
      playsInline
    ></video>
  );
}
