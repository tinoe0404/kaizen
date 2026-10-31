# Updating Kaizen Travel & Adventures

This document is the internal operational playbook for fulfilling client update requests. Follow each procedure step by step to ensure data integrity, image optimization, SEO compliance, and error-free builds.

---

## General Rules Before You Begin

1. **Never edit files in production directly**. Always work in a feature branch or local working copy.
2. **Never commit raw source photos**. Original photos go into `photos-source/` (which is git-ignored) and are processed with `npm run images:optimize`.
3. **Always use NEW filenames when updating photos** (e.g. `victoria-falls-2.jpg`, not overwriting `victoria-falls-1.jpg`). Cloudflare and Vercel CDN caches immutable assets for 31 days.
4. **Always run verification commands** before pushing code.

---

## 1. Changing a Price

### Step-by-Step
1. Locate the item in its content file:
   - Lodges: `content/lodges.ts`
   - Activities: `content/activities.ts`
   - Destinations: `content/destinations.ts`
   - Vehicles: `content/vehicles.ts`
2. Update the `pricing.amountUsd` integer property:
   ```ts
   pricing: {
     unit: "per_person_per_night",
     amountUsd: 220, // updated from 200
   }
   ```
   *(Note: `unit` must be one of `"per_person"`, `"per_group"`, `"per_person_per_night"`, `"per_group_per_night"`, `"per_group_per_day"`).*

### Verification & Promotion
1. Run content and unit checks:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "content: update price for [Lodge Name] to $220 USD"
   ```
3. **Verify on Vercel Preview URL**:
   - Open the preview deployment link generated on GitHub / Vercel.
   - Navigate to the item's detail page and confirm the updated price line.
   - Add the item to `/trip`, switch currencies (EUR, GBP, ZAR), and confirm converted totals match expectations.
   - In Vercel Dashboard, promote the preview deployment to Production.

---

## 2. Adding a New Item (Lodge, Activity, Destination, Vehicle)

### Step-by-Step
1. **Prepare photos**:
   - Save high-resolution client photos into `photos-source/<category>/` named `<slug>-1.jpg`, `<slug>-2.jpg`, etc.
   - Example: `photos-source/lodges/zambezi-ridge-1.jpg`
2. **Run image optimization**:
   ```bash
   npm run images:optimize
   ```
   This will auto-rotate the photo, strip GPS/EXIF tags, resize to max 2000px, create progressive JPEGs under `public/images/lodges/`, and write blur metadata to `content/generated/photo-meta.json`.
3. **Add offering entry**:
   Open the relevant file (e.g. `content/lodges.ts`) and append the new offering object:
   ```ts
   {
     id: "zambezi-ridge-lodge", // must be unique across the entire site
     slug: "zambezi-ridge-lodge", // unique within category
     category: "lodge",
     name: "Zambezi Ridge Lodge",
     summary: "Luxury cliffside retreat overlooking the Zambezi River gorges.",
     description: "Perched above the Zambezi, this boutique lodge offers panoramic river views...",
     pricing: {
       unit: "per_person_per_night",
       amountUsd: 380,
     },
     photos: [
       {
         src: "/images/lodges/zambezi-ridge-1.jpg",
         alt: "Panoramic deck view over the Zambezi River at sunset",
       },
     ],
     destinationSlug: "victoria-falls", // optional link to a destination slug
     featured: true, // optional boolean
   }
   ```

### Verification & Promotion
1. Run content validation and test suite:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "content: add Zambezi Ridge Lodge offering with optimized photography"
   ```
3. **Verify on Vercel Preview URL**:
   - Check the listing page (`/lodges`) to ensure the card appears with proper photo and summary.
   - Open `/lodges/zambezi-ridge-lodge` to verify gallery swipe, pricing, and "Add to trip".
   - Check `/sitemap.xml` to verify the new route is included.
   - Promote preview deployment to Production.

---

## 3. Removing an Item

### Step-by-Step
1. Open the relevant file:
   - `content/destinations.ts`, `content/activities.ts`, `content/lodges.ts`, or `content/vehicles.ts`.
