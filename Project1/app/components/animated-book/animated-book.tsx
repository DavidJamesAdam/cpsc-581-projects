'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AnimatedBook () {
  const [isAnimating, setIsAnimating] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const gifSrc = '/animated-book.gif';
  const staticSrc = '/static-book.png';

  useEffect(() => {
    const onAnimateBook = () => {
      setIsAnimating(prev => {
        const next = !prev;

        // If we're starting the animation, force GIF restart
        if (next) {
          setGifKey(k => k + 1);
        }

        return next;
      });
    };

    window.addEventListener('animate-book', onAnimateBook);
    return () =>
      window.removeEventListener('animate-book', onAnimateBook);
  }, []);

  return (
    <Image
      key={isAnimating ? gifKey : 'static'}
      src={isAnimating ? gifSrc : staticSrc}
      alt="Animated book"
      width={75}
      height={30}
      unoptimized={true}
    />
  );
};