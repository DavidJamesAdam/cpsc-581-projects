"use client";

import DavidButton from "./components/buttons/david-button/david-button";
import HankButton from "./components/buttons/hank-button/hank-button";
import CollinButton from "./components/buttons/collin-button/collin-button";
import Image from "next/image";
import AnimatedImage from "./components/animated-image/animated-image";
import AnimatedBook from "./components/animated-book/animated-book";
import { useState } from "react";
import AnimatedGameBoy from "./components/animated-game-boy/animated-game-boy";
import AnimatedLogo from "./components/animated-ucalgary-logo/animated-ucalgary-logo";

export default function Home() {
  const [imageTrigger, setImageTrigger] = useState(0);
  const [bookTrigger, setBookTrigger] = useState(0);
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
      <div className="grid grid-cols-2 relative left-120 top-35">
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
      <div className="relative left-340 top-125">
        <AnimatedImage />
      </div>
      <div className="flex relative left-190 top-50 w-80 justify-between">
        <AnimatedBook trigger={bookTrigger} />
        <div>
          <AnimatedGameBoy />
        </div>
      </div>
        <div className="relative left-205 -top-70">
          <AnimatedLogo />
        </div>
      <div className="relative left-450 top-80">
        <HankButton />
      </div>
      <div className="relative left-100 -top-64">
        <CollinButton />
      </div>
    </main>
  );
}
