# PAMMRES — TODO checklist

Work needed to meet `PAMMRES Website Guide.pdf`. See `CLAUDE.md` for the requirements summary.
Tick items (`[x]`) as they land. Items marked **(needs client)** are blocked on content or assets from PAMMRES.

## 0. Client revisions (2026-11-26)

Requested by PAMMRES after the progress review. Where these conflict with the guide, the client's revision wins.

- [x] **Loading screen with the logo** (`components/SiteLoader.tsx`, mounted in `layout.tsx`). Shows the emblem with a spinning gold ring until the visible images and fonts have loaded, then fades out.
  - It shows on full page loads only; client-side navigation doesn't show it again.
  - It gives up after 6s. A CSS fail-safe in `styles.css` hides it after 8s if JS never runs, and `<noscript>` hides it straight away.
  - It uses a small pre-sized copy of the logo, `public/images/pammres-logo-288.webp`, so the logo appears instantly.
- [x] **Image-background hero** (`components/home/WelcomeHero.tsx`) above the split hero. Lines: "Welcome to PAMMRES" / full name / "Bridging Philippine and Global Scholarship". It holds the page's `h1`; the split hero headline is now an `h2`.
  - Background: `public/images/members-1.jpg` (MMIRA 2026 delegation photo).
  - [ ] Confirm with the client that both heroes should stay (welcome hero + split hero).
- [x] **The seminar-workshops began in 2018, not 2012**: `WhoWeAre.tsx` quick stat and 3 places in `events/page.tsx`. "Data Privacy Act of 2012" in the membership form is the law's name and stays.
- [x] **Bigger font**: the root font size is 17px instead of 16px (`html { font-size: 106.25% }` in `styles.css`), so all rem-based text, spacing and breakpoints scale together.
- [x] **Affiliates page** (`/affiliates`, content in `content/affiliates.ts`): MMIRA, MMIRA-CC (Caribbean Chapter), MMIRA-Oceania and JSMMR. The cards link out in a new tab. Names and descriptions come from each site.
  - [ ] Affiliate logos **(needs client)**. Optionally move the list into the CMS if it changes often.
- [x] **New header nav**: Home | About | Membership | Events | News | Resources | Contact | Affiliates (`navigation.ts`). It fits in one row from `lg` up and in the mobile menu.
  - [x] **News** (`/news`, `/news/[slug]`): new `News` collection (title, summary, rich-text content, cover image, date, drafts). The page shows an empty state until posts are published.
  - [ ] Add the first news posts in the admin **(needs client: content)**.
  - [x] **Resources**: the Mentorship & Resources page moved from `/mentorship` to `/resources`. `/mentorship` permanently redirects there (`next.config.ts`).
  - [x] Resources only, no mentorship (client follow-up): the Research Mentorship Program section is removed. The page keeps the Research Interest Groups & Expertise Directory and the Learning Repository. The footer link "Mentorship Program" is now "Resources".
  - [x] **Research & Policy** dropped out of the header. The footer's Programs column now links to it.
  - [x] Member Login / Join PAMMRES stay on the right of the header (not part of the revision).
  - [x] Fixed: the header's Join PAMMRES button was meant to be hidden below `sm`, but showed (and wrapped) on phones.
- [x] **Real Q+Q emblem**: `LogoMark` now renders `public/images/pammres-small-logo.webp` (header, footer, Who We Are, About).

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
- [x] Replace `LogoMark` with the real Q+Q emblem (`public/images/pammres-small-logo.webp`). An SVG would still be sharper if PAMMRES has one.
- [ ] Fix `pnpm lint`. It fails before linting anything: `@eslint/eslintrc` is imported by `eslint.config.mjs` but not installed.

## 2. Navigation, header & footer

