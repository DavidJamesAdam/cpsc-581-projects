/**
 * Hand detection overlay with MediaPipe Hand Landmarker.
 * Optimized for Windows Chrome/Edge: flexible camera constraints, frame-based
 * detection (no video.currentTime dependency), relaxed gesture thresholds.
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

const TOUCH_THRESHOLD = 0.06;
const EXTENDED_RATIO = 1.1;
const CLOSED_RATIO = 1.15;

const dist = (a, b) =>
  Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

function isThumbClosed(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  const wrist = landmarks[WRIST];
  const thumbTip = landmarks[THUMB_TIP];
  for (let i = 0; i < landmarks.length; i++) {
    if (i === THUMB_TIP) continue;
    if (dist(thumbTip, landmarks[i]) < TOUCH_THRESHOLD) return true;
  }
  // Fallback: thumb is closed if tip is closer to wrist than thumb IP (folded toward palm)
  return dist(thumbTip, wrist) <= dist(landmarks[THUMB_IP], wrist) * CLOSED_RATIO;
}

function isOneGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexExtended = dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * EXTENDED_RATIO;
  const middleClosed = dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * CLOSED_RATIO;
  const ringClosed = dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * CLOSED_RATIO;
  const pinkyClosed = dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * CLOSED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexExtended && middleClosed && ringClosed && pinkyClosed && thumbClosed;
}

function isTwoGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexExtended = dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * EXTENDED_RATIO;
  const middleExtended = dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * EXTENDED_RATIO;
  const ringClosed = dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * CLOSED_RATIO;
  const pinkyClosed = dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * CLOSED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexExtended && middleExtended && ringClosed && pinkyClosed && thumbClosed;
}

function isThreeGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexExtended = dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * EXTENDED_RATIO;
  const middleExtended = dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * EXTENDED_RATIO;
  const ringExtended = dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * EXTENDED_RATIO;
  const pinkyClosed = dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * CLOSED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexExtended && middleExtended && ringExtended && pinkyClosed && thumbClosed;
}

function isFourGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexExtended = dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * EXTENDED_RATIO;
  const middleExtended = dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * EXTENDED_RATIO;
  const ringExtended = dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * EXTENDED_RATIO;
  const pinkyExtended = dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * EXTENDED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexExtended && middleExtended && ringExtended && pinkyExtended && thumbClosed;
}

function isFiveGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexExtended = dist(landmarks[INDEX_TIP], wrist) > dist(landmarks[INDEX_PIP], wrist) * EXTENDED_RATIO;
  const middleExtended = dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * EXTENDED_RATIO;
  const ringExtended = dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * EXTENDED_RATIO;
  const pinkyExtended = dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * EXTENDED_RATIO;
  const thumbExtended = !isThumbClosed(landmarks);
  return indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended;
}

function isPinkyRingGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexClosed = dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * CLOSED_RATIO;
  const middleClosed = dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * CLOSED_RATIO;
  const ringExtended = dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * EXTENDED_RATIO;
  const pinkyExtended = dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * EXTENDED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexClosed && middleClosed && ringExtended && pinkyExtended && thumbClosed;
}

function isPinkyRingMiddleGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexClosed = dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * CLOSED_RATIO;
  const middleExtended = dist(landmarks[MIDDLE_TIP], wrist) > dist(landmarks[MIDDLE_PIP], wrist) * EXTENDED_RATIO;
  const ringExtended = dist(landmarks[RING_TIP], wrist) > dist(landmarks[RING_PIP], wrist) * EXTENDED_RATIO;
  const pinkyExtended = dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * EXTENDED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexClosed && middleExtended && ringExtended && pinkyExtended && thumbClosed;
}

function isPinkyOnlyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const indexClosed = dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * CLOSED_RATIO;
  const middleClosed = dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * CLOSED_RATIO;
  const ringClosed = dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * CLOSED_RATIO;
  const pinkyExtended = dist(landmarks[PINKY_TIP], wrist) > dist(landmarks[PINKY_PIP], wrist) * EXTENDED_RATIO;
  const thumbClosed = isThumbClosed(landmarks);
  return indexClosed && middleClosed && ringClosed && pinkyExtended && thumbClosed;
}

function isAllFingersClosed(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;
  const wrist = landmarks[WRIST];
  const thumbClosed = isThumbClosed(landmarks);
  const indexClosed = dist(landmarks[INDEX_TIP], wrist) <= dist(landmarks[INDEX_PIP], wrist) * CLOSED_RATIO;
  const middleClosed = dist(landmarks[MIDDLE_TIP], wrist) <= dist(landmarks[MIDDLE_PIP], wrist) * CLOSED_RATIO;
  const ringClosed = dist(landmarks[RING_TIP], wrist) <= dist(landmarks[RING_PIP], wrist) * CLOSED_RATIO;
  const pinkyClosed = dist(landmarks[PINKY_TIP], wrist) <= dist(landmarks[PINKY_PIP], wrist) * CLOSED_RATIO;
  return thumbClosed && indexClosed && middleClosed && ringClosed && pinkyClosed;
}

async function getCameraStream() {
  const constraints = [
    { video: { width: { ideal: PREVIEW_WIDTH }, height: { ideal: PREVIEW_HEIGHT }, facingMode: "user" } },
    { video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: "user" } },
    { video: { facingMode: "user" } },
    { video: true },
  ];
  for (const c of constraints) {
    try {
      return await navigator.mediaDevices.getUserMedia(c);
    } catch (_) {
      continue;
    }
  }
  throw new Error("Could not access camera. Please allow camera access and ensure no other app is using it.");
}

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
      <div class="gesture-hint" id="gesture-hint"></div>
      <div class="hand-error" id="hand-error"></div>
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
    .gesture-text.visible { opacity: 1; }
    .gesture-text.stop { color: #f87171; }
    .gesture-hint {
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 10px;
      background: rgba(0,0,0,0.6);
      color: #94a3b8;
      font-family: system-ui, sans-serif;
      font-size: 11px;
      border-radius: 4px;
      pointer-events: none;
    }
    .hand-error {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      padding: 6px;
      background: rgba(220,38,38,0.9);
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 11px;
      border-radius: 4px;
      display: none;
      pointer-events: none;
    }
    .hand-error.visible { display: block; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(container);

  const video = container.querySelector(".hand-preview-video");
  const canvas = container.querySelector(".hand-preview-canvas");
  const ctx = canvas.getContext("2d");
  const gestureText = container.querySelector("#gesture-text");
  const gestureHint = container.querySelector("#gesture-hint");
  const errorEl = container.querySelector("#hand-error");
  const drawingUtils = new DrawingUtils(ctx);

  canvas.width = PREVIEW_WIDTH;
  canvas.height = PREVIEW_HEIGHT;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add("visible");
  }

  function clearError() {
    errorEl.classList.remove("visible");
  }

  let stream;
  try {
    stream = await getCameraStream();
  } catch (e) {
    showError("Camera error: " + (e.message || "Access denied"));
    return;
  }
  video.srcObject = stream;

  let handLandmarker;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
  } catch (e) {
    showError("MediaPipe load failed. Check your internet connection.");
    return;
  }

  clearError();

  let lastLandmarks = [];
  let isRecording = false;
  let twoGestureStartTime = null, twoGestureFired = false;
  let allClosedStartTime = null, allClosedFired = false;
  let oneGestureStartTime = null, oneGestureFired = false;
  let threeGestureStartTime = null, threeGestureFired = false;
  let fourGestureStartTime = null, fourGestureFired = false;
  let fiveGestureStartTime = null, fiveGestureFired = false;
  let pinkyGestureStartTime = null, pinkyGestureFired = false;
  let pinkyRingGestureStartTime = null, pinkyRingGestureFired = false;
  let pinkyRingMiddleGestureStartTime = null, pinkyRingMiddleGestureFired = false;
  let lastHandY = null;

  function resetAllTimers() {
    twoGestureStartTime = null; twoGestureFired = false;
    allClosedStartTime = null; allClosedFired = false;
    oneGestureStartTime = null; oneGestureFired = false;
    threeGestureStartTime = null; threeGestureFired = false;
    fourGestureStartTime = null; fourGestureFired = false;
    fiveGestureStartTime = null; fiveGestureFired = false;
    pinkyGestureStartTime = null; pinkyGestureFired = false;
    pinkyRingGestureStartTime = null; pinkyRingGestureFired = false;
    pinkyRingMiddleGestureStartTime = null; pinkyRingMiddleGestureFired = false;
  }

  function resetOtherTimers(keep) {
    if (keep !== "two") { twoGestureStartTime = null; twoGestureFired = false; }
    if (keep !== "allClosed") { allClosedStartTime = null; allClosedFired = false; }
    if (keep !== "one") { oneGestureStartTime = null; oneGestureFired = false; }
    if (keep !== "three") { threeGestureStartTime = null; threeGestureFired = false; }
    if (keep !== "four") { fourGestureStartTime = null; fourGestureFired = false; }
    if (keep !== "five") { fiveGestureStartTime = null; fiveGestureFired = false; }
    if (keep !== "pinky") { pinkyGestureStartTime = null; pinkyGestureFired = false; }
    if (keep !== "pinkyRing") { pinkyRingGestureStartTime = null; pinkyRingGestureFired = false; }
    if (keep !== "pinkyRingMiddle") { pinkyRingMiddleGestureStartTime = null; pinkyRingMiddleGestureFired = false; }
  }

  function detectLoop() {
    if (video.readyState < 2) {
      requestAnimationFrame(detectLoop);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const now = performance.now() / 1000;
    try {
      const results = handLandmarker.detectForVideo(video, now * 1000);
      lastLandmarks = results.landmarks || [];
    } catch (e) {
      lastLandmarks = [];
    }

    gestureHint.textContent = lastLandmarks.length > 0 ? `hands: ${lastLandmarks.length}` : "";

    const twoGesture = lastLandmarks.length > 0 && lastLandmarks.some(isTwoGesture);
    const allClosed = lastLandmarks.length > 0 && lastLandmarks.some(isAllFingersClosed);
    const oneGesture = lastLandmarks.length > 0 && lastLandmarks.some(isOneGesture);
    const objectSelected = isObjectSelected?.() ?? false;
    const threeGesture = objectSelected && lastLandmarks.some(isThreeGesture);
    const fourGesture = objectSelected && lastLandmarks.some(isFourGesture);
    const fiveGesture = objectSelected && lastLandmarks.some(isFiveGesture);
    const pinkyGesture = objectSelected && lastLandmarks.some(isPinkyOnlyGesture);
    const pinkyRingGesture = objectSelected && lastLandmarks.some(isPinkyRingGesture);
    const pinkyRingMiddleGesture = objectSelected && lastLandmarks.some(isPinkyRingMiddleGesture);

    if (twoGesture) {
      resetOtherTimers("two");
      twoGestureStartTime ??= now;
      if (now - twoGestureStartTime >= 1) {
        gestureHint.textContent = "";
        if (selectTextElement) { selectTextElement.textContent = "deselect"; selectTextElement.style.opacity = "1"; }
        else { gestureText.textContent = "deselect"; gestureText.classList.remove("stop"); gestureText.classList.add("visible"); }
        if (!twoGestureFired && onTwoGestureSelect) { twoGestureFired = true; onTwoGestureSelect(); }
      } else {
        gestureHint.textContent = `two - hold ${Math.ceil(1 - (now - twoGestureStartTime))}s`;
        if (selectTextElement) selectTextElement.style.opacity = "0";
        else gestureText.classList.remove("visible");
      }
    } else if (allClosed) {
      resetOtherTimers("allClosed");
      allClosedStartTime ??= now;
      if (now - allClosedStartTime >= 1) {
        gestureHint.textContent = "";
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
        gestureHint.textContent = `fist - hold ${Math.ceil(1 - (now - allClosedStartTime))}s`;
        gestureText.classList.remove("visible");
      }
    } else if (oneGesture) {
      resetOtherTimers("one");
      oneGestureStartTime ??= now;
      if (now - oneGestureStartTime >= 1) {
        gestureHint.textContent = "";
        if (selectTextElement) { selectTextElement.textContent = "select"; selectTextElement.style.opacity = "1"; }
        else { gestureText.textContent = "select"; gestureText.classList.remove("stop"); gestureText.classList.add("visible"); }
        if (!oneGestureFired && onOneGestureSelect) { oneGestureFired = true; onOneGestureSelect(); }
      } else {
        gestureHint.textContent = `one - hold ${Math.ceil(1 - (now - oneGestureStartTime))}s`;
        if (selectTextElement) selectTextElement.style.opacity = "0";
        else gestureText.classList.remove("visible");
      }
    } else if (threeGesture) {
      resetOtherTimers("three");
      threeGestureStartTime ??= now;
      if (now - threeGestureStartTime >= 1) {
        if (selectTextElement) { selectTextElement.textContent = "translate"; selectTextElement.style.opacity = "1"; }
        if (!threeGestureFired && onThreeGestureSelect) { threeGestureFired = true; onThreeGestureSelect(); }
      } else if (selectTextElement) selectTextElement.style.opacity = "0";
    } else if (fourGesture) {
      resetOtherTimers("four");
      fourGestureStartTime ??= now;
      if (now - fourGestureStartTime >= 1) {
        if (selectTextElement) { selectTextElement.textContent = "rotate"; selectTextElement.style.opacity = "1"; }
        if (!fourGestureFired && onFourGestureSelect) { fourGestureFired = true; onFourGestureSelect(); }
      } else if (selectTextElement) selectTextElement.style.opacity = "0";
    } else if (fiveGesture) {
      resetOtherTimers("five");
      fiveGestureStartTime ??= now;
      if (now - fiveGestureStartTime >= 1) {
        if (selectTextElement) { selectTextElement.textContent = "scale"; selectTextElement.style.opacity = "1"; }
        if (!fiveGestureFired && onFiveGestureSelect) { fiveGestureFired = true; onFiveGestureSelect(); }
      } else if (selectTextElement) selectTextElement.style.opacity = "0";
    } else if (pinkyRingMiddleGesture) {
      resetOtherTimers("pinkyRingMiddle");
      pinkyRingMiddleGestureStartTime ??= now;
      if (now - pinkyRingMiddleGestureStartTime >= 1) {
        if (selectTextElement) { selectTextElement.textContent = "z axis"; selectTextElement.style.opacity = "1"; }
        if (!pinkyRingMiddleGestureFired && onPinkyRingMiddleGestureSelect) { pinkyRingMiddleGestureFired = true; onPinkyRingMiddleGestureSelect(); }
      } else if (selectTextElement) selectTextElement.style.opacity = "0";
    } else if (pinkyRingGesture) {
      resetOtherTimers("pinkyRing");
      pinkyRingGestureStartTime ??= now;
      if (now - pinkyRingGestureStartTime >= 1) {
        if (selectTextElement) { selectTextElement.textContent = "y axis"; selectTextElement.style.opacity = "1"; }
        if (!pinkyRingGestureFired && onPinkyRingGestureSelect) { pinkyRingGestureFired = true; onPinkyRingGestureSelect(); }
      } else if (selectTextElement) selectTextElement.style.opacity = "0";
    } else if (pinkyGesture) {
      resetOtherTimers("pinky");
      pinkyGestureStartTime ??= now;
      if (now - pinkyGestureStartTime >= 1) {
        if (selectTextElement) { selectTextElement.textContent = "x axis"; selectTextElement.style.opacity = "1"; }
        if (!pinkyGestureFired && onPinkyGestureSelect) { pinkyGestureFired = true; onPinkyGestureSelect(); }
      } else if (selectTextElement) selectTextElement.style.opacity = "0";
    } else {
      resetAllTimers();
      if (selectTextElement) selectTextElement.style.opacity = "0";
      gestureText.classList.remove("visible");
    }

    if (lastLandmarks.length > 0 && isObjectSelected?.() && isSingleAxisSelected?.() && onHandPositionChange) {
      const handY = lastLandmarks[0][WRIST].y;
      if (lastHandY !== null && Math.abs(lastHandY - handY) > 0.005) {
        onHandPositionChange(lastHandY - handY);
      }
      lastHandY = handY;
    } else lastHandY = null;

    for (const landmarks of lastLandmarks) {
      drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#00ff00", lineWidth: 2 });
      drawingUtils.drawLandmarks(landmarks, { color: "#00ff00", lineWidth: 1, radius: 3 });
    }

    requestAnimationFrame(detectLoop);
  }

  video.addEventListener("loadeddata", detectLoop);
}
