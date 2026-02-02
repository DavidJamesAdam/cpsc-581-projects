"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import "./styles.css";

export default function hankButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [vbAnimation, setVbAnimation] = useState(false);
  type Sparkle = { id: number; left: string; top: string; size: string };
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIntervalRef = useRef<number | null>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
    window.dispatchEvent(new CustomEvent("animate-image"));
  };

  useEffect(() => {
    const addSparkle = () => {
      const id = Date.now() + Math.random();
      const leftPct = Math.random() * 70;
      const topPct = Math.random() * 70;
      const sizePx = 6 + Math.random() * 22;
      const newSparkle = {
        id,
        left: leftPct + "%",
        top: topPct + "%",
        size: sizePx + "px",
      };

      setSparkles((prev) => [...prev, newSparkle]);

      window.setTimeout(() => {
        setSparkles((prev) =>
          prev.filter((sparkle: Sparkle) => sparkle.id !== id),
        );
      }, 3100);
    };
    if (isOpen) {
      // Start VB animation when door opens
      const timer = setTimeout(() => {
        setVbAnimation(true);
      }, 500); // Wait for door to open
      return () => clearTimeout(timer);
    } else {
      if (!sparkleIntervalRef.current) {
        sparkleIntervalRef.current = window.setInterval(addSparkle, 400);
      }
      // Reset animation when door closes
      setVbAnimation(false);
    }
    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
        sparkleIntervalRef.current = null;
      }
    };
  }, [isOpen]);

  return (
    <Box
      sx={{
        position: "absolute",
        right: "calc(5% - 15px)",
        bottom: "calc(5% + 230px)",
        width: "270px",
        height: "440px",
        cursor: "pointer",
        zIndex: 5,
        perspective: "1000px",
      }}
      onClick={handleClick}
    >
      {/* Closet frame/background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#4A90E2",
          border: "2px solid #2E5C8A",
          borderRadius: "4px",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
        }}
      />

      {/* Left door */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          backgroundColor: "#5BA3F5",
          border: "2px solid #2E5C8A",
          borderRadius: "4px 0 0 4px",
          transformStyle: "preserve-3d",
          transformOrigin: "left center",
          transform: isOpen ? "rotateY(-90deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease-in-out",
          boxShadow: isOpen ? "none" : "inset -2px 0 5px rgba(0,0,0,0.2)",
          zIndex: 2,
        }}
      >
        {/* Door handle */}
        <Box
          sx={{
            position: "absolute",
            right: "20px",
            top: "40%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2E5C8A",
            border: "1px solid #1a3d5a",
          }}
        />

        {/* Pink oval below handle (left door) */}
        <Box
          sx={{
            position: "absolute",
            right: "40px",
            top: "calc(40% + 18px)",
            width: "22px",
            height: "12px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 111, 179, 0.5)",
          }}
        />

        {/* Top outer corner 90° black sector (left door) */}
        <Box
          sx={{
            position: "absolute",
            top: -1,
            left: -1,
            width: 135,
            height: 135,
            backgroundColor: "#000",
            borderRadius: "0 0 135px 0",
          }}
        />
      </Box>

      {/* Right door */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          backgroundColor: "#5BA3F5",
          border: "2px solid #2E5C8A",
          borderRadius: "0 4px 4px 0",
          transformStyle: "preserve-3d",
          transformOrigin: "right center",
          transform: isOpen ? "rotateY(90deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease-in-out",
          boxShadow: isOpen ? "none" : "inset 2px 0 5px rgba(0,0,0,0.2)",
          zIndex: 2,
        }}
      >
        {/* Door handle */}
        <Box
          sx={{
            position: "absolute",
            left: "20px",
            top: "40%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2E5C8A",
            border: "1px solid #1a3d5a",
          }}
        />

        {/* Pink oval below handle (right door) */}
        <Box
          sx={{
            position: "absolute",
            left: "40px",
            top: "calc(40% + 18px)",
            width: "22px",
            height: "12px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 111, 179, 0.5)",
          }}
        />

        {/* Top outer corner 90° black sector (right door) */}
        <Box
          sx={{
            position: "absolute",
            top: -1,
            right: -1,
            width: 135,
            height: 145,
            backgroundColor: "#000",
            borderRadius: "0 0 0 145px",
          }}
        />
      </Box>

      {/* Closet interior (visible when open) - snowboard & Volleyball */}
      <Box
        sx={{
          position: "absolute",
          left: "5%",
          top: "5%",
          width: "90%",
          height: "90%",
          backgroundColor: "#2a1f15",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
        }}
      >
        {/* VB with animation - starts at initial position, falls when door opens */}
        <Box
          sx={{
            position: "absolute",
            left: "5px",
            bottom: "0px",
            "@keyframes vbFallAndSlide": {
              "0%": {
                transform: "translate(0, 0)",
              },
              "10%": {
                transform: "translate(0, 25px)",
              },
              "20%": {
                transform: "translate(0, 5px)",
              },
              "30%": {
                transform: "translate(0, 25px)",
              },
              "40%": {
                transform: "translate(0, 18px)",
              },
              "50%": {
                transform: "translate(0, 25px)",
              },
              "100%": {
                transform: "translate(0, 25px)",
              },
            },
            animation: vbAnimation
              ? "vbFallAndSlide 2.5s ease-in-out forwards"
              : "none",
          }}
        >
          <Image
            src="/VB.svg"
            alt="VB"
            width={200}
            height={200}
            style={{
              objectFit: "contain",
              maxWidth: "30%",
              maxHeight: "30%",
            }}
          />
        </Box>
        {/* SB3 - stays in place */}
        <Box
          sx={{
            position: "relative",
            width: "240px",
            height: "380px",
            maxWidth: "75%",
            maxHeight: "75%",
            marginLeft: "106px",
          }}
        >
          <Image
            src="/SB3.png"
            alt="Snowboard"
            width={240}
            height={380}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>

        {/* SB-Man slides from top of SB3 when door opens */}
        <Box
          sx={{
            position: "absolute",
            left: "220px",
            bottom: "290px",
            transform: "scaleX(-1) rotate(-18deg)",
            transformOrigin: "center",
            opacity: 1,
            pointerEvents: "none",
            "@keyframes sbManSlideToLeftBottom": {
              "0%": {
                left: "220px",
                bottom: "290px",
                transform: "scaleX(-1) rotate(-18deg)",
                opacity: 1,
              },
              "25%": {
                left: "180px",
                bottom: "290px",
                transform: "scaleX(-1) rotate(-18deg)",
                opacity: 1,
              },
              "30%": {
                left: "140px",
                bottom: "290px",
                transform: "scaleX(-1) rotate(60deg)",
                opacity: 1,
              },
              "80%": {
                left: "85px",
                bottom: "30px",
                transform: "scaleX(-1) rotate(60deg)",
                opacity: 1,
              },
              "90%": {
                left: "80px",
                bottom: "-5px",
                transform: "scaleX(-1) rotate(-18deg)",
                opacity: 1,
              },
              "100%": {
                left: "80px",
                bottom: "-5px",
                transform: "scaleX(-1) rotate(-18deg)",
                opacity: 0,
              },
            },
            animation: isOpen
              ? "sbManSlideToLeftBottom 2s ease-in-out infinite"
              : "none",
            animationDelay: isOpen ? "0.8s" : "0s",
          }}
        >
          <Image
            src="/SB-Man.svg"
            alt="SB-Man"
            width={30}
            height={30}
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
      <span className="sparkles" aria-hidden>
        {sparkles.map((s: Sparkle) => (
          <i
            key={s.id}
            className="sparkle"
            style={{ left: s.left, top: s.top, ["--size" as string]: s.size }}
            data-sparkle="🤿"
          />
        ))}
      </span>
    </Box>
  );
}
