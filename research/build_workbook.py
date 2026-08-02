import json, os, re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo

S = '/tmp/claude-0/-home-user-CI-Test/d04a24df-be6d-588e-a238-a2d3ef4442d6/scratchpad'
d = json.load(open('/home/user/CI_Test/research/dataset.json'))
opps = {o['id']: o for o in d['opportunities']}
scores = d['scores']
verd = d['verification_verdicts']
sel = d['selection']

# ---- provenance: which screening batch checked each id, and how many live searches it had
prov = {}
for i in range(1, 10):
    f = f'{S}/pool/screen_batch_{i}.json'
    if not os.path.exists(f):
        continue
    for o in json.load(open(f)):
        prov[o['id']] = 'Search-backed' if i <= 6 else 'Thin'
for k in scores:
    prov.setdefault(k, 'Recall-only')

TIER_ORDER = {'Search-backed': 0, 'Thin': 1, 'Recall-only': 2}

FONT = 'Arial'
NAVY = '1F3864'
HDR_FILL = PatternFill('solid', fgColor=NAVY)
BAND = PatternFill('solid', fgColor='F2F5FA')
YELLOW = PatternFill('solid', fgColor='FFFF00')
TIER_FILL = {
    'Search-backed': PatternFill('solid', fgColor='C6EFCE'),
    'Thin': PatternFill('solid', fgColor='FFEB9C'),
    'Recall-only': PatternFill('solid', fgColor='FFC7CE'),
}
TIER_FONT = {
    'Search-backed': Font(name=FONT, size=10, color='006100'),
    'Thin': Font(name=FONT, size=10, color='9C6500'),
    'Recall-only': Font(name=FONT, size=10, color='9C0006'),
}
THIN = Side(style='thin', color='D0D7E5')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

wb = Workbook()

