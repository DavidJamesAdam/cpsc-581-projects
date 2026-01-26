'use client';
import React, { useRef } from 'react';
import { Button, Box } from '@mui/material';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


export default function DavidButton() {
  const container = useRef();
  const { contextSafe } = useGSAP({ scope: container });

  // Create explosion animation
  const explode = contextSafe(() => {
    gsap.to(".particle", {
      x: () => gsap.utils.random(-150, 150),
      y: () => gsap.utils.random(-150, 150),
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.02
    });
    gsap.set(".particle", { x: 0, y: 0, scale: 1, opacity: 1 });
  });

  return (
    <Box ref={container} sx={{ textAlign: 'center', mt: 5, position: 'relative' }}>
      {/* Particles */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          className="particle"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 10,
            height: 10,
            bgcolor: 'primary.main',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* MUI Button */}
      <Button variant="contained" onClick={explode} sx={{ zIndex: 10 }}>
        EXPLODE
      </Button>
    </Box>
  );
}
