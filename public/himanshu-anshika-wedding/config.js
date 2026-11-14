/* written by tools/himanshu-anshika-wedding.mjs — edit the tool, not this file.
   Himanshu & Anshika, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'himanshu-anshika-wedding',
  /* the song; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the venue link exactly as the family supplied it */
  venues: {
    "utsav": {
      "name": "Utsav Green Farm",
      "address": "Baldev Vihar Colony, Shaheed Bhagat Singh Nagar, Karala, Delhi – 110081.",
      "mapsUrl": "https://maps.app.goo.gl/kNHvEiNqpcpL9mu49"
    }
  },
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
