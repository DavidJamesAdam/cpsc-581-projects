'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from "./AnimatedImage.module.css";

export default function AnimatedImage() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggle = () => setIsAnimating(prev => !prev);

    window.addEventListener('animate-image', toggle);
    return () => window.removeEventListener('animate-image', toggle);
  }, []);
  return (
    <Image
      src="/pngwing.com.png"
      alt="Toy plane png"
      width={150}
      height={50}
      className={isAnimating ? styles.animate : ""}
    />
  );
}
