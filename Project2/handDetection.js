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

// Threshold for "touching"
const TOUCH_THRESHOLD = 0.06;

// Thumb is closed if thumb tip is touching any other joint; otherwise open.
function isThumbClosed(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const thumbTip = landmarks[THUMB_TIP];
  for (let i = 0; i < landmarks.length; i++) {
    if (i === THUMB_TIP) continue;
    if (dist(thumbTip, landmarks[i]) < TOUCH_THRESHOLD) return true;
  }
  return false;
}

// one gesture: only index finger extended (for selecting object)
function isOneGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexExtended =
    dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * 1.1;
  const middleClosed =
    dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * 1.15;
  const ringClosed =
    dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * 1.15;
  const pinkyClosed =
    dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * 1.15;
  const thumbClosed = isThumbClosed(landmarks);

  return indexExtended && middleClosed && ringClosed && pinkyClosed && thumbClosed;
}

// start recording gesture
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

  // Thumb closed: tip touching any other joint
  const thumbClosed = isThumbClosed(landmarks);

  return indexExtended && middleExtended && ringClosed && pinkyClosed && thumbClosed;
}

// three gesture: index, middle, ring extended; thumb and pinky closed
function isThreeGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexExtended =
    dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * 1.1;
  const middleExtended =
    dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * 1.1;
  const ringExtended =
    dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * 1.1;
  const pinkyClosed =
    dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * 1.15;
  const thumbClosed = isThumbClosed(landmarks);

  return indexExtended && middleExtended && ringExtended && pinkyClosed && thumbClosed;
}

// four gesture: index, middle, ring, pinky extended; thumb closed
function isFourGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexExtended =
    dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * 1.1;
  const middleExtended =
    dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * 1.1;
  const ringExtended =
    dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * 1.1;
  const pinkyExtended =
    dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * 1.1;
  const thumbClosed = isThumbClosed(landmarks);

  return indexExtended && middleExtended && ringExtended && pinkyExtended && thumbClosed;
}

// five gesture: all fingers extended
function isFiveGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexExtended =
    dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * 1.1;
  const middleExtended =
    dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * 1.1;
  const ringExtended =
    dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * 1.1;
  const pinkyExtended =
    dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * 1.1;
  const thumbExtended = !isThumbClosed(landmarks);

  return indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended;
}

// pinky + ring: pinky and ring extended, others closed (for selecting y axis)
function isPinkyRingGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexClosed =
    dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * 1.15;
  const middleClosed =
    dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * 1.15;
  const ringExtended =
    dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * 1.1;
  const pinkyExtended =
    dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * 1.1;
  const thumbClosed = isThumbClosed(landmarks);

  return indexClosed && middleClosed && ringExtended && pinkyExtended && thumbClosed;
}

// pinky + ring + middle: pinky, ring, middle extended, thumb and index closed (for selecting z axis)
function isPinkyRingMiddleGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexClosed =
    dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * 1.15;
  const middleExtended =
    dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * 1.1;
  const ringExtended =
    dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * 1.1;
  const pinkyExtended =
    dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * 1.1;
  const thumbClosed = isThumbClosed(landmarks);

  return indexClosed && middleExtended && ringExtended && pinkyExtended && thumbClosed;
}

// pinky only: only pinky finger extended (for selecting x axis)
function isPinkyOnlyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  const indexClosed =
    dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * 1.15;
  const middleClosed =
    dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * 1.15;
  const ringClosed =
    dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * 1.15;
  const pinkyExtended =
    dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * 1.1;
  const thumbClosed = isThumbClosed(landmarks);

  return indexClosed && middleClosed && ringClosed && pinkyExtended && thumbClosed;
}

// stop recording gesture
function isAllFingersClosed(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];

  // Thumb closed: tip touching any other joint
  const thumbClosed = isThumbClosed(landmarks);
  const indexClosed =
    dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * 1.15;
  const middleClosed =
    dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * 1.15;
  const ringClosed =
    dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * 1.15;
  const pinkyClosed =
    dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * 1.15;

  return thumbClosed && indexClosed && middleClosed && ringClosed && pinkyClosed;
}

