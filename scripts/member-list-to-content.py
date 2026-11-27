"""Turn the client's member roster workbook into the site's content files.

    python -I scripts/member-list-to-content.py PAMMER_Memberslist_2026-11-27.xlsx

The workbook holds personal data (mobile numbers, emails, home addresses) and
is git-ignored. This script copies ONLY an allow-list of columns into:

  src/app/(frontend)/content/member-directory.ts   (the public /members page)
  src/app/(frontend)/content/publications.ts       (Resources: member publications)

and refuses to write if any output still looks like an email or phone number.
Standard library only (no xlsx package is installed). Re-run it whenever the
client sends an updated roster, then review the diff before committing.
"""

import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'src' / 'app' / '(frontend)' / 'content'
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

MEMBER_SHEET = 'Members_by_HEI_Alphabetical'
BIB_SHEET = 'Bibliography_Catalog'

# Members sheet: header row 3. Only these columns are ever read.
MEMBER_COLUMNS = {
    'A': 'id',
    'B': 'institution',
    'C': 'name',
    'O': 'position',
    'P': 'education',
    'S': 'published',
    'T': 'ongoing',
    'V': 'interests',
}
# Bibliography sheet: header row 2.
BIB_COLUMNS = {'B': 'memberId', 'C': 'institution', 'D': 'author', 'E': 'status', 'F': 'title'}

UNSPECIFIED = 'Unspecified / Independent'
INSTITUTION_ALIASES = {
    'NA': UNSPECIFIED,
    'N/A': UNSPECIFIED,
    '': UNSPECIFIED,
    'Mater Dei Academy of Sta. Maria, Bulacan, Inc.': 'Mater Dei Academy (MDA)',
    'Mater Dei Academy': 'Mater Dei Academy (MDA)',
}

# The four research interest groups offered on the membership form.
CORE_INTERESTS = {
    'educational research': 'Educational Research',
    'educational': 'Educational Research',
    'research methodology': 'Research Methodology',
    'science research': 'Science Research',
    'science': 'Science Research',
    'business research': 'Business Research',
    'business': 'Business Research',
}

METHOD_WORDS = re.compile(
    r'quantitative|qualitative|mixed|systematic|review|case study|survey|experimental|'
    r'descriptive|correlational|phenomenolog|ethnograph|meta-analysis|action research|design|'
    r'^quan$|^qual$|formative|hermeneutic',
    re.I,
)
EMAIL = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
PHONE = re.compile(r'(?:\+?63|0)?9\d{9}\b')


def read_sheets(path):
    z = zipfile.ZipFile(path)
    strings = [
        ''.join(t.text or '' for t in si.iter(NS + 't'))
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).iter(NS + 'si')
    ]
    workbook = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    targets = {r.get('Id'): r.get('Target') for r in rels}
    rid = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
    sheets = {}
    for s in workbook.iter(NS + 'sheet'):
        target = targets[s.get(rid)].lstrip('/')
        target = target if target.startswith('xl/') else 'xl/' + target
        rows = []
        for r in ET.fromstring(z.read(target)).iter(NS + 'row'):
            cells = {}
            for c in r.iter(NS + 'c'):
                v = c.find(NS + 'v')
                if c.get('t') == 's' and v is not None:
                    value = strings[int(v.text)]
                elif c.get('t') == 'inlineStr':
                    value = ''.join(t.text or '' for t in c.iter(NS + 't'))
                else:
                    value = v.text if v is not None else ''
                cells[re.match(r'[A-Z]+', c.get('r')).group()] = value
            rows.append(cells)
        sheets[s.get('name')] = rows
    return sheets


def pick(row, columns):
    return {key: clean(row.get(col, '')) for col, key in columns.items()}


