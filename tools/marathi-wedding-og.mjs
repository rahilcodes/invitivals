/* og.jpg for public/marathi-wedding: the names band of the English hero, from a headless shoot.
 *   node --experimental-websocket tools/marathi-wedding-og.mjs <page-1 capture.png>
 * (the capture is the hero page clipped at phone width from the QC shoot; width 780) */
import sharp from 'sharp';
const [src] = process.argv.slice(2);
const m = await sharp(src).metadata();
const k = m.width / 941;
await sharp(src).extract({ left: 0, top: Math.round(300 * k), width: m.width, height: Math.round(494 * k) }).resize(1200, 630).jpeg({ quality: 85 }).toFile('public/marathi-wedding/assets/og.jpg');
console.log('wrote public/marathi-wedding/assets/og.jpg');
