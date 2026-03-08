/**
 * Hand detection overlay with MediaPipe Hand Landmarker.
 * Detects "two" gesture (index + middle finger extended) and shows "start recording" text.
 */

import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

// MediaPipe hand landmark indices
const WRIST = 0;
const THUMB_TIP = 4, THUMB_IP = 3;
const INDEX_TIP = 8, INDEX_PIP = 6;
const MIDDLE_TIP = 12, MIDDLE_PIP = 10;
const RING_TIP = 16, RING_PIP = 14;
const PINKY_TIP = 20, PINKY_PIP = 18;

const PREVIEW_WIDTH = 240;
const PREVIEW_HEIGHT = 180;

/**
 * Check if "two" gesture: only index and middle fingers extended, others closed.
 * Uses landmark positions: extended = tip further from wrist than PIP.
 */
function isTwoGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  // Index extended: tip farther from wrist than PIP
  const indexExtended =
    dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * 1.1;

  // Middle extended
  const middleExtended =
    dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * 1.1;

  // Ring closed: tip closer to wrist than PIP (curled)
  const ringClosed =
    dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * 1.15;

  // Pinky closed
  const pinkyClosed =
    dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * 1.15;

  // Thumb closed: tip closer to wrist than IP (curled)
  const thumbClosed =
    dist(landmarks[THUMB_TIP], wrist) <= dist(landmarks[THUMB_IP], wrist) * 1.15;

  return indexExtended && middleExtended && ringClosed && pinkyClosed && thumbClosed;
}

/**
 * Initialize the hand detection overlay in the upper-left corner.
 */
export async function initHandDetection() {
  const container = document.createElement("div");
  container.id = "hand-detection-overlay";
  container.innerHTML = `
    <div class="hand-preview-container">
      <video class="hand-preview-video" autoplay playsinline muted></video>
      <canvas class="hand-preview-canvas"></canvas>
      <div class="gesture-text" id="gesture-text"></div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #hand-detection-overlay {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 1000;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.3);
    }
    .hand-preview-container {
      position: relative;
      width: ${PREVIEW_WIDTH}px;
      height: ${PREVIEW_HEIGHT}px;
      background: #1a1a1a;
    }
    .hand-preview-video,
    .hand-preview-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hand-preview-canvas {
      pointer-events: none;
    }
    .gesture-text {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 14px;
      background: rgba(0,0,0,0.75);
      color: #4ade80;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }
    .gesture-text.visible {
      opacity: 1;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(container);

  const video = container.querySelector(".hand-preview-video");
  const canvas = container.querySelector(".hand-preview-canvas");
  const ctx = canvas.getContext("2d");
  const gestureText = container.querySelector("#gesture-text");
  const drawingUtils = new DrawingUtils(ctx);

  canvas.width = PREVIEW_WIDTH;
  canvas.height = PREVIEW_HEIGHT;

  // Request webcam
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, facingMode: "user" },
  });
  video.srcObject = stream;

  // Initialize MediaPipe Hand Landmarker
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    },
    runningMode: "VIDEO",
    numHands: 1,
  });

  let lastVideoTime = -1;
  let lastLandmarks = [];

  async function detectGesture() {
    if (video.readyState < 2) {
      requestAnimationFrame(detectGesture);
      return;
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const now = performance.now() / 1000;
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = handLandmarker.detectForVideo(video, now * 1000);

      lastLandmarks = results.landmarks || [];

      let detected = false;
      if (lastLandmarks.length > 0) {
        detected = lastLandmarks.some(isTwoGesture);
      }

      if (detected) {
        gestureText.textContent = "start recording";
        gestureText.classList.add("visible");
      } else {
        gestureText.classList.remove("visible");
      }
    }

    // Draw hand landmarks
    for (const landmarks of lastLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        HandLandmarker.HAND_CONNECTIONS,
        { color: "#00ff00", lineWidth: 2 }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#00ff00",
        lineWidth: 1,
        radius: 3,
      });
    }

    requestAnimationFrame(detectGesture);
  }

  video.addEventListener("loadeddata", () => {
    detectGesture();
  });
}
