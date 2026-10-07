# Balances

A small password-protected wallet for tracking balances on bank cards and savings jars. It's built with Next.js and can be installed to a phone's home screen.

## Design

The design is inspired by Apple's iOS, especially the Wallet app, home-screen folders and the frosted "liquid glass" look of recent iOS versions. It's built to feel like a native iPhone app rather than a website.

- **Frosted glass everywhere.** Buttons, folders, sheets and widgets use layered background blur and colour saturation, so the colours behind them glow through the way they do on iOS.
- **iOS typography.** Text uses Apple's system font (San Francisco) on Apple devices, falling back to similar fonts elsewhere.
- **Bottom sheets.** Adding an account, moving money or viewing details happens in a sheet that slides up from the bottom, like iOS share sheets and Apple Pay. Swipe it down to close.
- **Spring animations.** Taps make cards and widgets squish and bounce back with a slight overshoot, like the springy motion iOS uses.
- **Wallet-style cards.** Bank cards sit in a 3D cover-flow carousel that you swipe through. Tapping a card sends a shine across it, and each card can be frozen or have its full number revealed, as in Apple Wallet.
- **Home-screen folders.** The main screen shows frosted folders with their contents peeking out. Tapping one opens it, and the next page grows out of the folder in its own colour.
- **Savings widgets.** Savings jars look like iOS home-screen widgets: colour under glass, with a small trend line and a ripple from wherever you tap.
- **Privacy tap.** Tap the total to hide or show all amounts, handy when someone is looking over your shoulder. Your choice is remembered on that device.
- **Feels native on iPhone.** Added to the home screen, it opens full-screen with a black status bar and no browser bars. Layouts respect the notch and home indicator. Everything is sized for an iPhone screen (390 × 844) and scales to fit any window.
- **Reduced motion.** If the phone's *Reduce Motion* setting is on, animations are toned down.

This is a personal project and is not affiliated with or endorsed by Apple. Bank names and card artwork belong to their respective banks.

## Screens

| Route | Screen | File |
| --- | --- | --- |
| `/` | Wallet folders, the home screen | `frosted-folders.html` |
| `/cards` | Bank cards with accounts, balances and transaction history | `trading-cards.html` |
| `/savings` | Savings jars | `savings-jars.html` |

Each screen is a standalone HTML file at the project root, shown full-screen by `app/html-frame.js`.

## Features

- Several accounts per card, each with its own balance and transaction history (money in, money out and opening balance).
- Totals for each card and a grand total across every card.
- Amounts are stored in cents, so balances never pick up rounding errors.
- Deleting an account takes two taps, so a stray tap can't lose its history.
- A password locks every page and API call. Signed-in devices stay signed in for 180 days, and changing the password signs every device out.

## Run locally

Requires Node 22.

```bash
npm install
npm run dev
```

Locally the app runs without a password. Balances are saved to `data/records.json`, which is gitignored.

## Install on iPhone

Open the deployed site in Safari, tap **Share**, then **Add to Home Screen**. It then opens full-screen like a regular app.

## Deploy

Set these environment variables on the host:

| Variable | Purpose |
| --- | --- |
| `APP_PASSWORD` | Required in production. Every page and API call is locked behind it. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional. Store records in Upstash Redis (on Vercel, `KV_REST_API_*` also works). |

On Netlify, records go to Netlify Blobs automatically, so no storage variables are needed. On any other host, set the Redis variables or saving will be refused.