2. Locate the offering by its `id` and remove the object.
3. Check for references:
   - If removing a destination, check `content/activities.ts` and `content/lodges.ts` to ensure no item has `destinationSlug` pointing to the deleted destination.

### Verification & Promotion
1. Run content and test suite:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "content: remove discontinued offering [Offering Name]"
   ```
3. **Verify on Vercel Preview URL**:
   - Confirm the old URL returns 404 with the branded Not Found page.
   - Confirm `/sitemap.xml` no longer lists the removed URL.
   - Promote preview deployment to Production.

---

## 4. Changing a Photo (Using a NEW Filename)

> [!WARNING]
> Because static images are cached immutably for 31 days by browsers and CDNs, **never overwrite an existing image file**. Always increment the filename suffix (e.g., change `-1.jpg` to `-2.jpg`).

### Step-by-Step
1. Place the new photo into `photos-source/<category>/` using a **new** filename:
   - Example: `photos-source/destinations/victoria-falls-2.jpg` (replacing `victoria-falls-1.jpg`).
2. Run image optimization:
   ```bash
   npm run images:optimize
   ```
3. Update the offering entry in `content/<category>.ts`:
   ```ts
   photos: [
     {
       src: "/images/destinations/victoria-falls-2.jpg",
       alt: "Updated aerial view of Victoria Falls spray",
     },
   ]
   ```
4. Optional: Delete the obsolete file from `public/images/<category>/victoria-falls-1.jpg`.

### Verification & Promotion
1. Run validation:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "content: update hero photo for Victoria Falls (new filename)"
   ```
3. **Verify on Vercel Preview URL**:
   - Open the detail page and confirm the fresh photo renders immediately with proper blur-up loading.
   - Promote preview deployment to Production.

---

## 5. Updating Exchange Rates & Date

### Step-by-Step
1. Open `content/currency.ts`.
2. Update the exchange rates against 1 USD:
   ```ts
   export const rates: Record<Currency, number> = {
     USD: 1,
     EUR: 0.94,  // updated
     GBP: 0.81,  // updated
     ZAR: 18.25, // updated
   };
   ```
3. Update `ratesUpdated` to today's date in `YYYY-MM-DD` format:
   ```ts
   export const ratesUpdated: string = "2026-11-01";
   ```

### Verification & Promotion
1. Run content checks and tests:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "currency: update exchange rates and ratesUpdated to 2026-11-01"
   ```
3. **Verify on Vercel Preview URL**:
   - Check the trip builder summary on `/trip`.
   - Verify that the footer/summary displays "Rates as of 2026-11-01".
   - Promote preview deployment to Production.

---

## 6. Changing Contact Details

### Step-by-Step
1. Open `content/site.ts`.
2. Update the target properties:
   - `whatsappNumber`: Must be a valid international number or local Zimbabwean number (e.g. `+263 77 123 4567` or `0771234567`). The normalizer automatically validates and converts this to international format.
   - `bookingEmail`: Operations inbox address.
   - `address`: Physical office location.
   - `hours`: Operating hours string.
   - `socialLinks`: Array of `{ label, href }`.

### Verification & Promotion
1. Run content checks and tests:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "content: update office address and WhatsApp contact number"
   ```
3. **Verify on Vercel Preview URL**:
   - Check `/contact`, footer, and the floating WhatsApp button.
   - Click the WhatsApp link to verify it opens `https://wa.me/263...` with correct greeting.
   - Promote preview deployment to Production.

---

## 7. Editing About or Privacy Text

### Step-by-Step
1. For About page copy:
   - Open `content/about.ts`.
   - Modify `heading`, `intro`, `sections`, or `values`.
2. For Privacy Notice:
   - Open `content/privacy.ts`.
   - Modify `intro`, `sections`, and update `lastUpdated: "YYYY-MM-DD"`.

### Verification & Promotion
1. Run validation:
   ```bash
   npm run check:content
   npm run test
   ```
2. Commit message:
   ```bash
   git commit -m "content: update privacy notice terms and lastUpdated date"
   ```
3. **Verify on Vercel Preview URL**:
   - Review `/about` and `/privacy` in browser for typographical layout and mobile readability.
   - Promote preview deployment to Production.

