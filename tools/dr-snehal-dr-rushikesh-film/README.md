# Dr. Snehal & Dr. Rushikesh: the opening film and still with the SR seal

The design's film has a wax seal lettered "CL"; this page's copy has the couple's SR monogram embossed on the seal
in the film's own pixels, so it cracks and flies apart with the seal (no overlay, no burst of light over the break).

- `sr-monogram.html` → `sr-monogram.png`: the monogram's shape (Marcellus, S above left, R below right), white on
  black, rendered with headless Chrome at 1200 × 630 and cropped to the left 600 × 600.
- `film.cjs <scratch> 82`: needs the film's first four seconds as `<scratch>/f/001.png …`
  (`ffmpeg -i opening.mp4 -t 4 f/%03d.png`, the film being public/ikon-celebration-wedding/assets/opening.mp4).
  Writes `<scratch>/o/001.png … 083.png`. How it works is described at the top of the file.
- encode (83 painted frames, then the untouched rest, the film's own sound):
  `ffmpeg -framerate 24 -start_number 1 -i o/%03d.png -i opening.mp4 -filter_complex "[0:v]format=yuv420p,setsar=1[a];[1:v]trim=start_frame=83,setpts=PTS-STARTPTS,format=yuv420p,setsar=1[b];[a][b]concat=n=2:v=1[v]" -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p -colorspace smpte170m -color_primaries bt709 -color_trc iec61966-2-1 -r 24 -c:a copy -movflags +faststart opening-sr.mp4`
- `poster.cjs`: the same monogram embossed on the "Tap to Open" still → `assets/opening-sr.webp`.

ffmpeg: `npm i ffmpeg-static` in a scratch folder. Never pipe the scripts through `head` (they stop with the pipe).
