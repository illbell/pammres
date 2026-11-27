/**
 * Member and partner institutions named in the website guide (homepage
 * "Institutional & University Reach"). Logos are optional: add a file at
 * /public/images/institutions/<slug>.png (or .svg, set `logo`) when PAMMRES supplies it.
 * TODO: move to a Payload `Partners` collection in phase 5.
 */
export type Institution = {
  slug: string
  short: string
  name: string
  logo?: string
}

export const institutions: Institution[] = [
  { slug: 'dlsu', short: 'DLSU', name: 'De La Salle University' },
  { slug: 'up-diliman', short: 'UP Diliman', name: 'University of the Philippines Diliman' },
  { slug: 'up-manila', short: 'UP Manila', name: 'University of the Philippines Manila' },
  { slug: 'ust', short: 'UST', name: 'University of Santo Tomas' },
  { slug: 'lcup', short: 'LCUP', name: 'La Consolacion University Philippines' },
  { slug: 'bsu', short: 'BSU', name: 'Bulacan State University' },
  { slug: 'pup', short: 'PUP', name: 'Polytechnic University of the Philippines' },
  { slug: 'dyci', short: 'DYCI', name: "Dr. Yanga's Colleges, Inc." },
  {
    slug: 'dlsmhsi',
    short: 'DLSMHSI',
    name: 'De La Salle Medical and Health Sciences Institute',
  },
  { slug: 'msu-iit', short: 'MSU-IIT', name: 'MSU–Iligan Institute of Technology' },
  { slug: 'mda', short: 'MDA', name: 'Mater Dei Academy' },
  { slug: 'deped', short: 'DepEd', name: 'Department of Education' },
  // Member institutions from the client's member roster (2026-11-27)
  { slug: 'batstateu', short: 'BatStateU', name: 'Batangas State University' },
  { slug: 'uep', short: 'UEP', name: 'University of Eastern Pangasinan' },
  { slug: 'ctu', short: 'CTU', name: 'Cebu Technological University' },
  { slug: 'mvc', short: 'MVC', name: 'Mountain View College' },
  { slug: 'lcc', short: 'LCC', name: 'Lipa City Colleges' },
  { slug: 'msu-sulu', short: 'MSU-Sulu', name: 'Mindanao State University – Sulu' },
  { slug: 'lcba', short: 'LCBA', name: 'Laguna College of Business and Arts' },
  { slug: 'unm', short: 'UNM', name: 'University of Northwestern Mindanao' },
  { slug: 'adamson', short: 'AdU', name: 'Adamson University' },
  { slug: 'admu', short: 'ADMU', name: 'Ateneo de Manila University' },
  { slug: 'lnu', short: 'LNU', name: 'Leyte Normal University' },
  { slug: 'ceu-malolos', short: 'CEU Malolos', name: 'Centro Escolar University – Malolos' },
  { slug: 'nwssu', short: 'NwSSU', name: 'Northwest Samar State University' },
  {
    slug: 'up-pepp',
    short: 'UP PEPP',
    name: 'University of the Philippines Extension Program in Pampanga',
  },
  { slug: 'uphsd', short: 'UPHSD', name: 'University of Perpetual Help System DALTA' },
  { slug: 'cup', short: 'CUP', name: 'City University of Pasay' },
]
