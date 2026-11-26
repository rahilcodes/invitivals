/* written by tools/archika-sandeep.mjs — edit the tool, not this file.
   Archika & Sandeep — Wedding Celebrations. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'archika-sandeep-wedding-celebrations',
  /* the song of the design the client chose; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the family's own link for the venue, exactly as supplied */
  venues: {
    "venue": {
      "name": "Hotel Mukut Regency",
      "address": "Vasundhra Sector 13, Ghaziabad",
      "mapsUrl": "https://www.google.com/travel/hotels/s/8nWmmRPHJeWCmbm36"
    }
  },
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
