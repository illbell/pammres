# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Project

Website for the **Philippine Association of Mixed Methods Researchers and Emergent Scholars (PAMMRES)**, the official Philippine affiliate of the Mixed Methods International Research Association (MMIRA). The site's sections and features follow MMIRA's website. Its look and warm, values-driven tone follow Mater Dei Academy (MDA).

## Source of truth

`PAMMRES Website Guide.pdf` (repo root; kept local and git-ignored, since the repo is public) holds the requirements and the final copy:

- the sitemap, design direction, homepage wireframe and copy
- the finalized Vision, Mission and 5 Core Values (with short taglines)
- the full About Us page: officers, theme group leaders and the 2019 founding officers

Rules:
- Use the guide's copy word for word. Do not invent officer names, titles, affiliations, stats, fees or events.
- The guide only outlines Membership, Events, Research, Mentorship and Contact. Use clearly marked placeholders on those pages until real copy arrives.
- If the code and the guide disagree, the guide wins (see **Known gaps**).

## Stack & commands

- Next.js 16 App Router + Payload 3.94 (MongoDB adapter, Lexical rich text), React 19, Tailwind CSS v4, `motion`.
- Frontend routes: `src/app/(frontend)/`. Shared components: `src/app/(frontend)/components/`.
- Collections: `src/collections/`. Config: `src/payload.config.ts`.
- Theme tokens: the `@theme` block in `src/app/(frontend)/styles.css`.
- Package manager: pnpm.
  - `pnpm dev`, `pnpm build`, `pnpm lint`
  - `pnpm generate:types`: run after changing a collection or global. It updates `src/payload-types.ts`.
  - `pnpm generate:importmap`: run after adding custom admin components.
  - `pnpm test:int` (Vitest), `pnpm test:e2e` (Playwright)

## Sitemap (7 sections)

1. **Home**: hero, announcement/next-event bar, Who We Are snapshot, 4 Strategic Pillars, institution logo strip.
2. **About Us**: Our Story & logo meaning; Vision, Mission & Core Values; National Officers & Executive Board; Theme Group Leaders; Constitution, By-Laws & past officers.
3. **Membership & Chapters**: Why Join (benefits); categories & fees (Individual: Full, Associate/Emergent Scholar, Student; Institutional); online application, payment verification (bank transfer/GCash) & member login; Regional & School Chapters (Luzon, Visayas, Mindanao).
4. **Events, Training & Conferences**: upcoming webinars & workshops; conferences & colloquia (The Filipino Mixed Methods Fair); past trainings & gallery (2012 to present).
5. **Research, Publications & Policy Impact**: PAMMRES Research Journal & proceedings (links to JMMR, IJMRA); Societal Impact & SDG Hub (SDGs 1–10, LGU research hubs, policy briefs); Indigenized Filipino MMR Framework.
6. **Mentorship & Resources**: Research Mentorship Program; Research Interest Groups & expertise directory; Learning Repository (recordings, slides, joint display guides, toolkits).
7. **Linkages & Contact**: international & local partners (MMIRA, MOAs/MOUs); Sponsorship & Advocacy (host a workshop / sponsor); Contact & Secretariat (email, Facebook, inquiry form).

## Navigation

Nav items live in `src/app/(frontend)/components/navigation.ts` and are shared by the header and footer.

- **Sticky header**:
  - Left: Q+Q emblem and the full association name.
  - Center: Home | About Us | Membership | Events & Training | Research & Policy | Mentorship.
  - Right: `Member Login` (outline button) and `Join PAMMRES` (solid crimson button).
- **Pre-footer band**: crimson with a gold accent. Headline: "Ready to advance your mixed methods research journey?" Buttons: Join PAMMRES Today / Partner With Us for a Workshop.
- **Footer, 4 columns**:
  1. Logo, short mission and Facebook link.
  2. Quick Links: About Us, Vision & Core Values, National Officers, Constitution & By-Laws.
  3. Programs: Membership Portal, Mentorship Program, Research Journal, Upcoming Events.
  4. Contact Secretariat: email, and regional chapter inquiries for Luzon, Visayas and Mindanao.

