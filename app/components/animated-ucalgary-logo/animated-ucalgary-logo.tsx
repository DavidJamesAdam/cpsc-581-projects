'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from "./AnimatedImage.module.css";

export default function AnimatedLogo() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggle = () => setIsAnimating(prev => !prev);

    window.addEventListener('animate-logo', toggle);
    return () => window.removeEventListener('animate-logo', toggle);
  }, []);
  return (
    <Image
      src="/UCalgary_logo.png"
      alt="Ucalgary logo png"
      width={150}
      height={50}
      className={isAnimating ? styles.animate : ""}
    />
  );
}
