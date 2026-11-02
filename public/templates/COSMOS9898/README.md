# Universe Cosmos (`COSMOS9898`)

Scroll-driven space showcase built with **vanilla JS + three.js**.  
Access code in Atlas Room: **`COSMOS9898`**.

## Scenes

| Scene | What you see |
|-------|----------------|
| 1 · Starfield + title | Opening HUD, drifting stars |
| 2 · Sun + planets | Glowing sun, coloured worlds on orbits |
| 3 · Nebula | Soft additive particle cloud |
| 4 · Galaxy | Spiral of particles |
| Finale | Overview · Credits · Contact |

## How to preview (Atlas Room)

1. Run the Atlas Room app: `npm run dev`
2. Open **Universe Cosmos** and enter code `COSMOS9898`
3. Or open directly while developing:  
   `http://127.0.0.1:5173/templates/COSMOS9898/index.html?desk=1`

## How to change story text

Edit `src/config.js` — titles, ledes, scroll stops, and particle counts live there.

## Controls

- **Scroll** moves the camera along the voyage path.
- **Sound off / Sound on** (top-right) starts a soft Web Audio drone. Default is **off** (browser autoplay rules).
- Gentle pointer parallax on the camera (disabled when `prefers-reduced-motion` is set).

## Performance notes

- Stars / nebula / galaxy use `THREE.Points` (cheap on GPU).
- Pixel ratio is capped at **2**.
- Mobile uses fewer particles and lower sphere segments.
- `prefers-reduced-motion` slows orbits, turns off twinkle / parallax, and uses fewer points.
- Scene modules expose `dispose()` for geometries and materials.
- If WebGL is missing, a plain HTML fallback is shown.

## Optional: local Vite build

This template uses an import map + CDN for `three` so it works as static files.  
A local Vite + npm `three` build can replace the CDN when you finalize hosting.
