# Mohammed Navas & Dharshinisha: the opening film with the ND seal

The same method as `tools/dr-mohammed-nihal-nooha-film` (read its README for the details): the design pack's film
(`public/modern-wedding/assets/opening.mp4`, read only) carries another couple's letters on its wax seal, so the
film is rebuilt with the couple's ND monogram painted into the seal's face in every frame it is seen (frames 0–83):
`public/mohammed-navas-dharshinisha-wedding/assets/opening-nd.mp4` and its first frame `opening-nd.webp`.

1. `node tools/mohammed-navas-dharshinisha-wedding.mjs` first (it writes `assets/nd-gold.webp`, which is pressed in)
2. in a scratch folder: `ffmpeg -i opening.mp4 -t 3.6 f/%03d.png`, then `node track.cjs 84` (the track depends only
   on the film, so a `track.json` made for the Nihal & Nooha film can be reused as it is)
3. `ASSETS=<…>/public/mohammed-navas-dharshinisha-wedding/assets NODE_PATH=<project>/node_modules node render.cjs 83`
   → `o/%03d.png`
4. encode exactly as in the Nihal & Nooha README (step 4) to `opening-nd.mp4`; the poster is `o/001.png` as WebP
   (quality 88).

Do not pipe the scripts' output through `head`: they stop when the pipe closes and leave old frames behind.
