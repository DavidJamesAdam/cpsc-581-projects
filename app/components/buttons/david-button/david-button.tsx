"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { keyframes } from "@mui/system";
import useSound from "use-sound";

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
  const [play, { stop }] = useSound(
    "/Blind%20Guardian-The%20Bards%20Song.wav",
    { volume: 0.5 },
  );
  const container = useRef<HTMLElement | null>(null);
  const noteIntervalRef = useRef<number | null>(null);
  const { contextSafe } = useGSAP({ scope: container });

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

  // Manage interval that continuously spawns notes while playing
  useEffect(() => {
    if (isPlaying) {
      // spawn one immediately then at intervals
      addNote();
      noteIntervalRef.current = window.setInterval(addNote, 400);
    } else {
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current);
        noteIntervalRef.current = null;
      }
      // remove any lingering notes when stopped
      setNotes([]);
    }

    return () => {
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current);
        noteIntervalRef.current = null;
      }
    };
  }, [isPlaying]);

  return (
    <Box
      ref={container}
      sx={{ textAlign: "center", mt: 5, position: "relative" }}
    >
      <Button disableRipple
        onClick={playRecord}
        sx={{padding: 0,
          zIndex: 10,
          animation: isPlaying ? `${spin} 1s linear infinite` : "none",
        }}
      >
        <Image
          src="/blind-guardian-vinyl-record-svgrepo-com.svg"
          width={75}
          height={50}
          alt="svg of record"
        />
      </Button>
      {notes.map((note) => (
        <span key={note.id} className="music-note" style={{ left: note.left }}>
          ♫
        </span>
      ))}
      <style jsx>{`
        .music-note {
          position: absolute;
          bottom: 0;
          font-size: 24px;
          animation: floatUp 1s ease-out forwards;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
}