def style_header(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.font = Font(name=FONT, size=10, bold=True, color='FFFFFF')
        cell.fill = HDR_FILL
        cell.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
        cell.border = BORDER
    ws.row_dimensions[row].height = 30

def widths(ws, spec):
    for col, w in spec.items():
        ws.column_dimensions[col].width = w

def body(ws, r0, r1, ncols, wrap_cols=()):
    for r in range(r0, r1 + 1):
        for c in range(1, ncols + 1):
            cell = ws.cell(row=r, column=c)
            if not cell.font or cell.font.name != FONT:
                cell.font = Font(name=FONT, size=10)
            cell.border = BORDER
            cell.alignment = Alignment(
                vertical='top',
                wrap_text=(get_column_letter(c) in wrap_cols),
            )
        if (r - r0) % 2 == 1:
            for c in range(1, ncols + 1):
                if ws.cell(row=r, column=c).fill.fgColor.rgb in (None, '00000000'):
                    ws.cell(row=r, column=c).fill = BAND

# =====================================================================
# Sheet 1 — Overview
# =====================================================================
ws = wb.active
ws.title = 'Overview'
ws.sheet_view.showGridLines = False
widths(ws, {'A': 34, 'B': 14, 'C': 13, 'D': 13, 'E': 13, 'F': 60})

ws['A1'] = 'Twenty-Five Untapped Opportunities'
ws['A1'].font = Font(name=FONT, size=18, bold=True, color=NAVY)
ws['A2'] = 'Research date: 2 August 2026  ·  15 discovery lenses  ·  172 raw candidates  ·  77 distinct opportunities  ·  25 selected'
ws['A2'].font = Font(name=FONT, size=10, italic=True, color='555555')

r = 4
ws.cell(row=r, column=1, value='READ THIS FIRST').font = Font(name=FONT, size=12, bold=True, color='9C0006')
r += 1
for line in [
    "The session's 200-call web-search budget was exhausted partway through this study.",
    'Every finding carries an evidence tier recording what its competitor check was actually worth.',
    'The adversarial verification pass ran with ZERO live searches, so its objections are recorded as open',
    'diligence questions, never as verdicts. The planned "refuted by both lenses = disqualified" rule was',
    'abandoned for that reason - applying it would have deleted the pool on an unusable measurement.',
    '',
    'The tier rates the COMPETITOR CHECK, not the discovery. The scout stage ran 41-84 live queries per lens',
    'before the budget died, so the "why now" triggers generally rest on real search results. On a Recall-only',
    'finding, trust the trigger considerably more than the claim that the space is empty.',
]:
    ws.cell(row=r, column=1, value=line).font = Font(name=FONT, size=10)
    r += 1

r += 1
ws.cell(row=r, column=1, value='Evidence tiers').font = Font(name=FONT, size=12, bold=True, color=NAVY)
r += 1
tier_hdr = r
for i, h in enumerate(['Tier', 'In top 25', 'In full pool', 'Meaning'], start=1):
    ws.cell(row=r, column=i, value=h)
style_header(ws, r, 4)
ws.merge_cells(start_row=r, start_column=4, end_row=r, end_column=6)
r += 1
tier_rows = {}
for tier, meaning in [
    ('Search-backed', 'Crowding checked with roughly 30 live competitor queries'),
    ('Thin', 'Only 2-3 live queries before the search budget ran out'),
    ('Recall-only', 'No live crowding search; competitors named from model recall'),
]:
    ws.cell(row=r, column=1, value=tier).fill = TIER_FILL[tier]
    ws.cell(row=r, column=1).font = TIER_FONT[tier]
    ws.cell(row=r, column=2, value=f"=COUNTIF('Top 25'!$E:$E,$A{r})")
    ws.cell(row=r, column=3, value=f"=COUNTIF('Screening Scores'!$C:$C,$A{r})")
    ws.cell(row=r, column=4, value=meaning)
    ws.merge_cells(start_row=r, start_column=4, end_row=r, end_column=6)
    tier_rows[tier] = r
    r += 1
ws.cell(row=r, column=1, value='Total').font = Font(name=FONT, size=10, bold=True)
ws.cell(row=r, column=2, value=f'=SUM(B{tier_hdr+1}:B{r-1})').font = Font(name=FONT, size=10, bold=True)
ws.cell(row=r, column=3, value=f'=SUM(C{tier_hdr+1}:C{r-1})').font = Font(name=FONT, size=10, bold=True)
body(ws, tier_hdr + 1, r, 3)
r += 2

# ---- scoring weights (the model's only real inputs)
ws.cell(row=r, column=1, value='Scoring weights').font = Font(name=FONT, size=12, bold=True, color=NAVY)
ws.cell(row=r, column=2, value='Edit the yellow cells to re-rank the whole workbook').font = Font(
    name=FONT, size=9, italic=True, color='555555')
ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6)
r += 1
W_HDR = r
for i, h in enumerate(['Dimension', 'Weight', 'Meaning of a 10'], start=1):
    ws.cell(row=r, column=i, value=h)
style_header(ws, r, 3)
ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=6)
r += 1
W_FIRST = r
for dim, wt, meaning in [
    ('Overlooked', 0.28, 'Essentially nobody is building this, verified by search'),
    ('Inflection (3-5 yr)', 0.24, 'Near-certain to be a large market by 2029-2031'),
    ('Buildable today', 0.20, 'A 1-3 person team ships a real wedge in 90 days'),
    ('Market size', 0.16, 'Multi-billion addressable'),
    ('Defensibility', 0.12, 'Strong compounding moat'),
]:
    ws.cell(row=r, column=1, value=dim)
    c = ws.cell(row=r, column=2, value=wt)
    c.font = Font(name=FONT, size=10, color='0000FF')
    c.fill = YELLOW
    c.number_format = '0.00'
    ws.cell(row=r, column=3, value=meaning)
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=6)
    r += 1
W_LAST = r - 1
ws.cell(row=r, column=1, value='Total').font = Font(name=FONT, size=10, bold=True)
tot = ws.cell(row=r, column=2, value=f'=SUM(B{W_FIRST}:B{W_LAST})')
tot.font = Font(name=FONT, size=10, bold=True)
tot.number_format = '0.00'
ws.cell(row=r, column=3, value='Must equal 1.00').font = Font(name=FONT, size=9, italic=True, color='555555')
body(ws, W_FIRST, r, 3)
W_ROW = {'overlooked': W_FIRST, 'inflection_3_5yr': W_FIRST + 1, 'buildable_today': W_FIRST + 2,
         'market_size': W_FIRST + 3, 'defensibility': W_FIRST + 4}
