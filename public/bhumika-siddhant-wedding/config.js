/* written by tools/bhumika-siddhant-wedding.mjs — edit the tool, not this file.
   Bhumika & Siddhant, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'bhumika-siddhant-wedding',
  /* the song of the design the client chose; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* no map link was supplied: a Google Maps search for the venue's name and address, exactly as on the card */
  venues: {
    "venue": {
      "name": "Vedanta Farm",
      "address": "Vedanta Farm (Jashn – The Roman Palace), 27 Km Stone, Delhi-Hapur Bypass Road, NH-24, Near AKG College, Adhyatmik Nagar, Ghaziabad, U.P. – 201009.",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Vedanta%20Farm%2C%20Jashn%20The%20Roman%20Palace%2C%20Delhi-Hapur%20Bypass%20Road%2C%20NH-24%2C%20Near%20AKG%20College%2C%20Adhyatmik%20Nagar%2C%20Ghaziabad%2C%20Uttar%20Pradesh%20201009"
    }
  },
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
