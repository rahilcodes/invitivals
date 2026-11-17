# Maham Azeem & Nasir Hussain: the opening film with the M N seal

The design pack's envelope film (`public/modern-wedding/assets/opening.mp4`, read only) is lettered for another
couple and graded mauve. For this invitation it is rebuilt as
`public/maham-azeem-nasir-hussain-nikah/assets/opening-mn.mp4` (poster `opening-mn.webp` = its first frame):

- the client's M N (the two letters of their monogram, `invites/src/maham-azeem-nasir-hussain-nikah/seal-mn.png`,
  written by `tools/maham-azeem-nasir-hussain-nikah.mjs`) is painted into the wax seal of frames 0-83, following the
  seal as it cracks, tilts and lifts with the flap (same track as the Nihal & Nooha film: `track.cjs`);
- the whole film is graded from mauve to champagne and ivory at encode time.

In a scratch folder with ffmpeg (`npm i ffmpeg-static`) and `sharp` in reach (NODE_PATH = the project's node_modules):

1. copy `track.cjs` and `render.cjs` into it; `ffmpeg -i opening.mp4 -t 3.6 f/%03d.png`
2. `node track.cjs 84` -> `track.json`
3. `node render.cjs 83 <path to seal-mn.png>` -> `o/%03d.png`
4. encode (G = `colorchannelmixer=rr=1.0:rg=0.04:rb=0:gr=0.14:gg=0.9:gb=0:br=0:bg=0.9:bb=-0.02`):
   `ffmpeg -framerate 24 -start_number 1 -i o/%03d.png -i opening.mp4 -filter_complex "[0:v]format=gbrp,G,format=yuv420p,setsar=1[a];[1:v]trim=start_frame=84,setpts=PTS-STARTPTS,format=gbrp,G,format=yuv420p,setsar=1[b];[a][b]concat=n=2:v=1[v]" -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p -colorspace smpte170m -color_primaries bt709 -color_trc iec61966-2-1 -r 24 -c:a copy -movflags +faststart opening-mn.mp4`
5. poster: the film's first frame as WebP (quality 88).

Do not pipe the scripts' output through `head`: they stop when the pipe closes and leave old frames behind.