- [x] `navigation.ts`: Home | About Us | Membership | Events & Training | Research & Policy | Mentorship (since replaced by the client's revision, section 0). No `#` links remain. It also holds `joinHref`, `memberLoginHref`, `partnerHref`, the footer link lists, and `contactEmail` / `facebookUrl` (null until supplied).
- [x] Placeholder pages for `/membership`, `/events`, `/research` and `/mentorship` (`PlannedSections`). They list the guide's subsections with anchor ids, so header and footer links resolve. Replace them in phase 6.
- [x] `SiteHeader`:
  - [x] Make it sticky. `scroll-padding-top` in `styles.css` keeps anchors clear of it.
  - [x] Left: emblem and the full association name.
  - [x] Right: `Member Login` (outline button) and `Join PAMMRES` (solid crimson button).
  - [x] Desktop layout: two rows, with links centred in a navy bar with a gold rule below. Six links, two buttons and the full name don't fit on one row at laptop widths.
  - [x] Check the mobile menu: all links plus both buttons; Join PAMMRES also shows in the bar from `sm`.
- [x] Pre-footer CTA band on the home page: "Ready to advance your mixed methods research journey?" with Join PAMMRES Today / Partner With Us for a Workshop.
- [ ] Make `/contact#partner` real (the link goes to `/contact`, which has no `#partner` section). Member Login now goes to `/login`.
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
- [x] Hero collage photos: `members-3.jpg`, `members-5.jpg`, `members-4.jpg` (in `HomeHero.tsx`).
- [x] Gallery: The Filipino Mixed Methods Fair, `workshop-1.jpg` (Halo-Halo 3).
- [x] Home gallery photos and captions (client, 2026-11-26): seminar-workshop (`workshop-3.webp`), Halo-Halo 3 Fair (`workshop-1.jpg`), PAMMRES members (`members-7.webp`).
- [ ] Institution logos **(needs client)**: set `logo` on each entry in `content/institutions.ts`. Until then the strip shows abbreviations and full names.
- [ ] Re-check the "100+ researchers" and institution count with PAMMRES before launch.

## 4. About Us page (`src/app/(frontend)/about/page.tsx`)

Content lives in `content/identity.ts` (Vision, Mission, Core Values) and `content/officers.ts` (officers, theme groups, founding officers). Section anchors: `#story`, `#vision-mission`, `#core-values`, `#emblem`, `#officers`, `#theme-leaders`, `#governance`.

- [x] Navy `PageHeader` with the eyebrow "WHO WE ARE", the guide's title and subtitle, and the breadcrumb Home / About Us.
- [x] Our Story & Affiliation: 65% narrative and a 35% navy quick-facts card. The old placeholder sections are removed.
- [x] Vision card (crimson top border) and Mission card (navy top border) with the final wording.
- [x] Grid of 5 Core Value cards: number, title, tagline and full text.
- [x] Core Value cards have a 3:2 photo slot at the top, with the number badge in its corner (client request). Each shows a placeholder until its file exists.
- [x] Core Value photos (client, 2026-11-26): `public/images/value-1.webp` to `value-5.webp`, with alt text in `content/identity.ts`.
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
  - [x] Categories: Regular (₱500), Student (₱300), Institutional (₱2,000), per the client revision of 2026-11-26. They replace Full and Associate/Emergent Scholar, which stay as admin-only "old category" options so earlier applications remain valid.
  - [x] Application steps and form.
  - [x] Member Login placeholder.
  - [x] ~~Regional & School Chapters (Luzon, Visayas, Mindanao)~~: removed at the client's request (2026-11-26). The page is titled "Membership" instead of "Membership & Chapters".
- [x] Membership fees: Regular ₱500, Student ₱300, Institutional ₱2,000.
- [ ] Eligibility per category ("Who it's for") **(needs client)**. Also confirm whether the fees are annual; the page just says "Membership fee".
- [ ] Bank transfer / GCash account details for step 2 **(needs client)**.
- [x] ~~**Membership application**: `MembershipApplications` collection plus a server action and form.~~ Replaced by member accounts. The collection was removed on 2026-11-26; categories and fees are now in `src/collections/membership.ts`.
  - Validation and honeypot.
  - Data Privacy Act (RA 10173) consent checkbox.
  - Editors set the status: new → payment verified → approved/declined.
- [ ] Have PAMMRES review the consent wording and supply a privacy notice to link **(needs client)**.
- [ ] Email the secretariat when an application or contact message arrives. Needs an email adapter (Resend/SMTP), which isn't configured yet.
- [x] **Member accounts** (client request, 2026-11-26).
  - **Pages:** `/join` (create account) → `/member/apply/1..4` (personal info; published research; unpublished research, interests and 2x2 photo; category and payment) → status Pending → editors approve in the admin under **Members**.
  - **Member area:** `/member` shows the status, the profile, member resources once approved, and a log-out button. `/login` honours `?next=`.
  - **Access:** member accounts are separate from editor accounts (`Members` vs `Users`). Access helpers check for an editor (`isEditor` in `src/access`), so members can't edit content. Draft history and Users/Media are now editors-only.
  - **Photos:** 2x2 photos go in the private `member-photos` collection (git-ignored folder).
  - **Tests:** `tests/int/members.int.spec.ts`.
- [x] Research-interest options for step 3, from PAMMRES: Educational Research, Science Research, Program Evaluation, Business Research, Research Methodology.
- [x] **Payment receipts** (client request, 2026-11-26): step 4 and renewal require a receipt upload (image or PDF, up to 5 MB). Receipts go in the private `payment-receipts` collection (owner and editors only, git-ignored folder). Images are re-encoded to strip metadata. Every receipt is kept as payment history.
- [x] **Annual membership** (client request, 2026-11-26): approval sets **Membership expires** to one year later. From 30 days before expiry, or after it, members renew at `/member/renew`: category, payment and receipt → **Renewal pending** → the editor approves → +1 year from the old expiry (or from today if it had lapsed). Expired members lose member resources until renewed. The rules are in `src/collections/membership.ts` (`nextExpiry`, `membershipStanding`).
- [ ] **Renewal reminders by email** need an email service (see below). For now members see the reminder on `/member`.
- [ ] Members-only resource content (recordings, slides, guides, toolkits) **(needs client)**.
- [ ] Email service (e.g. Resend) for password reset, approval notices and secretariat alerts. For now, a forgotten password is reset by an editor ("Change password" on the member in the admin).
- [ ] Deploy: give Coolify a persistent volume for `media/`, `member-photos/` and `payment-receipts/` (uploads are stored on local disk).
- [ ] Expertise directory: can now be built from approved members' profiles.
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
- [x] Removed the leftover template route `src/app/my-route/route.ts`.
- [ ] Update `README.md`, which still describes the blank Payload template.

## 8. Security (review of 2026-11-26)

- [x] **Open redirect:** fixed in `safeNext` (`/login?next=/\evil.com`).
- [x] **Startup guard:** the app won't start in production without `PAYLOAD_SECRET` (16+ characters) and `DATABASE_URL`.
- [x] **Dependencies:** `sharp` 0.35.5; `pnpm-workspace.yaml` overrides for `happy-dom` and `dompurify`. `pnpm audit --prod` is clean.
- [x] **Security headers** (`next.config.ts`): frame-ancestors/X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, and HSTS in production.
- [x] **Logout** ends the Payload session server-side, so copied tokens stop working.
- [x] **Rate limits:** 5 sign-ups and 5 contact messages per IP per hour (`src/lib/rateLimit.ts`). It's in-memory, so it resets on restart and is per instance.
- [x] **Member photos** are re-encoded: metadata stripped, max 800px, renamed `member-<id>.jpg`.
- [x] **GraphQL API** disabled (unused).
- [x] **Contact Messages** are editors-only (members could read them before).
- [ ] **Coolify:** make sure `PAYLOAD_SECRET` is set (a fresh 32+ character random value is best) and that the app is served over HTTPS (HSTS is sent).
- [ ] **Known trade-offs:** sign-up reveals whether an email is already registered. A full script CSP needs nonces and is not set up.
- [ ] Run `pnpm audit --prod` before each deploy.
