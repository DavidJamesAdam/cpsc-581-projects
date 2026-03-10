# Project 2 — Hand Gesture CAD System Controls

A CAD system controlled by hand gestures using MediaPipe Hand Landmarker. Point your hand at the camera and hold gestures for 1 second to trigger actions.

## How to Run

1. **Install dependencies**
   ```bash
   cd Project2
   npm install
   ```

2. **Start the dev server**
   ```bash
   npx vite
   ```

3. **Open in browser**  
   Use the URL shown in the terminal (e.g. `http://localhost:5173`).

4. **Requirements**
   - Webcam access (allow when prompted)
   - HTTPS or localhost (camera works over localhost)
   - Works best in macOS, for Windows please see Tips section below
   - Good lighting helps gesture detection

---

## CAD System Input Methods

1. MOUSE/CLICK
   - Left-click on object: select
   - Left-click on empty space: deselect

2. KEYBOARD
   - W : Switch to Translate (move) mode
   - E : Switch to Rotate mode
   - R : Switch to Scale mode

3. MOUSE DRAG (TransformControls)
   - When object selected: drag colored gizmos to translate, rotate, or scale
   - Arrows for translation; arcs for rotation; cubes for scale

4. MOUSE (OrbitControls)
   - Orbit: rotate camera around scene
   - Pan and zoom enabled with damping
---

## Gestures

All gestures must be held for **1 second** to trigger. The preview shows how long to hold (e.g. `one - hold 1s`).

### Object selection / recording

| Gesture | Description | Action |
|---------|-------------|--------|
| **One finger** | Index finger extended, other fingers closed, thumb closed | **Select** — Select object |
| **Two fingers** | Index + middle extended, others closed | **Deselect** — Deselect current object |
| **Fist** | All fingers closed (closed fist) | **Start / Stop recording** — Toggle recording |

### Object transforms (only when an object is selected)

| Gesture | Description | Action |
|---------|-------------|--------|
| **Three fingers** | Index, middle, ring extended | **Translate** — Move object |
| **Four fingers** | Index, middle, ring, pinky extended | **Rotate** — Rotate object |
| **Five fingers** | All five fingers extended (open palm) | **Scale** — Resize object |

### Single-axis mode (only when object is selected)

| Gesture | Description | Action |
|---------|-------------|--------|
| **Pinky only** | Pinky extended, others closed | **X axis** — Constrain transform to X |
| **Pinky + ring** | Pinky and ring extended | **Y axis** — Constrain transform to Y |
| **Pinky + ring + middle** | Pinky, ring, middle extended | **Z axis** — Constrain transform to Z |

---

## Tips

- Hold each gesture steady for about 1 second.
- The camera preview is in the top-left corner.
- On **macOS**, the app uses `loadeddata` for camera init; on **Windows (Chrome/Edge)** the video init logic can be switched in `handDetection.js` (see comments around line 457).
