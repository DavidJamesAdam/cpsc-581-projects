'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from "./AnimatedImage.module.css";

export default function AnimatedGameBoy () {
  const staticSrc = '/game-boy.png';

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggle = () => setIsAnimating(prev => !prev);

    window.addEventListener('animate-game-boy', toggle);
    return () => window.removeEventListener('animate-game-boy', toggle);
  }, []);
  return (
    <Image
      src={staticSrc}
      alt="Animated game boy"
      width={75}
      height={30}
      className={isAnimating ? styles.animate : ""}
    />
  );
};