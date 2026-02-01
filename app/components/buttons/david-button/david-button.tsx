"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { keyframes } from "@mui/system";
import useSound from "use-sound";
import "./styles.css";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export default function DavidButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [play, { stop }] = useSound(
    "/Blind%20Guardian-The%20Bards%20Song.wav",
    { volume: 0.5 },
  );
  const container = useRef<HTMLElement | null>(null);
  const noteIntervalRef = useRef<number | null>(null);
  const sparkleIntervalRef = useRef<number | null>(null);
  const { contextSafe } = useGSAP({ scope: container });

  // Add notes when record is spinning
  const addNote = () => {
    const id = Date.now() + Math.random();
    const newNote = {
      id,
      left: Math.random() * 80 + 10 + "%",
    };

    setNotes((prev) => [...prev, newNote]);

    // Remove note after animation (matches CSS animation duration)
    window.setTimeout(() => {
      setNotes((prev) => prev.filter((note: any) => note.id !== id));
    }, 1100);
  };

  const addSparkle = () => {
    const id = Date.now() + Math.random();
    const leftPct = Math.random() * 80+5;
    const topPct = Math.random() * 80+5;
    const sizePx = 6 + Math.random() * 22;
    const newSparkle = {
      id,
      left: leftPct + "%",
      top: topPct + "%",
      size: sizePx + "px",
    };

    setSparkles((prev) => [...prev, newSparkle]);

    window.setTimeout(() => {
      setSparkles((prev) => prev.filter((sparkle: any) => sparkle.id !== id));
    }, 3100);
  };

  // Toggle play/stop
  const playRecord = contextSafe(() => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    play();
  });

  // Manage intervals: continuous sparkles and notes only when playing
  useEffect(() => {
    // Ensure continuous sparkles start once

    if (isPlaying) {
      // spawn one note immediately then at intervals
      addNote();
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current);
      }
      noteIntervalRef.current = window.setInterval(addNote, 400);
    } else {
      if (!sparkleIntervalRef.current) {
        addSparkle();
        sparkleIntervalRef.current = window.setInterval(addSparkle, 400);
      }
      // stop spawning notes and clear any existing note interval
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current);
        noteIntervalRef.current = null;
      }
      setNotes([]);
    }

    return () => {
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current);
        noteIntervalRef.current = null;
      }
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
        sparkleIntervalRef.current = null;
      }
    };
  }, [isPlaying]);

  return (
    <Box
      ref={container}
      sx={{ textAlign: "center", mt: 5, position: "relative" }}
    >
      <Button
        disableRipple
        onClick={playRecord}
        className="david-btn"
        sx={{
          padding: 0,
          zIndex: 10,
          animation: isPlaying ? `${spin} 1s linear infinite` : `none`,
        }}
      >
        <Image
          src="/blind-guardian-vinyl-record-svgrepo-com.svg"
          width={75}
          height={50}
          alt="svg of record"
        />
      </Button>
      <span className="sparkles" aria-hidden>
        {sparkles.map((s: any, i: number) => (
          <i
            key={s.id}
            className="sparkle"
            style={{ left: s.left, top: s.top, ['--size' as any]: s.size }}
            data-sparkle = "💪"
          />
        ))}
      </span>
      {notes.map((note) => (
        <span key={note.id} className="music-note" style={{ left: note.left }}>
          ♫
        </span>
      ))}
    </Box>
  );
}
