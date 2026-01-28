import DavidButton from "./components/buttons/david-button/david-button";
import HankButton from "./components/buttons/hank-button/hank-button";
import CollinButton from "./components/buttons/collin-button/collin-button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image
        src="/446.jpg"
        alt="Background image"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <DavidButton />
        <HankButton />
        <CollinButton />
      </main>
    </div>
  );
}