r += 2

ws.cell(row=r, column=1, value='Sheets in this workbook').font = Font(name=FONT, size=12, bold=True, color=NAVY)
r += 1
for nm, desc in [
    ('Top 25', 'The ranked selection, with scores, evidence tier and selection rationale'),
    ('All Opportunities', 'All 77 distinct opportunities that survived de-duplication'),
    ('Screening Scores', 'Every screening score, competitor check and kill risk'),
    ('Verification', 'Adversarial objections - open questions, not verdicts'),
    ('Honorable Mentions', 'The 12 that just missed the cut'),
]:
    ws.cell(row=r, column=1, value=nm).font = Font(name=FONT, size=10, bold=True)
    ws.cell(row=r, column=2, value=desc).font = Font(name=FONT, size=10)
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6)
    r += 1
r += 1
notes = (
    'Source: research/dataset.json in this repository; see research/METHODOLOGY.md for the full pipeline and '
    'coverage limitations. Composite scores on every sheet are live formulas driven by the yellow weight cells '
    'above, so changing a weight re-scores all 77 opportunities at once.\n'
    'Data note: one screening agent recorded a composite of 4.92 for '
    '"rec-e-invoicing-mandate-plumbing-for-us-mid-market-erps" where the stated weights give 4.64. The workbook '
    'computes every composite from the weights, so it shows the corrected 4.64. That opportunity was not in the '
    'top 25, so the selection is unaffected. All 76 other composites reproduce exactly.\n'
    'Build note: LibreOffice is non-functional in the environment that produced this file, so formulas were '
    'written without cached values and could not be machine-recalculated. Recalculate-on-load is set, and every '
    'formula uses only SUM, ROUND, COUNTIF, INDEX, MATCH and IFERROR. If any cell looks blank, press Ctrl-Alt-F9.')
ws.cell(row=r, column=1, value=notes).font = Font(name=FONT, size=9, italic=True, color='555555')
ws.cell(row=r, column=1).alignment = Alignment(wrap_text=True, vertical='top')
ws.merge_cells(start_row=r, start_column=1, end_row=r + 4, end_column=6)
for rr in range(r, r + 5):
    ws.row_dimensions[rr].height = 26

def composite_formula(sheet_row, col_map):
    """Weighted composite referencing the Overview weight cells."""
    parts = [f"{col_map[k]}{sheet_row}*Overview!$B${W_ROW[k]}" for k in
             ['overlooked', 'inflection_3_5yr', 'buildable_today', 'market_size', 'defensibility']]
    return '=ROUND(' + '+'.join(parts) + ',2)'

# =====================================================================
# Sheet 2 — Top 25
# =====================================================================
ws = wb.create_sheet('Top 25')
ws.sheet_view.showGridLines = False
cols = ['Rank', 'Opportunity', 'Category', 'ID', 'Evidence', 'Overlooked', 'Inflection', 'Buildable',
        'Market', 'Defensibility', 'Composite', 'The wedge', 'Why this rank', 'What kills it',
        'Open questions from adversarial review']
for i, h in enumerate(cols, start=1):
    ws.cell(row=1, column=i, value=h)
style_header(ws, 1, len(cols))
widths(ws, {'A': 6, 'B': 46, 'C': 22, 'D': 34, 'E': 14, 'F': 10, 'G': 10, 'H': 10, 'I': 9,
            'J': 12, 'K': 11, 'L': 70, 'M': 70, 'N': 60, 'O': 60})
CM = {'overlooked': 'F', 'inflection_3_5yr': 'G', 'buildable_today': 'H',
      'market_size': 'I', 'defensibility': 'J'}
