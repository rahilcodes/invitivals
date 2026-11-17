# Dr. Mohammed Nihal & Nooha: the opening film with the NN seal

The design pack's film (`public/modern-wedding/assets/opening.mp4`, read only) has another couple's letters on its
wax seal until the flap carries the seal out of the picture (about 3.4 s). An overlay could not follow the seal as it
cracks, tilts and lifts, so the film itself is rebuilt: `public/dr-mohammed-nihal-nooha/assets/opening-nn.mp4` and its
first frame `opening-nn.webp`.

Work in a scratch folder with ffmpeg (`npm i ffmpeg-static` there):

1. copy `track.cjs` and `render.cjs` into it (they need `sharp`, so run them with the project's node_modules in reach);
   `ffmpeg -i opening.mp4 -t 3.6 f/%03d.png`
2. `node track.cjs 84` tracks the seal's face against frame 0 (six affine numbers per frame, `track.json`)
3. `node render.cjs 83` empties the lettered face of frame 0, presses the family's `nn-gold.webp` in, and paints that
   face into frames 0–83 along the track: lit like the frame's own wax, never over what stands in front of the face
   (the butterfly) or has broken out of it → `o/%03d.png`
4. encode: the 84 painted frames, then the untouched rest of the film, with the film's own sound:
   `ffmpeg -framerate 24 -start_number 1 -i o/%03d.png -i opening.mp4 -filter_complex "[0:v]format=yuv420p,setsar=1[a];[1:v]trim=start_frame=84,setpts=PTS-STARTPTS,format=yuv420p,setsar=1[b];[a][b]concat=n=2:v=1[v]" -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p -colorspace smpte170m -color_primaries bt709 -color_trc iec61966-2-1 -r 24 -c:a copy -movflags +faststart opening-nn.mp4`
5. the poster is `o/001.png` as WebP (quality 88).

Do not pipe the scripts' output through `head`: they stop when the pipe closes and leave old frames behind.
