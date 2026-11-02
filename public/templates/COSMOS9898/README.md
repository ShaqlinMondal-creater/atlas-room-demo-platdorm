# Universe Cosmos (`COSMOS9898`)

Scroll-driven space showcase built with **vanilla JS + three.js**.  
Access code in Atlas Room: **`COSMOS9898`**.

## Scene progress

| Scene | Status |
|-------|--------|
| 1 · Starfield + title | **Ready to test** |
| 2 · Sun + planets | Next |
| 3 · Nebula | Planned |
| 4 · Galaxy + Overview / Credits / Contact | Planned |

## How to preview (Atlas Room)

1. Run the Atlas Room app: `npm run dev`
2. Open a template card **Universe Cosmos** and enter code `COSMOS9898`
3. Or open directly while developing:  
   `http://127.0.0.1:5173/templates/COSMOS9898/index.html?desk=1`

## How to change story text

Edit `src/config.js` — titles, ledes, and particle counts live there.

## Notes (Scene 1)

- Stars are `THREE.Points` (cheap on GPU).
- Pixel ratio is capped at **2**.
- Mobile uses fewer stars.
- `prefers-reduced-motion` turns off twinkle / parallax and uses fewer points.
- If WebGL is missing, a plain HTML fallback is shown.

## Later: local Vite build (optional)

Scene 1 uses an import map + CDN for `three` so it works as static files.  
A local Vite + npm `three` build can replace the CDN when we finalize hosting.
