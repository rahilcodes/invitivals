/* written by tools/lokesh-akansha-wedding.mjs — edit the tool, not this file.
   Lokesh & Akansha, the wedding (groom side). The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: 'lokesh-akansha-wedding',
  /* the family's song, once they send it (e.g. 'assets/media/music.mp3'); null = no music and no music button */
  music: 'assets/media/music.mp3',   // Jashn-e-Bahaaraa, the family's song (client, 2026-11-04), on both pages
  /* the venue links exactly as the family supplied them; a venue without a link shows its button greyed out */
  venues: {
    "palm": {
      "name": "Palm Luxuria Banquets",
      "address": "Bal Vikas Progressive School Road, Shodapur, Panipat",
      "mapsUrl": "https://share.google/MfaBFtqryZA8yG071"
    },
    "cosmos": {
      "name": "COSMOS Cafe & Lounge",
      "address": "Sector 25, Panipat, Haryana",
      "mapsUrl": "https://share.google/pOU3fFbjNnsn068Wq"
    }
  },
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
