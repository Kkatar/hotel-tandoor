# Hotel Tandoor Corner — website

One long-scroll page for Hotel Tandoor Corner, Kolhapur–Radhanagari Road.
English and Marathi, switchable from the top bar. Plain HTML, CSS and JavaScript: there is no build step.

## Run it

```
cd tandoor-corner
python3 -m http.server 8000
```

Open http://localhost:8000. Add `?lang=mr` or `?lang=en` to force a language.
Opening `index.html` by double-click also works, but a local server is closer to the real thing.

## Live site

- Site: https://hotel-tandoor-corner.vercel.app
- Code: https://github.com/Kkatar/hotel-tandoor
- Hosting: Vercel, project `hotel-tandoor-corner`, connected to this repository.
  There is nothing to build: Vercel serves the files exactly as they are here.
- This README is left out of the published site (see `.vercelignore`).

If the site moves to its own domain, replace `hotel-tandoor-corner.vercel.app` in the three lines
near the top of `index.html` (`canonical`, `og:url`, `og:image`), so shared links keep their preview picture.

## Still to do

Already confirmed by the owner: open 11:30 AM to 11 PM every day, and the Zomato ordering link.

| What | Where | Why |
|---|---|---|
| Price ranges | `index.html`, search `data-count` | Approximate ranges, shown as a guide only. |
| Photos | `assets/img/` | Every food photo is an AI-made stand-in: the eight menu cards, the thali pieces, the opening plate, the two rassa bowls and the full table. Replace them with photos of your own dishes. The rooms photo is the one you supplied. The dining hall photo (`family/2.webp`) is a real photo of your hall taken from your hotel's Trip.com listing; confirm it is your own photo. |

## Change the hours, phone number or links

Everything is at the top of `js/content.js`:

```js
hours: { open: '11:30', close: '23:00' },   // 24-hour clock
phone: '+917722035401',
phoneDisplay: '077220 35401',
links: { directions: '…', zomato: '…', facebook: '…' }
```

The "Open now" badge, the hero status, the Hours section, every phone button and every
Zomato / Facebook / Directions button read from here. A closing time after midnight works too (`'00:30'`).

## Change the text

- English: written directly in `index.html`. Search for the words and edit them.
- Marathi: in `js/content.js`, in the `mr` list. Each line is matched to the page by its key
  (the `data-i18n="…"` name next to the English text).
- The moving bands of dish names and the open/closed sentences are in `js/content.js` under `dyn`, in both languages.
- The address appears in `index.html` (English), in `mr` → `visit.addr` (Marathi) and in `config.address` (used by search engines).

## Replace the photos

Save the new photo under the same file name and the page picks it up. WebP is best; keep the same shape.

| File (in `assets/img/`) | Size | Shows |
|---|---|---|
| `hero/dish.webp` | 656 × 656, transparent background, shot from directly above | The plate in the first screen |
| `hero/dish-shadow.webp` | soft shadow of the plate | Leave as is if the new plate is round |
| `build/plate.webp`, `bhakri`, `tambda`, `pandhara`, `sukka`, `rice`, `kanda`, `tandoori` (+ `-shadow`) | transparent cut-outs from above | The thali that builds itself |
| `build/thali-full.webp` | 720 × 720 | Finished thali (small round stamp by the map) |
| `gallery/01-tambda-rassa.webp` … `08-kolhapuri-thali.webp` | 800 × 1000 (portrait) | Menu cards: tambda rassa, chicken tandoori, pandhara rassa, paneer tikka, butter chicken, fish fry (`06-seafood.webp`), biryani, Kolhapuri thali. All eight are AI stand-ins |
| `about/1.webp`, `about/2.webp` | 800 × 1000, 1200 × 800 | The two photos beside the "definition" card |
| `duo/tambda.webp`, `duo/pandhara.webp` | 1600 × 900 | Red rassa / white rassa wipe. Shoot both from the same angle so the bowls line up |
| `family/1.webp` | 1200 × 900 | Large polaroid |
| `family/2.webp` | 800 × 600 | Small polaroid: your dining hall (real photo, from your hotel's Trip.com listing) |
| `family/3.webp` | 800 × 600 | Small polaroid: the rooms photo you supplied |
| `sprites/*.webp` | transparent cut-outs | Floating chillies, lemon, garlic and so on |
| `og.jpg` | 1200 × 630 | Preview when the link is shared on WhatsApp or Facebook |

Real photos of the dining hall, the entrance and a full table will do more for the page than anything else.

## What is in the folder

```
index.html          all sections, English text
css/main.css        colours, type and layout (colours are the variables at the top)
js/content.js       hours, phone, links, Marathi text
js/app.js           animations, language switch, live open/closed status, clock, map
js/map-data.js      street outlines around the restaurant
vendor/             GSAP, ScrollTrigger and Lenis (smooth scrolling)
assets/fonts/       fonts, hosted with the site
assets/img/         photos
```

## Good to know

- People who switch on "reduce motion" on their phone, and browsers without JavaScript, get a calm page with the same content.
- The time on the clock and the open/closed status always follow Kolhapur time, wherever the visitor is.
- The map is drawn from OpenStreetMap data. The credit "© OpenStreetMap contributors" on the map and in the footer must stay.
- Fonts (Anton, Archivo, Barlow Condensed, Source Sans 3, Tillana, Anek Devanagari) are under the SIL Open Font License. GSAP is used under its standard no-charge licence, Lenis under MIT.
