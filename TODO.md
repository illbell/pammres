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

- [x] `Officers` collection (`src/collections/Officers.ts`): name (with honorifics), role, institution, photo, group, current/past, term, order, slug. Past officers are grouped into About-page archive panels by `term`.
- [x] `ThemeGroups` collection: number, title, summary (home pillar card), mandate, leader name and institution, icon. Leaders are free text rather than a link to `Officers`, because three of the four leaders aren't national officers.
- [x] `Events` collection: title, dates, location, registration link, summary, rich-text description, cover image, gallery, type, `featured` flag. It has drafts (visitors see published events only). Not shown on the site until the Events page is built in phase 6.
- [x] `Partners` collection: name, abbreviation, logo, website, type, "show on home" flag, order. It feeds the home page institution strip and the institution count.
- [x] `SiteSettings` global: announcement (custom text / next featured event / hidden), official email, Facebook URL, mailing address. Used by the announcement bar, footer and contact page.
- [ ] Optional: `About` global for Vision, Mission and Core Values. Still in `content/identity.ts`; add it only if editors need to change them.
- [ ] Optional: move the quick stats ("100+ researchers") and the Our Story text into the CMS if they change often.
- [x] Access control (`src/access/index.ts`):
  - Public read.
  - `create`, `update` and `delete` for signed-in users only.
  - Events drafts hidden from visitors.
  - Editor-entered links limited to http(s) or site paths (`src/fields/url.ts`).
- [x] Revalidation (`src/hooks/revalidate.ts`): saving in the admin refreshes the affected static pages, and Site Settings refreshes every page. Verified end-to-end on a production build.
- [x] Frontend loaders in `src/app/(frontend)/data/cms.ts` read as a public visitor (`overrideAccess: false`). If the database is unreachable, they fall back to the built-in content in `content/`.
- [x] `pnpm generate:types`. The admin import map (`src/app/(payload)/admin/importMap.js`) picked up the rich-text editor components for the Events description; regenerate it with `pnpm generate:importmap` after adding rich-text or custom admin fields.
- [x] `pnpm seed` (`src/seed/index.ts`): loads the guide's officers, 2019 inaugural officers, theme groups, partners and announcement. It creates only what's missing, so it never overwrites admin edits.
- [x] Integration tests (`tests/int/content.int.spec.ts`): access control, drafts, officer validation, URL validation.

## 6. Remaining pages (guide gives outline only; placeholders until copy arrives)

All five pages are built. `PlannedSections` is removed. Where the guide gives no copy, the pages show yellow `<Placeholder>`s; search the code for `<Placeholder>` to find them all. The functional copy is ours and should be reviewed by PAMMRES: application steps, closing bands on Membership and Research, the SDG card descriptions, and the empty states.

- [x] **Membership** (`/membership`):
  - [x] Why Join: 4 benefit cards, using guide copy.
  - [x] Categories: Full, Associate/Emergent Scholar, Student, Institutional.
  - [x] Application steps and form.
  - [x] Member Login placeholder.
  - [x] Regional & School Chapters (Luzon, Visayas, Mindanao).
- [ ] Membership fees and eligibility per category **(needs client)**.
- [ ] Bank transfer / GCash account details for step 2 **(needs client)**.
- [x] **Membership application**: `MembershipApplications` collection (no public access at all, since it holds personal data) plus a server action and form.
  - Validation and honeypot.
  - Data Privacy Act (RA 10173) consent checkbox.
  - Editors set the status: new → payment verified → approved/declined.
- [ ] Have PAMMRES review the consent wording and supply a privacy notice to link **(needs client)**.
- [ ] Email the secretariat when an application or contact message arrives. Needs an email adapter (Resend/SMTP), which isn't configured yet.
- [ ] **Member Login / directory**: decide the scope (Payload auth for members, or a link out) **(needs client decision)**. It blocks the expertise directory too.
- [x] **Events & Training** (`/events`) is driven by the Events collection:
  - [x] Upcoming events, with a calendar badge, Register Now and Details.
  - [x] Conferences & colloquia: upcoming ones only (past ones are listed under Past Trainings).
  - [x] Past trainings: photo grid for events with images, cards for the rest, and the guide's list of venues while there are no past events.
  - [x] Event detail page `/events/[slug]`: rich-text description, gallery, details sidebar. Times are shown in PHT.
  - [x] Hourly revalidation so events move from upcoming to past.
- [ ] Add real events in the admin, with photos for the gallery **(needs client: dates, photos)**.
- [x] **Research & Policy** (`/research`): journal (placeholder) with a JMMR link, SDG Hub, and Framework, each linking to its theme group.
- [ ] IJMRA official URL, journal details and featured studies **(needs client)**.
- [x] **Mentorship & Resources** (`/mentorship`): program, using guide copy, plus placeholders for the RIG directory and learning repository.
- [x] **Linkages & Contact** (`/contact`):
  - [x] MMIRA affiliation and the partners list from the CMS, grouped by type.
  - [x] Sponsorship & Advocacy (`#partner`).
  - [x] Secretariat contact details and the form.
- [x] Contact topics now include chapters, mentorship, and hosting/sponsorship. The `publications` value is kept so earlier messages stay valid.
- [x] Shared form components (`components/form.tsx`), used by both forms.
- [x] Integration tests (`tests/int/membership.int.spec.ts`): validation, save, honeypot, no visitor access.

## 7. Quality & launch

- [ ] Responsive check: phone, tablet and desktop. The sticky header must not cover anchor targets.
- [ ] Accessibility: contrast for crimson/gold on white and navy, focus rings in the new palette, alt text, heading order.
- [ ] Per-page `metadata` (title and description), plus Open Graph images.
- [ ] Update the Playwright e2e tests for the new nav and pages, and the Vitest integration tests for the new collections.
- [ ] `pnpm lint` and `pnpm build` pass.
- [ ] Remove the leftover template route `src/app/my-route/route.ts` if it's unused.
- [ ] Update `README.md`, which still describes the blank Payload template.
