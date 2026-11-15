/* written by tools/shashidar-vedhashree-wedding.mjs — edit the tool, not this file.
   Shashidar Reddy & Vedhashree, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'shashidar-vedhashree-wedding',
  /* the family's song, "Kalyanam Vybhogam" (client, 2026-11-15); null = no music and no music button */
  music: 'assets/media/kalyanam-vybhogam.mp3',
  /* the map links exactly as the family supplied them */
  venues: {
    "pellikoduku": {
      "name": "Pellikoduku",
      "mapsUrl": "https://maps.app.goo.gl/YChWv6wywWbBsaX59?g_st=aw"
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
