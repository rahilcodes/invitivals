/* written by tools/shweta-varun-wedding.mjs — edit the tool, not this file.
   Shweta & Varun, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'shweta-varun-wedding',
  /* the song; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the venue links exactly as the family supplied them */
  venues: {
    "hotel": {
      "name": "Peninsula Grand Hotel",
      "address": "Peninsula Grand Hotel, Concorde Ball Room, 6th Floor, 90 Feet Road, Sakinaka, Opposite Sakinaka Metro Station, Mumbai, Maharashtra",
      "mapsUrl": "https://share.google/7ZrttUvmxz9kOpCak"
    }
  },
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
