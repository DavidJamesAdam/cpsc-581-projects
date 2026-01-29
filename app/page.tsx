import DavidButton from "./components/buttons/david-button/david-button";
import HankButton from "./components/buttons/hank-button/hank-button";
import CollinButton from "./components/buttons/collin-button/collin-button";
import Image from "next/image";

export default function Home() {
  return (
      <main className="flex min-h-screen w-full flex-col items-center justify-between sm:items-start">
      <Image
        src="/cartoon_bedroom.webp"
        alt="Background image"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
      />
        <div className="grid grid-cols-2 relative left-65">
          <DavidButton />
          <Image
            src="/green-vinyl-record-svgrepo-com.svg"
            width={75}
            height={50}
            alt="svg of record"
          />
          <Image
            src="/blue-vinyl-record-svgrepo-com.svg"
            width={75}
            height={50}
            alt="svg of record"
          />
          <Image
            src="/purple-vinyl-record-svgrepo-com.svg"
            width={75}
            height={50}
            alt="svg of record"
          />
        </div>
        <HankButton />
        <CollinButton />
      </main>
  );
}