CATNAME = {'regulatory-clock': 'Regulatory clock', 'physical-industrial': 'Physical / industrial',
           'ai-second-order': 'AI second-order', 'infrastructure-standards': 'Infrastructure & standards',
           'boring-vertical': 'Boring vertical', 'graveyard-revival': 'Graveyard revival',
           'global-markets': 'Global markets', 'demographic': 'Demographic',
           'consumer-culture': 'Consumer culture', 'research-commercial': 'Research-to-market'}

row = 2
for x in sel['final_25']:
    sid = x['id']
    s = scores.get(sid, {})
    o = opps.get(sid, {})
    tier = prov.get(sid, 'Recall-only')
    ws.cell(row=row, column=1, value=x['rank'])
    ws.cell(row=row, column=2, value=x['name'])
    ws.cell(row=row, column=3, value=CATNAME.get(x['category'], x['category']))
    ws.cell(row=row, column=4, value=sid)
    tc = ws.cell(row=row, column=5, value=tier)
    tc.fill = TIER_FILL[tier]
    tc.font = TIER_FONT[tier]
    for k, col in CM.items():
        ws[f'{col}{row}'] = s.get(k)
    cc = ws.cell(row=row, column=11, value=composite_formula(row, CM))
    cc.number_format = '0.00'
    cc.font = Font(name=FONT, size=10, bold=True)
    ws.cell(row=row, column=12, value=x.get('one_line'))
    ws.cell(row=row, column=13, value=x.get('why_this_rank'))
    ws.cell(row=row, column=14, value=s.get('kill_risk'))
    objs = verd.get(sid, [])
    ws.cell(row=row, column=15, value='\n\n'.join(
        f"[{v.get('lens','lens')}] {v.get('strongest_objection','')}" for v in objs) or 'Not selected for verification')
    ws.row_dimensions[row].height = 62
    row += 1
body(ws, 2, row - 1, len(cols), wrap_cols=('B', 'L', 'M', 'N', 'O'))
ws.freeze_panes = 'C2'
ws.auto_filter.ref = f'A1:{get_column_letter(len(cols))}{row-1}'

# =====================================================================
# Sheet 3 — All Opportunities
# =====================================================================
ws = wb.create_sheet('All Opportunities')
ws.sheet_view.showGridLines = False
cols = ['ID', 'Opportunity', 'In top 25?', 'Rank', 'Evidence', 'Composite', 'Verdict',
        'Thesis', 'Why now', 'Why overlooked', 'The 90-day wedge', 'Discovery lens', 'Sources']
for i, h in enumerate(cols, start=1):
    ws.cell(row=1, column=i, value=h)
style_header(ws, 1, len(cols))
widths(ws, {'A': 34, 'B': 46, 'C': 11, 'D': 7, 'E': 14, 'F': 11, 'G': 11,
            'H': 70, 'I': 70, 'J': 70, 'K': 70, 'L': 34, 'M': 46})
rank_by_id = {x['id']: x['rank'] for x in sel['final_25']}
row = 2
for oid, o in sorted(opps.items(), key=lambda kv: (rank_by_id.get(kv[0], 999), kv[0])):
    s = scores.get(oid, {})
    tier = prov.get(oid, 'Recall-only')
    ws.cell(row=row, column=1, value=oid)
    ws.cell(row=row, column=2, value=o.get('name'))
    ws.cell(row=row, column=3, value='Yes' if oid in rank_by_id else 'No')
    if oid in rank_by_id:
        ws.cell(row=row, column=4, value=rank_by_id[oid])
    tc = ws.cell(row=row, column=5, value=tier)
    tc.fill = TIER_FILL[tier]
    tc.font = TIER_FONT[tier]
    # Pull the composite from the Screening Scores sheet so both stay in step with the
    # weight cells (and so a screener's arithmetic slip cannot survive in two places).
    cf = ws.cell(row=row, column=6,
                 value=f"=IFERROR(INDEX('Screening Scores'!$I:$I,"
                       f"MATCH($A{row},'Screening Scores'!$A:$A,0)),\"\")")
    cf.number_format = '0.00'
    ws.cell(row=row, column=7, value=s.get('verdict'))
    ws.cell(row=row, column=8, value=o.get('thesis'))
    ws.cell(row=row, column=9, value=o.get('why_now'))
    ws.cell(row=row, column=10, value=o.get('why_overlooked'))
    ws.cell(row=row, column=11, value=o.get('buildable_today'))
    ws.cell(row=row, column=12, value='; '.join(str(l) for l in (o.get('source_lenses') or [])))
    ws.cell(row=row, column=13, value='\n'.join((o.get('evidence_urls') or [])[:12]))
    ws.row_dimensions[row].height = 58
    row += 1
