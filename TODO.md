# PAMMRES — TODO checklist

Work needed to meet `PAMMRES Website Guide.pdf`. See `CLAUDE.md` for the requirements summary.
Tick items (`[x]`) as they land. Items marked **(needs client)** are blocked on content or assets from PAMMRES.

## 1. Foundation: design system & layout

- [x] Replace the palette in `src/app/(frontend)/styles.css` with navy, crimson, gold, white and cream tokens. Remove the green/blue `quan`, `qual` and `integrate` strand colors and update every use of them.
- [x] Swap the fonts in `src/app/(frontend)/layout.tsx`: Source Serif 4 for headings, IBM Plex Sans for body text.
- [x] Change `themeColor` in `layout.tsx` to `#FFFFFF` and update the site `metadata.description` to the guide's wording.
- [x] Build shared components (in `src/app/(frontend)/components/`):
  - [x] `ui.ts`: button and link class strings (`buttonPrimary` crimson, `buttonOutline`, `buttonGold`, `buttonOutlineOnDark`, `textLink`, focus rings).
  - [x] `SectionHeading`: eyebrow tag, serif heading, subtext.
  - [x] `PageHeader`: navy banner, gold bottom rule, breadcrumb.
  - [x] `Card`: navy/crimson/gold top-border variants, gold icon, lift on hover.
  - [x] `CtaBand`: crimson with a gold accent.
  - [x] `Accordion`: native `<details>`, no client JS.
  - [x] `OfficerCard`: circular headshot (initials when there's no photo), name, title, institution.
- [x] Interim `LogoMark` in the logo's shape: red and blue cyclical arrows around a white Q+Q triangle.
- [ ] Replace `LogoMark` with the real Q+Q emblem. **(needs client: logo file, SVG preferred)**
- [ ] Fix `pnpm lint`. It fails before linting anything: `@eslint/eslintrc` is imported by `eslint.config.mjs` but not installed.

## 2. Navigation, header & footer

- [x] `navigation.ts`: Home | About Us | Membership | Events & Training | Research & Policy | Mentorship. No `#` links remain. It also holds `joinHref`, `memberLoginHref`, `partnerHref`, the footer link lists, and `contactEmail` / `facebookUrl` (null until supplied).
- [x] Placeholder pages for `/membership`, `/events`, `/research` and `/mentorship` (`PlannedSections`). They list the guide's subsections with anchor ids, so header and footer links resolve. Replace them in phase 6.
- [x] `SiteHeader`:
  - [x] Make it sticky. `scroll-padding-top` in `styles.css` keeps anchors clear of it.
  - [x] Left: emblem and the full association name.
  - [x] Right: `Member Login` (outline button) and `Join PAMMRES` (solid crimson button).
  - [x] Desktop layout: two rows, with links centred in a navy bar with a gold rule below. Six links, two buttons and the full name don't fit on one row at laptop widths.
  - [x] Check the mobile menu: all links plus both buttons; Join PAMMRES also shows in the bar from `sm`.
- [x] Pre-footer CTA band on the home page: "Ready to advance your mixed methods research journey?" with Join PAMMRES Today / Partner With Us for a Workshop.
- [ ] Make `/contact#partner` and the Member Login target real. These links currently go to `/contact` with no `#partner` section, and to `/membership#member-login` (phase 6).
- [x] `SiteFooter`, rebuilt as 4 columns on deep navy:
  1. Logo, mission and Facebook link.
  2. Quick Links.
  3. Programs.
  4. Contact Secretariat: Luzon, Visayas and Mindanao inquiries.
- [ ] Real contact details: email and Facebook page URL. Used in `SiteFooter.tsx` and `contact/page.tsx`. **(needs client)**

## 3. Home page (`src/app/(frontend)/page.tsx`)

Sections live in `components/home/`; shared content is in `content/` (`pillars.ts`, `institutions.ts`, `images.ts`).

- [x] Split hero (`HomeHero`): a 60% navy gradient text panel and a 40% photo collage, with the guide's eyebrow, headline, subheadline and CTAs.
- [x] Announcement bar (`AnnouncementBar`) using the guide's copy.
- [ ] Make the announcement bar editable (SiteSettings global or a featured Event). Phase 5.
- [x] Who We Are & Logo Philosophy (`WhoWeAre`): emblem, copy, quick stats, symbolism bullets, and a "Meet Our National Officers & Board →" link.
- [x] Four Strategic Pillars (`StrategicPillars`): 2×2 cards with gold icons, using the guide's copy.
- [x] Membership & Mentorship spotlight (`MembershipSpotlight`): cream band, two audience cards and a "View Membership Tiers & Apply" button.
- [x] Institutional reach (`InstitutionalReach`): scrolling strip of the 12 institutions (pauses on hover; static for reduced motion) and a 3-photo strip with the guide's captions.
- [x] Old full-bleed `HeroPhoto` removed. `SitePhoto` shows a labelled placeholder until the file exists.
- [ ] Photos **(needs client)**. Drop them in and they appear automatically, then update each `alt`:
  - `public/images/home/hero-1.jpg` (4:5), `hero-2.jpg`, `hero-3.jpg` (4:3)
  - `public/images/home/gallery-up-manila.jpg`, `gallery-mixed-methods-fair.jpg`, `gallery-bulacan.jpg` (4:3)
- [ ] Institution logos **(needs client)**: set `logo` on each entry in `content/institutions.ts`. Until then the strip shows abbreviations and full names.
- [ ] Re-check the "100+ researchers" and institution count with PAMMRES before launch.

## 4. About Us page (`src/app/(frontend)/about/page.tsx`)

Content lives in `content/identity.ts` (Vision, Mission, Core Values) and `content/officers.ts` (officers, theme groups, founding officers). Section anchors: `#story`, `#vision-mission`, `#core-values`, `#emblem`, `#officers`, `#theme-leaders`, `#governance`.

- [x] Navy `PageHeader` with the eyebrow "WHO WE ARE", the guide's title and subtitle, and the breadcrumb Home / About Us.
- [x] Our Story & Affiliation: 65% narrative and a 35% navy quick-facts card. The old placeholder sections are removed.
- [x] Vision card (crimson top border) and Mission card (navy top border) with the final wording.
- [x] Grid of 5 Core Value cards: number, title, tagline and full text.
- [x] Emblem meaning on a cream band, with the two annotated callouts.
- [x] National Officers: all 14 from the guide, in rows of 2 / 3 / 6 / 3. Each shows initials until a headshot exists.
- [ ] Officer headshots **(needs client)**: `public/images/officers/<slug>.jpg`, square. Slugs are in `content/officers.ts`. They appear automatically.
- [x] Theme Group Leaders: 4 cards, each with its leader, institution and mandate.
- [x] Founding & Governance accordion with the 2019 inaugural officers.
- [ ] Constitution & By-Laws PDF, SEC registration details and chapter guidelines PDF **(needs client)**. These are placeholders in the accordion's second panel.
- [x] Closing CTA: "Be Part of Our Growing Community of Practice" with Apply for Membership / Explore Upcoming Events.
- [x] `SplitSection` removed (no longer used).

## 5. CMS (Payload) — make the guide's content editable

- [ ] `Officers` collection: name, honorific, role, group (executive, regional, secretariat, tech), institution, photo, order, and current/past.
- [ ] `ThemeGroups` collection: number, title, summary, mandate, and leader (relationship to `Officers`).
- [ ] `Events` collection:
  - title, type (webinar, workshop, conference, colloquium), dates, venue/online, registration URL, description, gallery
  - `featured` flag for the announcement bar
- [ ] `Partners` collection: name, abbreviation, logo, type (HEI, agency, international), URL.
- [ ] `SiteSettings` global: announcement bar, contact email, Facebook URL, quick facts (e.g. "100+ researchers").
- [ ] Optional: `About` global for Vision, Mission and Core Values. Keeping them hardcoded is fine until a need appears.
- [ ] Access control:
  - Public `read` on public content.
  - `create`, `update` and `delete` only for authenticated users.
  - Follow the Payload skill's security notes.
- [ ] Run `pnpm generate:types`, and `pnpm generate:importmap` if needed.
- [ ] Seed script with the guide's officers, theme groups and partners.

## 6. Remaining pages (guide gives outline only; placeholders until copy arrives)

- [ ] **Membership** (`/membership`):
  - [ ] Why Join.
  - [ ] Categories & fees: Individual (Full, Associate/Emergent Scholar, Student) and Institutional. **(needs client: fees)**
  - [ ] Application process and payment verification (bank transfer/GCash).
  - [ ] Regional & School Chapters.
- [ ] **Membership application**: a form plus a Payload collection, following the existing `ContactMessages` and `actions.ts` pattern.
- [ ] **Member Login / directory**: decide the scope (Payload auth for members, or a link out). **(needs client decision)**
- [ ] **Events & Training** (`/events`):
  - [ ] Upcoming webinars and workshops.
  - [ ] Conferences & colloquia (Filipino Mixed Methods Fair).
  - [ ] Past trainings gallery, 2012 to present. **(needs client: photos)**
- [ ] **Research & Policy** (`/research`):
  - [ ] Journal & proceedings: links to JMMR and IJMRA. The old `Publications` collection was removed; add a new one only if PAMMRES wants to list papers on the site.
  - [ ] SDG Hub.
  - [ ] Indigenized Filipino MMR Framework.
- [ ] **Mentorship & Resources** (`/mentorship`):
  - [ ] Mentorship program.
  - [ ] RIGs & expertise directory.
  - [ ] Learning repository.
- [ ] **Linkages & Contact** (`/contact`):
  - [ ] Add a partners section and a "Sponsorship & Advocacy" block (host a workshop or sponsor).
  - [ ] Align the `ContactMessages` topics with these options.

## 7. Quality & launch

- [ ] Responsive check: phone, tablet and desktop. The sticky header must not cover anchor targets.
- [ ] Accessibility: contrast for crimson/gold on white and navy, focus rings in the new palette, alt text, heading order.
- [ ] Per-page `metadata` (title and description), plus Open Graph images.
- [ ] Update the Playwright e2e tests for the new nav and pages, and the Vitest integration tests for the new collections.
- [ ] `pnpm lint` and `pnpm build` pass.
- [ ] Remove the leftover template route `src/app/my-route/route.ts` if it's unused.
- [ ] Update `README.md`, which still describes the blank Payload template.
