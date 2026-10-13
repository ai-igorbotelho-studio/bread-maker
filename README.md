# Bread Maker

Recipes, menu chart and nutrition estimates for the Panasonic SD-2501 bread maker. A static site with no build step: `index.html`, `styles.css`, `app.js` and `data.js`.

## Deploy to Cloudflare Pages

1. In the Cloudflare dashboard open **Workers & Pages → Create → Pages → Connect to Git** and pick this repository.
2. Build settings: framework preset **None**, build command empty, build output directory `/`.
3. Save and deploy. Every push to the production branch redeploys.

Or from a terminal with Wrangler: `npx wrangler pages deploy . --project-name bread-maker`.

## Content

- `data.js` holds the 27-menu chart and 67 recipes transcribed from the SD-2501 Operating Instructions and Recipes booklet (pages 10–11 and 21–40), with both Australian and New Zealand quantities.
- Nutrition figures are estimates computed in `app.js` from typical nutrient values per ingredient. They are not from Panasonic.

## Photos

`img/` holds recipe photos downloaded from [Unsplash](https://unsplash.com) under the Unsplash License, resized to 640×480. They illustrate the style of bake, not the manual's exact recipes. The recipe-to-photo mapping is `PHOTO` in `app.js`.