body(ws, 2, row - 1, len(cols), wrap_cols=('B', 'H', 'I', 'J', 'K', 'L', 'M'))
ws.freeze_panes = 'C2'
ws.auto_filter.ref = f'A1:{get_column_letter(len(cols))}{row-1}'

# =====================================================================
# Sheet 4 — Screening Scores
# =====================================================================
ws = wb.create_sheet('Screening Scores')
ws.sheet_view.showGridLines = False
cols = ['ID', 'Opportunity', 'Evidence', 'Overlooked', 'Inflection', 'Buildable', 'Market',
        'Defensibility', 'Composite', 'Verdict', 'Competitor check (what the searches found)', 'What kills it']
for i, h in enumerate(cols, start=1):
    ws.cell(row=1, column=i, value=h)
style_header(ws, 1, len(cols))
widths(ws, {'A': 34, 'B': 46, 'C': 14, 'D': 10, 'E': 10, 'F': 10, 'G': 9, 'H': 12,
            'I': 11, 'J': 11, 'K': 90, 'L': 70})
CM2 = {'overlooked': 'D', 'inflection_3_5yr': 'E', 'buildable_today': 'F',
       'market_size': 'G', 'defensibility': 'H'}
row = 2
for sid, s in sorted(scores.items(), key=lambda kv: (TIER_ORDER[prov.get(kv[0], 'Recall-only')],
                                                     -(kv[1].get('composite') or 0))):
    tier = prov.get(sid, 'Recall-only')
    ws.cell(row=row, column=1, value=sid)
    ws.cell(row=row, column=2, value=opps.get(sid, {}).get('name'))
    tc = ws.cell(row=row, column=3, value=tier)
    tc.fill = TIER_FILL[tier]
    tc.font = TIER_FONT[tier]
    for k, col in CM2.items():
        ws[f'{col}{row}'] = s.get(k)
    cc = ws.cell(row=row, column=9, value=composite_formula(row, CM2))
    cc.number_format = '0.00'
    cc.font = Font(name=FONT, size=10, bold=True)
    ws.cell(row=row, column=10, value=s.get('verdict'))
    ws.cell(row=row, column=11, value=s.get('crowding_check'))
    ws.cell(row=row, column=12, value=s.get('kill_risk'))
    ws.row_dimensions[row].height = 58
    row += 1
body(ws, 2, row - 1, len(cols), wrap_cols=('B', 'K', 'L'))
ws.freeze_panes = 'C2'
ws.auto_filter.ref = f'A1:{get_column_letter(len(cols))}{row-1}'

# =====================================================================
# Sheet 5 — Verification
# =====================================================================
ws = wb.create_sheet('Verification')
ws.sheet_view.showGridLines = False
ws['A1'] = ('These objections were produced WITHOUT any live web search - the budget was exhausted before this '
            'stage ran. Verifiers were told to default to "refuted" on thin evidence, and the evidence was '
            'maximally thin, so the ~90% refutation rate is an artifact and does not discriminate between strong '
            'and weak ideas. Treat every row as a diligence question to answer, not a verdict to act on.')
ws['A1'].font = Font(name=FONT, size=10, bold=True, color='9C0006')
ws['A1'].alignment = Alignment(wrap_text=True, vertical='top')
ws.merge_cells('A1:G1')
ws.row_dimensions[1].height = 58