def clean(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()


def to_int(value):
    try:
        return int(float(value))
    except ValueError:
        return 0


def institution_name(value):
    return INSTITUTION_ALIASES.get(value, value)


def split_interests(value):
    out = []
    for part in re.split(r'[;\n]', value):
        part = part.strip().rstrip('.')
        if not part:
            continue
        lowered = part.lower()
        if lowered.startswith('others'):
            for extra in re.split(r',', part.split(':', 1)[-1]):
                extra = extra.strip().replace("Dev't", 'Development')
                if extra:
                    out.append(extra[0].upper() + extra[1:])
            continue
        matched = False
        for piece in re.split(r',', part):
            name = CORE_INTERESTS.get(piece.strip().lower())
            if name:
                out.append(name)
                matched = True
        if not matched:
            out.append(part)
    seen = []
    for i in out:
        if i not in seen:
            seen.append(i)
    return seen


def parse_title(raw):
    """'Title (2024; Journal; Method)' -> title, year, venue."""
    raw = re.sub(r'^\d+\.\s*', '', raw).strip()
    if not raw.endswith(')'):
        return raw, None, None
    # Find the "(" that matches the final ")"; venues can hold their own brackets.
    depth = 0
    for start in range(len(raw) - 1, -1, -1):
        depth += {')': 1, '(': -1}.get(raw[start], 0)
        if depth == 0:
            break
    inside = raw[start + 1 : -1]
    if start == 0 or ';' not in inside and not re.search(r'(19|20)\d{2}', inside):
        return raw, None, None
    title = raw[:start].strip()
    year, venue = None, []
    for part in (p.strip() for p in inside.split(';')):
        if not part:
            continue
        if re.fullmatch(r'(19|20)\d{2}', part):
            year = part
        elif METHOD_WORDS.search(part) and len(part) < 80:
            continue
        else:
            venue.append(part)
    return title, year, '; '.join(venue) or None


def ts_const(name, type_name, value):
    return f'export const {name}: {type_name} = {json.dumps(value, ensure_ascii=False, indent=2)}\n'


def main(path):
    sheets = read_sheets(path)

    members = []
    for row in sheets[MEMBER_SHEET][3:]:
        m = pick(row, MEMBER_COLUMNS)
        if not m['id'].startswith('PAMMRES-') or not m['name']:
            continue
        members.append(
            {
                'id': m['id'],
                'name': m['name'],
                'institution': institution_name(m['institution']),
                'position': m['position'] or None,
                'education': m['education'] or None,
                'interests': split_interests(m['interests']),
                'published': to_int(m['published']),
                'ongoing': to_int(m['ongoing']),
            }
        )
    members = [{k: v for k, v in m.items() if v is not None} for m in members]
    members.sort(key=lambda m: (m['institution'] == UNSPECIFIED, m['institution'].lower(), m['name'].lower()))

    publications = []
    for row in sheets[BIB_SHEET][2:]:
        b = pick(row, BIB_COLUMNS)
        if b['status'] != 'Published' or not b['title']:
            continue
        title, year, venue = parse_title(b['title'])
        entry = {'title': title, 'author': b['author'], 'institution': institution_name(b['institution'])}
        if year:
            entry['year'] = year
        if venue:
            entry['venue'] = venue
        publications.append(entry)
    publications.sort(key=lambda p: (p['institution'].lower(), p['author'].lower(), p['title'].lower()))

    interest_groups = {}
    for name in ['Educational Research', 'Research Methodology', 'Science Research', 'Business Research']:
        interest_groups[name] = sum(1 for m in members if name in m['interests'])

    totals = {
        'members': len(members),
        'published': sum(m['published'] for m in members),
        'ongoing': sum(m['ongoing'] for m in members),
    }

    stamp = f'// Generated by scripts/member-list-to-content.py from the client roster ({date.today().isoformat()}).\n// Do not edit by hand: update the workbook and re-run the script.\n\n'

    directory = (
        stamp
        + 'export type DirectoryMember = {\n  id: string\n  name: string\n  institution: string\n'
        '  position?: string\n  education?: string\n  interests: string[]\n  published: number\n  ongoing: number\n}\n\n'
        + ts_const('rosterTotals', '{ members: number; published: number; ongoing: number }', totals)
        + '\n/** Members per research interest group (the four groups on the membership form). */\n'
        + ts_const('interestGroupCounts', 'Record<string, number>', interest_groups)
        + '\n'
        + ts_const('directoryMembers', 'DirectoryMember[]', members)
    )
    pubs = (
        stamp
        + 'export type MemberPublication = {\n  title: string\n  author: string\n  institution: string\n'
        '  year?: string\n  venue?: string\n}\n\n'
        + ts_const('memberPublications', 'MemberPublication[]', publications)
    )

    for text in (directory, pubs):
        leak = EMAIL.search(text) or PHONE.search(text)
        if leak:
            sys.exit(f'Refusing to write: output contains what looks like contact data: {leak.group()!r}')

    (CONTENT / 'member-directory.ts').write_text(directory, encoding='utf-8')
    (CONTENT / 'publications.ts').write_text(pubs, encoding='utf-8')
    print(f"{totals['members']} members, {len(publications)} published studies, interest groups {interest_groups}")


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
