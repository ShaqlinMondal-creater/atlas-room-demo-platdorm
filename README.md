# Atlas Room

Template showcase. Unlock a sample with a code, open it in a new tab, and keep access for 15 minutes.

## Run

```bash
npm install
npm run dev
```

## Project settings

Edit [`src/config/constants.js`](src/config/constants.js):

- `APP` — name, mark, headlines, footer
- `ACCESS` — token minutes and storage key
- `API` — future backend URL / mock switch

## Templates

| Code | Sample | Status |
| --- | --- | --- |
| `CARRD0011` | QuickLoan Demo | Live |
| `FORM2201` | Pulse Intake | Coming soon |
| `SHOP3301` | Marketfold | Coming soon |

Live fake data: `public/templates/CARRD0011/demo-config.js`  
Thumbnails: `public/thumbnails/`

## Add another template

1. Copy `public/templates/CARRD0011` → `public/templates/YOURCODE`
2. Give that folder its own colours, fonts, and config
3. Keep `/access-gate.js` in the HTML head
4. Register it in `src/data/templates.js`
"# atlas-room-demo-platdorm" 
