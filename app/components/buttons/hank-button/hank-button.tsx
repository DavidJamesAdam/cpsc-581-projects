"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import Image from "next/image";

export default function hankButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

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
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2E5C8A",
            border: "1px solid #1a3d5a",
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
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2E5C8A",
            border: "1px solid #1a3d5a",
          }}
        />
      </Box>

      {/* Closet interior (visible when open) - snowboard */}
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
        <Image
          src="/VB.svg"
          alt="VB"
          width={200}
          height={200}
          style={{
            objectFit: "contain",
            maxWidth: "30%",
            maxHeight: "30%",
            marginLeft: "5px",
          }}
        />
        <Image
          src="/SB3.png"
          alt="Snowboard"
          width={240}
          height={380}
          style={{
            objectFit: "contain",
            maxWidth: "75%",
            maxHeight: "75%",
            marginLeft: "27px",
          }}
        />
      </Box>
    </Box>
  );
}
