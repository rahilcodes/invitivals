/* written by tools/shashidar-vedhashree-wedding.mjs — edit the tool, not this file.
   Shashidar Reddy & Vedhashree, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'shashidar-vedhashree-wedding',
  /* the song; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the map links exactly as the family supplied them */
  venues: {
    "pellikoduku": {
      "name": "Pellikoduku",
      "mapsUrl": "https://maps.app.goo.gl/CNe2pkKXkZi5uaKR9?g_st=ac"
    },
    "wedding": {
      "name": "S.N.R. Convention",
      "address": "Pillar No. 122, Attapur, Ring Road, Hyderabad.",
      "mapsUrl": "https://share.google/KiSOigmUouCuVlQQr"
    }
  },
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