//  Initialize the hand detection overlay in the upper-left corner.
export async function initHandDetection(options = {}) {
  const {
    onOneGestureSelect,
    onTwoGestureSelect,
    onStartRecording,
    onStopRecording,
    onThreeGestureSelect,
    onFourGestureSelect,
    onFiveGestureSelect,
    onPinkyGestureSelect,
    onPinkyRingGestureSelect,
    onPinkyRingMiddleGestureSelect,
    onHandPositionChange,
    isObjectSelected,
    isSingleAxisSelected,
    selectTextElement,
  } = options;
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
    .gesture-text.stop {
      color: #f87171;
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
  let isRecording = false;
  let twoGestureStartTime = null;
  let twoGestureFired = false;
  let allClosedStartTime = null;
  let allClosedFired = false;
  let oneGestureStartTime = null;
  let oneGestureFired = false;
  let threeGestureStartTime = null;
  let threeGestureFired = false;
  let fourGestureStartTime = null;
  let fourGestureFired = false;
  let fiveGestureStartTime = null;
  let fiveGestureFired = false;
  let pinkyGestureStartTime = null;
  let pinkyGestureFired = false;
  let pinkyRingGestureStartTime = null;
  let pinkyRingGestureFired = false;
  let pinkyRingMiddleGestureStartTime = null;
  let pinkyRingMiddleGestureFired = false;
  let lastHandY = null;

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

      const twoGesture = lastLandmarks.length > 0 && lastLandmarks.some(isTwoGesture);
      const allClosed = lastLandmarks.length > 0 && lastLandmarks.some(isAllFingersClosed);
      const oneGesture = lastLandmarks.length > 0 && lastLandmarks.some(isOneGesture);
      const objectSelected = isObjectSelected?.() ?? false;
      const threeGesture = objectSelected && lastLandmarks.length > 0 && lastLandmarks.some(isThreeGesture);
      const fourGesture = objectSelected && lastLandmarks.length > 0 && lastLandmarks.some(isFourGesture);
      const fiveGesture = objectSelected && lastLandmarks.length > 0 && lastLandmarks.some(isFiveGesture);
      const pinkyGesture = objectSelected && lastLandmarks.length > 0 && lastLandmarks.some(isPinkyOnlyGesture);
      const pinkyRingGesture = objectSelected && lastLandmarks.length > 0 && lastLandmarks.some(isPinkyRingGesture);
      const pinkyRingMiddleGesture = objectSelected && lastLandmarks.length > 0 && lastLandmarks.some(isPinkyRingMiddleGesture);

      if (twoGesture) {
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        oneGestureFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (twoGestureStartTime === null) {
          twoGestureStartTime = now;
        }
        if (now - twoGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "deselect";
            selectTextElement.style.opacity = "1";
          } else {
            gestureText.textContent = "deselect";
            gestureText.classList.remove("stop");
            gestureText.classList.add("visible");
          }
          if (!twoGestureFired && onTwoGestureSelect) {
            twoGestureFired = true;
            onTwoGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
          else gestureText.classList.remove("visible");
        }
      } else if (allClosed) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        oneGestureStartTime = null;
        oneGestureFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (allClosedStartTime === null) {
          allClosedStartTime = now;
        }
        if (now - allClosedStartTime >= 1) {
          if (!allClosedFired) {
            allClosedFired = true;
            if (!isRecording) {
              gestureText.textContent = "start recording";
              gestureText.classList.remove("stop");
              isRecording = true;
              onStartRecording?.();
            } else {
              gestureText.textContent = "stop recording";
              gestureText.classList.add("stop");
              isRecording = false;
              onStopRecording?.();
            }
          }
          gestureText.classList.add("visible");
        } else {
          gestureText.classList.remove("visible");
        }
      } else if (oneGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (oneGestureStartTime === null) {
          oneGestureStartTime = now;
        }
        if (now - oneGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "select";
            selectTextElement.style.opacity = "1";
          } else {
            gestureText.textContent = "select";
            gestureText.classList.remove("stop");
            gestureText.classList.add("visible");
          }
          if (!oneGestureFired && onOneGestureSelect) {
            oneGestureFired = true;
            onOneGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
          else gestureText.classList.remove("visible");
        }
      } else if (threeGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (threeGestureStartTime === null) threeGestureStartTime = now;
        if (now - threeGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "translate";
            selectTextElement.style.opacity = "1";
          }
          if (!threeGestureFired && onThreeGestureSelect) {
            threeGestureFired = true;
            onThreeGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
        }
      } else if (fourGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (fourGestureStartTime === null) fourGestureStartTime = now;
        if (now - fourGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "rotate";
            selectTextElement.style.opacity = "1";
          }
          if (!fourGestureFired && onFourGestureSelect) {
            fourGestureFired = true;
            onFourGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
        }
      } else if (fiveGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (fiveGestureStartTime === null) fiveGestureStartTime = now;
        if (now - fiveGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "scale";
            selectTextElement.style.opacity = "1";
          }
          if (!fiveGestureFired && onFiveGestureSelect) {
            fiveGestureFired = true;
            onFiveGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
        }
      } else if (pinkyRingMiddleGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        oneGestureFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        if (pinkyRingMiddleGestureStartTime === null) pinkyRingMiddleGestureStartTime = now;
        if (now - pinkyRingMiddleGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "z axis";
            selectTextElement.style.opacity = "1";
          }
          if (!pinkyRingMiddleGestureFired && onPinkyRingMiddleGestureSelect) {
            pinkyRingMiddleGestureFired = true;
            onPinkyRingMiddleGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
        }
      } else if (pinkyRingGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        oneGestureFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (pinkyRingGestureStartTime === null) pinkyRingGestureStartTime = now;
        if (now - pinkyRingGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "y axis";
            selectTextElement.style.opacity = "1";
          }
          if (!pinkyRingGestureFired && onPinkyRingGestureSelect) {
            pinkyRingGestureFired = true;
            onPinkyRingGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
        }
      } else if (pinkyGesture) {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        oneGestureFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (pinkyGestureStartTime === null) pinkyGestureStartTime = now;
        if (now - pinkyGestureStartTime >= 1) {
          if (selectTextElement) {
            selectTextElement.textContent = "x axis";
            selectTextElement.style.opacity = "1";
          }
          if (!pinkyGestureFired && onPinkyGestureSelect) {
            pinkyGestureFired = true;
            onPinkyGestureSelect();
          }
        } else {
          if (selectTextElement) selectTextElement.style.opacity = "0";
        }
      } else {
        twoGestureStartTime = null;
        twoGestureFired = false;
        allClosedStartTime = null;
        allClosedFired = false;
        oneGestureStartTime = null;
        oneGestureFired = false;
        threeGestureStartTime = null;
        threeGestureFired = false;
        fourGestureStartTime = null;
        fourGestureFired = false;
        fiveGestureStartTime = null;
        fiveGestureFired = false;
        pinkyGestureStartTime = null;
        pinkyGestureFired = false;
        pinkyRingGestureStartTime = null;
        pinkyRingGestureFired = false;
        pinkyRingMiddleGestureStartTime = null;
        pinkyRingMiddleGestureFired = false;
        if (selectTextElement) selectTextElement.style.opacity = "0";
        gestureText.classList.remove("visible");
      }
    }

    // Hand movement for axis value control: up = increase, down = decrease
    if (
      lastLandmarks.length > 0 &&
      isObjectSelected?.() &&
      isSingleAxisSelected?.() &&
      onHandPositionChange
    ) {
      const handY = lastLandmarks[0][WRIST].y;
      if (lastHandY !== null) {
        const deltaY = lastHandY - handY; // positive = hand moved up
        if (Math.abs(deltaY) > 0.005) {
          onHandPositionChange(deltaY);
        }
      }
      lastHandY = handY;
    } else {
      lastHandY = null;
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
