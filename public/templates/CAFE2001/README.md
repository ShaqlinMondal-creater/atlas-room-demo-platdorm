# Harbour Bean (`CAFE2001`)

Four-page café brochure site — Home, About, Menu, Contact.

Frontend only: no booking, payments, login, or cart.

## Access code

**`CAFE2001`**

## Edit business details

Change **`config.js`** for:

- Name, tagline, about copy
- Phone, WhatsApp number, email
- Address, hours, map embed
- Menu items / prices
- Gallery image paths
- Social links

Replace photos in **`assets/`** (keep filenames, or update paths in `config.js`).

## Pages

| Page | Role |
|------|------|
| `index.html` | Full-bleed hero, story, gallery, WhatsApp CTA |
| `about.html` | Story + values |
| `menu.html` | Sticky category tabs + priced list |
| `contact.html` | Visit details, validated note form → WhatsApp, map |

## Preview

```bash
npm run dev
```

Open with code `CAFE2001`, or:

`http://127.0.0.1:5173/templates/CAFE2001/index.html?desk=1`

Internal links keep `?desk=1` / `?token=` so pages stay unlocked in desk/token preview.

## Client handoff checklist

- [ ] Swap photos for the café’s own
- [ ] Set real WhatsApp, phone, email, address, map embed in `config.js`
- [ ] Confirm menu prices and allergen wording
- [ ] Test mobile nav, WhatsApp links, contact form → WhatsApp
- [ ] Host on HTTPS (domain / hosting outside this template)

## Verified (frontend)

- [x] Real photo assets + favicon / OG image
- [x] Brand-first hero, type system, spacing tokens
- [x] Content without demo/placeholder language
- [x] Sticky menu tabs, form validation, focus-trap mobile nav
- [x] Lazy-loaded gallery / map; hero preload
- [x] No booking / payment / login
