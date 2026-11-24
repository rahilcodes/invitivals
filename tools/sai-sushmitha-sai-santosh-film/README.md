# Sai Sushmitha & Sai Santosh: the opening film with the SS seal

The same method as `tools/dr-mohammed-nihal-nooha-film` and `tools/mohammed-navas-dharshinisha-film` (read the Nihal
README for the details). The design pack's film (`public/modern-wedding/assets/opening.mp4`, read only) has another
couple's letters on its wax seal. This rebuild paints the client's SS crest into the seal's face in every frame where
the seal is seen (frames 0–83). It writes `public/sai-sushmitha-sai-santosh-engagement/assets/opening-ss.mp4` and its
first frame, `opening-ss.webp`.

1. Run `node tools/sai-sushmitha-sai-santosh-engagement.mjs` first. It writes `assets/ss-gold.webp`, which is pressed
   into the seal at 112 px tall.
2. In a scratch folder, extract the frames with `ffmpeg -i opening.mp4 -t 3.6 f/%03d.png`, then run `node track.cjs 84`.
   The track depends only on the film, so the Nihal or Navas `track.json` can be reused as it is.
3. Render the frames to `o/%03d.png`:
   `ASSETS=<…>/public/sai-sushmitha-sai-santosh-engagement/assets NODE_PATH=<project>/node_modules node render.cjs 83`
4. Encode exactly as in the Nihal README (step 4) to `opening-ss.mp4`. The poster is `o/001.png` saved as WebP
   (quality 88).

Do not pipe the scripts' output through `head`: they stop when the pipe closes and leave old frames behind.
