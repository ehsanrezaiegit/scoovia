# SCOOVIA — Flavor Studio

Persian setup and GitHub instructions: [START-HERE-FA.md](START-HERE-FA.md).

## Run locally

Use Node.js 22 or newer. From this folder, run `npm run dev`, then open
`http://127.0.0.1:3000` (English: `http://127.0.0.1:3000/?lang=en`).
Stop with Ctrl+C. To choose another port: `npm run dev -- 3001`.
No dependency installation or build is required. Serve the `dist/` directory
when deploying to a static host; opening the HTML through `file://` will not
load JavaScript modules correctly.

This portable source export adds a local server and setup documentation. It is based on
published version 0.3.0, with two localization corrections documented in
[docs/AUDIT-FA.md](docs/AUDIT-FA.md). Images and fonts are unchanged. It excludes
the original hosting account configuration and Git history. Source revision
and file hashes are recorded in `EXPORT-INFO.json` and `SHA256SUMS.txt`.

Bilingual Persian/English concept storefront, version 0.3.2 (Windows local-server fix). A deliberately lightweight, dependency-free website using semantic HTML, native dialogs, CSS animation and JavaScript modules. Product pricing, recipes and allergen information are illustrative. Checkout, delivery and payments are not enabled.

## Features

- Complete Persian/English language switching, RTL/LTR layouts, saved language preference and `?lang=en` / `?lang=fa` links.
- Responsive product gallery with six flavors, filters and product details.
- Live builder for one to three scoops, cone or cup, sauce, topping and custom name.
- Surprise combinations, immediate sample pricing, local persistence and cart quantity controls.
- 1080×1920 PNG recipe-card download with self-hosted typography and product artwork.
- Keyboard operation, native modal focus containment, Persian labels and reduced-motion support.
- Self-hosted Vazirmatn fonts with OFL license, custom vector logo and generated product imagery.

## Files and verification

`dist/` is the publishable static website. `npm run check` checks JavaScript syntax. `npm test` verifies pricing, persistence validation, cart merging and name escaping. No installation or build is required.

The native deployment screenshot of version 01 was inspected at 1200×750. Browser interaction and mobile screenshot QA have not been run: the required control-browser skill is unavailable in this managed environment. Domain tests and static checks do not establish real-device layout or performance.

## Asset provenance

`dist/assets/hero.webp` and `dist/assets/scoops.webp` were created with the built-in image generation tool, then transcoded to WebP. Brief: premium transparent three-scoop pistachio/blueberry/vanilla cone and a 3×2 uniform scoop atlas (pistachio, blueberry, strawberry, vanilla, chocolate, mango). `logo.svg` is original code-native vector artwork. The name is provisional; trademark and domain availability were not checked.

## Next production decisions

Confirm brand and market; validate product recipes, allergens and prices; decide pickup/delivery, payment provider and inventory ownership. Implement order and payment behavior only after these decisions. Cart and builder state are stored on the current browser, not on a server.

## Version 02 refinements

- Keep the preview at one 430px internal height and scale it at breakpoints. Anchor sauce and toppings to the upper scoop for all six vessel/count combinations.
- Hero previews are exploratory; apply the chosen preset only through the explicit build action.
- Larger body text and touch controls; reorganized small-screen cart; scrollable named dialogs and pause-motion control respecting system settings.
- Generate a portable story-sized PNG card. Malformed saved cart rows are discarded; storage failures are reported in the builder.
- Ten domain/geometry regression tests passed for version 02.

## Version 03

All three hero presets now use dedicated photoreal transparent product assets and the same floating/switch animation. The previous berry/chocolate hero composites were removed from the active rendering path. Both languages cover navigation, descriptions, builder controls, bag, price formatting, accessibility labels, messages and PNG cards. Pricing remains sample Iranian toman in both languages, with no currency conversion.

Owner-supplied contact links: `mailto:rezaieehsan15@gmail.com` and `https://wa.me/971559606245`. Adding links does not send messages.

The original version 03 had sixteen regression tests, including translation coverage and execution of the actual bag renderer in both languages. Localized PNG cards were rendered separately with the exact bundled fonts for inspection. No interactive browser or mobile screenshot QA was performed.

## Portable audit revision 0.3.1

Eighteen tests pass, including regressions for custom names matching inherited
JavaScript object keys and the mobile menu label when switching languages.
The complete archive audit and its limits are in [docs/AUDIT-FA.md](docs/AUDIT-FA.md).
These two code corrections are part of this portable export; they have not been
published to the hosted Site.

## Windows local-server correction 0.3.2

The 0.3.1 local server rejected native Windows backslashes in resolved relative
filesystem paths. This incorrectly returned 403 for nested images, the logo and
fonts, although top-level HTML, CSS and JavaScript loaded. Version 0.3.2 validates
URL backslashes separately and uses the platform separator only to detect paths
that leave the public directory. The website assets and application are unchanged.

Three additional tests cover Windows paths (including folders with spaces), POSIX
paths and real GET/HEAD requests for every bundled website file. These use Node's
Windows path API; a Windows operating system was not available for a native run.

After replacing the package, stop the previous server with Ctrl+C, run
`npm run dev` from the new extracted folder, and hard-refresh the browser with
Ctrl+F5 at http://127.0.0.1:3000. No installation or build is needed.