## Design system

- **Palette**: deep navy blue, crimson red, warm gold/yellow, crisp white. Use warm cream/light gray for alternating bands. All colors come from the Q+Q logo.
- **Typography**: classic serif headings with a clean sans-serif body. Tables and event schedules must be easy to scan.
- **Photography**: real PAMMRES event photos (workshops, Tagaytay planning, UST Fair) from the Facebook page. No stock photos when a real one is available.
- **Components**:
  - Section pattern: small uppercase eyebrow tag, then serif heading, then body.
  - Cards: subtle navy top border, gold icons, lift on hover.
  - Vision card: crimson top border. Mission card: navy top border.
  - Officer grid: circular headshots, bold name, title, institution.
  - Page headers on inner pages: navy banner with a gold bottom rule, centered white title and a breadcrumb.
- **Logo meaning**:
  - Red and blue cyclical arrows: members continuously sharing research perspectives and growing in method.
  - Central white triangle (Q+Q): methodological triangulation, meaning validity, openness and integrity.

## Page section order

**Home**
1. Split hero: 60% navy gradient text panel, 40% photo collage. Eyebrow "OFFICIAL PHILIPPINE AFFILIATE OF MMIRA". Headline "Bridging Philippine and Global Scholarship Through Mixed Methods Research". CTAs: Become a Member / Explore Upcoming Webinars →.
2. White announcement bar under the hero.
3. Who We Are & logo philosophy, as two columns: the emblem, then the copy and quick stats.
4. Four Strategic Pillars in a 2×2 card grid: Global Recognition & Standard Setting; Societal Impact & Policy Influence; Organizational Growth & Sustainability; Collaboration & Knowledge Production.
5. Membership & Mentorship spotlight: a cream band with two cards (Experienced Scholars & Institutions / Emergent Scholars & Students).
6. Institutional reach: a logo carousel (DLSU, UP Diliman, UP Manila, UST, LCUP, BSU, PUP, DYCI, DLSMHSI, MSU-IIT, MDA, DepEd), then a strip of 3 gallery photos.
7. Pre-footer CTA band, then the footer.

**About Us**
1. Navy page header with the breadcrumb Home / About Us.
2. Our Story & Affiliation: 65% narrative, 35% quick-facts card.
3. Vision and Mission cards side by side, then a grid of 5 core value cards.
4. Emblem meaning, on a cream band.
5. National Officers & Executive Board, in rows:
   - Executive: 2 larger cards.
   - Regional VPs: 3 columns.
   - Secretariat, treasury and governance: 4 columns.
   - Social media and tech officers: 3 columns.
6. Theme Group Leaders: 4 cards, each with its leader and mandate.
7. Founding & governance archive as an accordion: 2019 inaugural officers; Constitution, By-Laws and chapter guidelines (PDF placeholder).
8. Closing CTA: "Be Part of Our Growing Community of Practice". Buttons: Apply for Membership / Explore Upcoming Events.

## Work checklist

`TODO.md` (repo root) is the checklist of everything still needed to meet the guide. Check it before starting work, and tick items off as they're completed.

## Known gaps (current code vs. guide)

- The palette and fonts are aligned: the tokens `navy`, `crimson`, `gold`, `cream` etc. are in `styles.css`, with Source Serif 4 for headings. Build new UI from the shared components (`ui.ts`, `SectionHeading`, `PageHeader`, `Card`, `CtaBand`, `Accordion`, `OfficerCard`). Don't write one-off styles.
- The header, footer and nav match the guide. All links go through `navigation.ts`; don't hardcode hrefs.
- Membership, Events, Research & Policy and Mentorship are placeholders (`PlannedSections`) until real copy arrives.
