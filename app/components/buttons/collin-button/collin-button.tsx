"use client";

import { useState, useRef, useEffect } from "react";
import "./styles.css";

export default function CollinTVButton() {
  const [isOn, setIsOn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  type Sparkle = { id: number; left: string; top: string; size: string };
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIntervalRef = useRef<number | null>(null);

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

    if (!isOn) {
      if (!sparkleIntervalRef.current) {
        sparkleIntervalRef.current = window.setInterval(addSparkle, 400);
      }
    }
    // Create audio element for TV turn on sound
    audioRef.current = new Audio();
    // Using a base64 encoded short "click/static" sound for TV turn on
    audioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZeLgHRtcX2IkZWTjYN4cHR+h46RkY6HfnZzdHmAhYmLi4mFgHt3dXV3e4CChYaGhYJ+end1dHZ5fIGEhoaFgn56d3V0dnh8gIOFhoWCfnp3dXR2eHyAg4WGhYJ+end1dHZ4fICDhYaFgn56d3V0dnh8gIOFhoWCfnp3dXR2eHyAg4WGhYJ+end1dHZ4fICDhYaFgn56d3V0dnh8gIOFhoWCfnp3dXR2eHyAg4WGhYJ+end1dHZ4fICDhYaFgn56d3V0dnh8gIOFhYWCfnp3dXR2eHyAg4WFhYJ+end1dHZ4fICDhYWFgn56d3V0dnh8gIOFhYWCfnp3dXR2eHyAg4WFhYJ+end1dHZ4fICDhYWFgn56d3V0dnh8gIOFhYWCfnp3dXR2eHyAg4WFhYJ+enh2dXd5fYGEhoaFg396eHZ1d3l9gYSGhoWDf3p4dnV3eX2BhIaGhYN/enh2dXd5fYGEhoaFg396eHZ1d3l9gYSGhoWDf3p4dnV3eX2BhIaGhYN/enh2dXd5fYGEhoaFg396eHZ1d3l9gYSGhoWDf3t5d3Z4en6Ch4mJh4SAfHl3dnh7f4OHiYmHhIB8eXd2eHt/g4eJiYeEgHx5d3Z4e3+Dh4mJh4SAfHl3dnh7f4OHiYmHhIB8eXd2eHt/g4eJiYeEgHx5d3Z4e3+Dh4mJh4SAfHl3dnh7f4OHiYmHhIB8eXd2eHt/g4eJiYeEgHx5d3Z4e3+Dh4mJh4R/e3h2dXd6foKGiImHhH96d3V0dnh8gISGhoWCfnp3dXR2eHyAg4WGhYJ+end1dHZ4fICDhYaFgn56d3V0dnh8gIOFhoWCfnp3dXR2eHyAg4WGhYJ+end1dHZ4fICDhYaFgn56d3V0dnh8gIOFhoWCfnp3dXR2eHyAg4WGhYJ+end1dHZ4fICDhYaFgn56d3V0dnh8gIOFhoWCfnp3dXR2eHyAhIaGhYN/e3h2dXd6foCDhoaFg398eXd2eHp+gYSHh4aDgHx5d3Z4en6BhIeHhoOAfHl3dnh6foGEh4eGg4B8eXd2eHp+gYSHh4aDgHx5d3Z4en6BhIeHhoOAfHl3dnh6foGEh4eGg4B8eXd2eHp+gYSHh4aDgHx5d3Z4en6BhIeHhoN/fHl3dnh7f4KFh4eGg4B8eXd2eHt/goWHh4aDgHx5d3Z4e3+ChYeHhoOAfHl3dnh7f4KFh4eGg4B8eXd2eHt/goWHh4aDgHx5d3Z4e3+ChYeHhoOAfHl3dnh7f4KFh4eGg4B8eXd2eHt/goWHh4aDgHx5d3Z4e3+ChYeHhoOAfHl3dnh7f4KFh4eGhIB8enh3eHuAg4aIiIaDgHx5eHd5fIGEh4mIhoOAfXp4d3l8gYSHiYiGg4B9enh3eXyBhIeJiIaDgH16eHd5fIGEh4mIhoOAfXp4d3l8gYSHiYiGg4B9enh3eXyBhIeJiIaDgH16eHd5fIGEh4mIhoOAfXp4d3l8gYSHiYiGg4B9enh3eXyBhIeJiIaDgH16eHd5fIGEh4mIhoN/fHp4d3l8gIOGiIiGg4B8enh3eXyAg4aIiIaDgHx6eHd5fICDhoiIhoOAfHp4d3l8gIOGiIiGg4B8enh3eXyAg4aIiIaDgHx6eHd5fICDhoiIhoOAfHp4d3l8gIOGiIiGg4B8enh3eXyAg4aIiIaDgHx6eHd5fICDhoiIhoOAfHp4d3l8gIOGiIiGg398eXd2eHuAg4aIiIaEgH16eHd5fICDhoiIhoSAfXp4d3l8gIOGiIiGhIB9enh3eXyAg4aIiIaEgH16eHd5fICDhoiIhoSAfXp4d3l8gIOGiIiGhIB9enh3eXyAg4aIiIaEgH16eHd5fICDhoiIhoSAfXp4d3l8gIOGiIiGhIB9enh3eXyAg4aIiIaEgH16eHd5e4CDhoiIhoSAfXp4d3l7gIOGiIiGhIB9enh3eXuAg4aIiIaEgH16eHd5e4CDhoiIhoSAfXp4d3l7gIOGiIiGhIB9enh3eXuAg4aIiIaEgH16eHd5e4CDhoiIhoSAfXp4d3l7gIOGiIiGhIB9enh3eXuAg4aIiIaEgH16eHd5e4CDhoiIhoSAfXp4d3l7gIOGiIiGhIB9enh3eXuAg4aIiIaEgH16eHd5e4CDhoiIhoQ=";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
        sparkleIntervalRef.current = null;
      }
    };
  }, [isOn]);

  const handleToggle = () => {
    if (isAnimating) return;
    window.dispatchEvent(new Event("animate-game-boy"));
    window.dispatchEvent(new Event("animate-logo"));

    setIsAnimating(true);

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }

    if (!isOn) {
      // Turning on - show flicker effect
      setTimeout(() => {
        setIsOn(true);
        setIsAnimating(false);
      }, 300);
    } else {
      // Turning off
      setIsOn(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* TV Set */}
      <div className="relative">
        {/* TV Outer Frame */}
        <div
          className="relative rounded-lg p-3"
          style={{
            width: "220px",
            height: "160px",
            background:
              "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
            boxShadow: `
              0 10px 30px rgba(0,0,0,0.5),
              inset 0 2px 4px rgba(255,255,255,0.1),
              inset 0 -2px 4px rgba(0,0,0,0.3)
            `,
            border: "3px solid #333",
          }}
        >
          {/* TV Screen Bezel */}
          <div
            className="relative rounded overflow-hidden"
            style={{
              width: "100%",
              height: "120px",
              background: "#111",
              border: "2px solid #222",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
            }}
          >
            {/* Screen Content */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                background: isOn
                  ? "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)"
                  : "#050505",
                transition: "background 0.3s ease",
              }}
            >
              {/* Turn on flicker effect */}
              {isAnimating && !isOn && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "white",
                    animation: "tvFlicker 0.3s ease-out",
                  }}
                />
              )}

              {/* Screen glow when on */}
              {isOn && (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(100,150,255,0.1) 0%, transparent 70%)",
                    animation: "screenGlow 3s ease-in-out infinite",
                  }}
                />
              )}

              {/* Scanlines effect */}
              {isOn && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                    animation: "scanlines 0.1s linear infinite",
                  }}
                />
              )}

              {/* TV Logo when on */}
              {isOn && (
                <div
                  className="flex flex-col items-center justify-center z-10"
                  style={{
                    animation: "fadeInScale 0.5s ease-out forwards",
                  }}
                >
                  {/* Netflix-style Logo */}
                  <svg width="100" height="50" viewBox="0 0 120 50">
                    <defs>
                      <linearGradient
                        id="tvLogoGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#e50914" />
                        <stop offset="50%" stopColor="#ff0a16" />
                        <stop offset="100%" stopColor="#b20710" />
                      </linearGradient>
                      <filter id="tvGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* N shape like Netflix */}
                    <path
                      d="M15 5 L15 45 L25 45 L25 20 L35 45 L45 45 L45 5 L35 5 L35 30 L25 5 Z"
                      fill="url(#tvLogoGradient)"
                      filter="url(#tvGlow)"
                    />
                    {/* TV text */}
                    <text
                      x="55"
                      y="32"
                      fontFamily="Arial Black, sans-serif"
                      fontSize="24"
                      fontWeight="bold"
                      fill="url(#tvLogoGradient)"
                      filter="url(#tvGlow)"
                    >
                      TV
                    </text>
                  </svg>

                  {/* COLLIN's TV text */}
                  <span
                    className="mt-2 text-xs tracking-widest"
                    style={{
                      color: "#888",
                      fontFamily: "'Courier New', monospace",
                      textShadow: "0 0 10px rgba(255,255,255,0.3)",
                    }}
                  >
                    COLLIN&apos;s TV
                  </span>
                </div>
              )}

              {/* Off state - subtle reflection */}
              {!isOn && !isAnimating && (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)",
                  }}
                />
              )}
            </div>

            {/* Screen edge highlight */}
            <div
              className="absolute inset-0 pointer-events-none rounded"
              style={{
                boxShadow: isOn
                  ? "inset 0 0 30px rgba(100,150,255,0.2), 0 0 20px rgba(100,150,255,0.1)"
                  : "none",
                transition: "box-shadow 0.3s ease",
              }}
            />
          </div>

          {/* TV Bottom Panel with brand */}
          <div className="flex items-center justify-between mt-2 px-2">
            <span
              className="text-[10px] tracking-wider"
              style={{
                color: "#444",
                fontFamily: "Arial, sans-serif",
              }}
            >
              COLLIN
            </span>

            {/* Power indicator LED */}
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: isOn
                  ? "radial-gradient(circle, #00ff00 0%, #00aa00 100%)"
                  : "radial-gradient(circle, #aa0000 0%, #550000 100%)",
                boxShadow: isOn
                  ? "0 0 8px #00ff00, 0 0 12px #00ff0080"
                  : "0 0 4px #aa000080",
                transition: "all 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* TV Stand */}
        <div className="flex flex-col items-center">
          {/* Neck */}
          <div
            style={{
              width: "30px",
              height: "15px",
              background:
                "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
              borderRadius: "0 0 4px 4px",
            }}
          />
          {/* Base */}
          <div
            style={{
              width: "80px",
              height: "8px",
              background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
              borderRadius: "2px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          />
        </div>

        {/* Ambient glow behind TV when on */}
        {isOn && (
          <div
            className="absolute -inset-4 -z-10 rounded-xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(100,150,255,0.15) 0%, transparent 70%)",
              filter: "blur(20px)",
              animation: "ambientPulse 4s ease-in-out infinite",
            }}
          />
        )}
      </div>
      {/* Power Button */}
      <button
        onClick={handleToggle}
        disabled={isAnimating}
        className="group relative flex items-center justify-center transition-all duration-200 active:scale-95"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: isOn
            ? "linear-gradient(145deg, #2d5a2d 0%, #1a3d1a 100%)"
            : "linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%)",
          boxShadow: isOn
            ? "0 4px 15px rgba(0,255,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.2)"
            : "0 4px 15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.2)",
          border: isOn ? "3px solid #4a8a4a" : "3px solid #444",
          cursor: isAnimating ? "wait" : "pointer",
        }}
      >
        {/* Power Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="transition-all duration-300"
          style={{
            filter: isOn ? "drop-shadow(0 0 8px #00ff00)" : "none",
          }}
        >
          <path
            d="M12 3v9"
            stroke={isOn ? "#00ff00" : "#888"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M17.5 6.5a8 8 0 1 1-11 0"
            stroke={isOn ? "#00ff00" : "#888"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Button hover ring */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: isOn
              ? "0 0 20px rgba(0,255,0,0.4)"
              : "0 0 20px rgba(255,255,255,0.2)",
          }}
        />
              <span className="sparkles" aria-hidden>
        {sparkles.map((s: Sparkle) => (
          <i
            key={s.id}
            className="sparkle"
            style={{ left: s.left, top: s.top, ["--size" as string]: s.size }}
            data-sparkle="📳"
          />
        ))}
      </span>
      </button>

      {/* Button Label */}
      <span
        className="text-xs tracking-widest"
        style={{
          color: isOn ? "#4a8a4a" : "#666",
          fontFamily: "'Courier New', monospace",
          textShadow: isOn ? "0 0 10px rgba(0,255,0,0.5)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {isOn ? "TV ON" : "POWER"}
      </span>


      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes tvFlicker {
          0% {
            opacity: 0;
            transform: scaleY(0.01);
          }
          20% {
            opacity: 1;
            transform: scaleY(0.01);
          }
          40% {
            opacity: 0.8;
            transform: scaleY(0.5);
          }
          60% {
            opacity: 0.5;
            transform: scaleY(0.8);
          }
          80% {
            opacity: 0.8;
            transform: scaleY(1);
          }
          100% {
            opacity: 0;
            transform: scaleY(1);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes screenGlow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }

        @keyframes ambientPulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
