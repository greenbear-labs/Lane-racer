# Lane Racer

A cheerful 2D lane racing game for toddlers, built to be played on an iPad as an installable web app (PWA).

- **Title screen**: a demo race plays behind a big green play button. Tap anywhere to start.
- **Pick a car**: five race cars to start (Zoomer, Bolt, Sunny, Leafy, Rocket), plus six to unlock: Police (30 coins), Ambulance (40), Fire Truck (60), Ice Cream truck (80), School Bus (100) and Monster truck (150). Tap a car to hear it: honks, sirens with flashing lights, an ice cream jingle or a monster truck vroom. Tapping your own car while racing does the same.
- **Pick a place**: Speedway, Muddy Trail (dirt road where mud puddles splat the screen), Snowy Peaks (falling snow, snowmen, ice) or Sunny Beach (palms, sea, crabs and beach balls). Unlock Busy City (40), Desert Jumps (60), Jungle Jumps (90) and Moon Jumps (120, extra floaty). The jump places have ramps that launch the car over whatever is in the lane, with coins up in the air. Each place has its own scenery, obstacles and music key.
- **Piggy bank**: coins from a race are saved when you cross the finish line, plus a 10-coin finishing bonus. The total shows on the pickers and the finish screen. Tap a locked card, then the green tick to buy it. Coins and unlocks are saved on the device (localStorage keys `lr-bank` and `lr-owned`).
- **Drive**: tap the left or right side of the screen (or swipe) to change lanes. Or grab the car and drag it anywhere across the road, and a little forward or back; let go and it stays in place across the road and drifts back down to its usual spot. A quick tap on the car honks it. Arrow keys work on a computer.
- **Race to the finish**: each race lasts about a minute. A bar at the top shows your car moving toward the checkered flag. Cross the finish line for confetti, a fanfare and a trophy, then race again, pick a new place, or go home.
- **Power-ups**: star (rainbow-glowing car that smashes through anything), lightning (speed boost), bubble (blocks the next bump), magnet (pulls coins in).
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
