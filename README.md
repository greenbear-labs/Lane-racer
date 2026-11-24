# Lane Racer

A cheerful 2D lane racing game for toddlers, built to be played on an iPad as an installable web app (PWA).

- **Title screen**: a demo race plays behind a big green play button. Tap anywhere to start.
- **Pick a car**: five original race cars (Zoomer, Bolt, Sunny, Leafy, Rocket).
- **Pick a place**: Speedway, Muddy Trail (dirt road where mud puddles splat the screen), Snowy Peaks (falling snow, snowmen, ice) or Sunny Beach (palms, sea, crabs and beach balls). Each has its own scenery, obstacles and music key.
- **Drive**: tap the left or right side of the screen (or swipe) to change lanes. Arrow keys work on a computer.
- **Collect coins**: 20 coins fills the bar and wins a trophy, with confetti and a fanfare.
- **Power-ups**: star (rainbow car that smashes through anything), lightning (speed boost), bubble (blocks the next bump), magnet (pulls coins in).
- **No losing**: hitting a cone, crate, tyres, rock or barrier gives a gentle bump and a wobble, then you keep driving. Puddles, ice and mud just slow you a little; mud also splats brown blobs across the screen that drip away.
- House button returns to the title screen; speaker button turns sound and music on or off.

## Hosting

It is a plain static site with no build step: serve the repository root as-is. Every path is relative, so it works at a subdomain root or under any subpath (for example `arcade.greenbearlabs.com/lane-racer/`). HTTPS is required for offline support.

To install on an iPad: open the URL in Safari, tap Share, then **Add to Home Screen**. It then launches full screen and works offline.

## Updating

`sw.js` caches every file for offline play. When you change any file, bump `VERSION` in `sw.js` so installed copies fetch the new version, and add any new files to its `FILES` list.

## Running locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