cols = ['ID', 'Opportunity', 'Refuted?', 'Confidence', 'Strongest objection',
        'What would have to be true', 'What the verifier could actually check']
for i, h in enumerate(cols, start=1):
    ws.cell(row=3, column=i, value=h)
style_header(ws, 3, len(cols))
widths(ws, {'A': 34, 'B': 42, 'C': 10, 'D': 11, 'E': 85, 'F': 60, 'G': 85})
row = 4
for sid, vs in sorted(verd.items()):
    for v in vs:
        ws.cell(row=row, column=1, value=sid)
        ws.cell(row=row, column=2, value=opps.get(sid, {}).get('name'))
        rc = ws.cell(row=row, column=3, value='Refuted' if v.get('refuted') else 'Survived')
        rc.fill = TIER_FILL['Recall-only'] if v.get('refuted') else TIER_FILL['Search-backed']
        rc.font = TIER_FONT['Recall-only'] if v.get('refuted') else TIER_FONT['Search-backed']
        ws.cell(row=row, column=4, value=v.get('confidence'))
        ws.cell(row=row, column=5, value=v.get('strongest_objection'))
        ws.cell(row=row, column=6, value=v.get('what_would_have_to_be_true'))
        ws.cell(row=row, column=7, value=v.get('evidence'))
        ws.row_dimensions[row].height = 62
        row += 1
body(ws, 4, row - 1, len(cols), wrap_cols=('B', 'E', 'F', 'G'))
ws.freeze_panes = 'C4'
ws.auto_filter.ref = f'A3:{get_column_letter(len(cols))}{row-1}'

# =====================================================================
# Sheet 6 — Honorable Mentions
# =====================================================================
ws = wb.create_sheet('Honorable Mentions')
ws.sheet_view.showGridLines = False
ws.cell(row=1, column=1, value='#')
ws.cell(row=1, column=2, value='Opportunity - and why it just missed')
style_header(ws, 1, 2)
widths(ws, {'A': 6, 'B': 130})
row = 2
for i, h in enumerate(sel['honorable_mentions'], start=1):
    ws.cell(row=row, column=1, value=i)
    ws.cell(row=row, column=2, value=h)
    ws.row_dimensions[row].height = 46
    row += 1
body(ws, 2, row - 1, 2, wrap_cols=('B',))

# ---- diversity note appended below
row += 1
ws.cell(row=row, column=1, value='On the shape of the final 25').font = Font(name=FONT, size=12, bold=True, color=NAVY)
row += 1
ws.cell(row=row, column=2, value=sel['diversity_note'])
ws.cell(row=row, column=2).alignment = Alignment(wrap_text=True, vertical='top')
ws.cell(row=row, column=2).font = Font(name=FONT, size=10)
ws.row_dimensions[row].height = 300

# LibreOffice cannot run in this sandbox, so openpyxl's formulas ship without cached
# values. Force Excel / Sheets / Numbers to compute them the moment the file opens.
wb.calculation.fullCalcOnLoad = True

out = '/home/user/CI_Test/research/opportunities.xlsx'
wb.save(out)
print('saved', out)

# ---- verify the composite arithmetic independently of any spreadsheet engine.
# The workbook formula encodes exactly this weighted sum; if it reproduces the
# composite the screening agents recorded, the formula is right.
W = {'overlooked': 0.28, 'inflection_3_5yr': 0.24, 'buildable_today': 0.20,
     'market_size': 0.16, 'defensibility': 0.12}
assert abs(sum(W.values()) - 1.0) < 1e-9, 'weights must sum to 1.00'
bad = []
for sid, s in scores.items():
    if any(s.get(k) is None for k in W):
        bad.append((sid, 'missing subscore'))
        continue
    calc = round(sum(s[k] * w for k, w in W.items()), 2)
    rec = s.get('composite')
    if rec is None or abs(calc - rec) > 0.011:
        bad.append((sid, f'recorded {rec} vs weights {calc}'))
print(f'composite check: {len(scores)-len(bad)}/{len(scores)} agree with the weighted formula')
for sid, why in bad[:12]:
    print('  MISMATCH', sid, why)
