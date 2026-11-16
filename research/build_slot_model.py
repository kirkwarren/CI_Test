import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as gl

F='Arial'; NAVY='1F3864'; MONEY='$#,##0;($#,##0);-'; PCT='0.0%'
HDR=PatternFill('solid',fgColor=NAVY); YEL=PatternFill('solid',fgColor='FFFF00')
BAND=PatternFill('solid',fgColor='F2F5FA'); IN=Font(name=F,size=10,color='0000FF')
GRN=PatternFill('solid',fgColor='C6EFCE'); RED=PatternFill('solid',fgColor='FFC7CE')
T=Side(style='thin',color='D0D7E5'); BOR=Border(left=T,right=T,top=T,bottom=T)

def hdr(ws,row,labels,w=None):
    for i,h in enumerate(labels,1):
        c=ws.cell(row=row,column=i,value=h)
        c.font=Font(name=F,size=10,bold=True,color='FFFFFF'); c.fill=HDR
        c.alignment=Alignment(horizontal='left',vertical='center',wrap_text=True); c.border=BOR
    ws.row_dimensions[row].height=32
    if w:
        for k,v in w.items(): ws.column_dimensions[k].width=v

def fin(ws,r0,r1,n,wrap=()):
    for r in range(r0,r1+1):
        for c in range(1,n+1):
            cc=ws.cell(row=r,column=c)
            if cc.font.color is None: cc.font=Font(name=F,size=10)
            cc.border=BOR; cc.alignment=Alignment(vertical='top',wrap_text=(gl(c) in wrap))
        if (r-r0)%2==1:
            for c in range(1,n+1):
                if ws.cell(row=r,column=c).fill.fgColor.rgb in (None,'00000000'):
                    ws.cell(row=r,column=c).fill=BAND

LINES=[
 dict(key='attest',name='Interconnection Equipment Evidence package',unit='package (one large-load project)',
      price=45000,gm=0.82,m=[0,0,1,1,1,1,1,1,1,1,1,1],y=[10,26,38,44,48],
      src='Sourcing anchor: single-category strategic-sourcing event $25k-$90k / 8-14 weeks'),
 dict(key='retainer',name='Procurement Desk retainer',unit='active program-month',
      price=18000,gm=0.85,m=[0,0,0,1,1,2,2,3,3,4,4,4],y=[24,120,240,360,444],
      src='Sourcing anchor: embedded/procurement retainers $5k-$25k per month'),
 dict(key='novation',name='Order-position transfer (novation) success fee',unit='completed consented novation',
      price=90000,gm=0.78,m=[0]*12,y=[0,5,14,24,32],
      src='Lehman-equivalent 1.5-3.0% on a $5M order; inside MISO 8.5% soft-cost envelope'),
 dict(key='bench',name='Qualified Buyer Bench + escrow',unit='seat-month',
      price=2500,gm=0.90,m=[0,0,0,0,0,1,1,1,1,2,2,2],y=[13,144,288,432,552],
      src='Escrow 0.10-0.50% on million-dollar deals; bench priced as access subscription'),
]
ROLES=[
 ('Founder - principal (procurement engineering)',190000,[2,2,2,2,2]),
 ('Senior procurement / interconnection engineer',215000,[1,5,10,15,18]),
 ('Expediting & factory-surveillance coordinator',130000,[0,3,6,9,11]),
 ('Credit, escrow & contracts analyst',145000,[0,1,2,3,4]),
 ('Ops / lead-time data analyst',110000,[0,1,3,4,4]),
]
OPEX=[('Legal - consent & novation framework, OEM agreements',85000),
 ('E&O / professional indemnity insurance',42000),('Surety bond',18000),
 ('Lead-time & price data subscriptions',36000),('Travel - factory surveillance & FAT witnessing',95000),
 ('Software (CRM, document, ERP)',24000),('Marketing & conferences',60000),
 ('Accounting, audit & tax',45000)]
OPEX_GROWTH=0.18; CONT=0.10

wb=Workbook()

# ---------------- Assumptions ----------------
ws=wb.active; ws.title='Assumptions'; ws.sheet_view.showGridLines=False
ws['A1']='Transformer Slot Business - Model Assumptions'; ws['A1'].font=Font(name=F,size=16,bold=True,color=NAVY)
ws['A2']='Every blue cell is an input. Annual P&L and Monthly Y1 are formulas off this sheet. Re-sourced 16 November 2026.'
ws['A2'].font=Font(name=F,size=10,italic=True,color='555555')
for k,v in {'A':46,'B':14,'C':12,'D':12,'E':12,'F':12,'G':12,'H':70}.items(): ws.column_dimensions[k].width=v

r=4
ws.cell(row=r,column=1,value='SCENARIO SWITCH').font=Font(name=F,size=12,bold=True,color=NAVY); r+=1
ws.cell(row=r,column=1,value='Volume multiplier applied to every revenue line')
c=ws.cell(row=r,column=2,value=1.00); c.font,c.fill,c.number_format=IN,YEL,'0.00'
ws.cell(row=r,column=8,value='1.00 = base. Try 0.55 for bear, 1.35 for bull. Scales all unit volumes; prices unchanged.')
SCEN=f'$B${r}'; r+=2

ws.cell(row=r,column=1,value='REVENUE LINES').font=Font(name=F,size=12,bold=True,color=NAVY); r+=1
hdr(ws,r,['Revenue line','Price ($)','Y1 units','Y2 units','Y3 units','Y4 units','Y5 units','Pricing basis (sourced)'])
r+=1
LROW={}
for L in LINES:
    ws.cell(row=r,column=1,value=f"{L['name']}  [{L['unit']}]")
    c=ws.cell(row=r,column=2,value=L['price']); c.font,c.fill,c.number_format=IN,YEL,MONEY
    for i,u in enumerate(L['y']):
        c=ws.cell(row=r,column=3+i,value=u); c.font,c.fill,c.number_format=IN,YEL,'#,##0'
    ws.cell(row=r,column=8,value=L['src'])
    LROW[L['key']]=r; r+=1
GMROW={}
ws.cell(row=r,column=1,value='Gross margin by line (non-labour COGS only; all labour sits in payroll)').font=Font(name=F,size=10,bold=True)
r+=1
for L in LINES:
    ws.cell(row=r,column=1,value='   GM% - '+L['name'][:46])
    c=ws.cell(row=r,column=2,value=L['gm']); c.font,c.fill,c.number_format=IN,YEL,PCT
    GMROW[L['key']]=r; r+=1
r+=1

ws.cell(row=r,column=1,value='HEADCOUNT & PAYROLL').font=Font(name=F,size=12,bold=True,color=NAVY); r+=1
hdr(ws,r,['Role','Loaded salary','Y1','Y2','Y3','Y4','Y5','Note'])
r+=1
RROW={}
for nm,sal,yy in ROLES:
    ws.cell(row=r,column=1,value=nm)
    c=ws.cell(row=r,column=2,value=sal); c.font,c.fill,c.number_format=IN,YEL,MONEY
    for i,h in enumerate(yy):
        c=ws.cell(row=r,column=3+i,value=h); c.font,c.fill=IN,YEL
    RROW[nm]=r; r+=1
ws.cell(row=r,column=1,value='Salaries are FULLY LOADED (tax + benefits included) - do not add an uplift.').font=Font(name=F,size=9,italic=True,color='9C0006')
HC_FIRST=min(RROW.values()); HC_LAST=max(RROW.values()); r+=2

ws.cell(row=r,column=1,value='NON-PAYROLL OPEX (Year 1)').font=Font(name=F,size=12,bold=True,color=NAVY); r+=1
OX_FIRST=r+1
hdr(ws,r,['Item','Y1 amount']); r+=1
for nm,amt in OPEX:
    ws.cell(row=r,column=1,value=nm)
    c=ws.cell(row=r,column=2,value=amt); c.font,c.fill,c.number_format=IN,YEL,MONEY
    r+=1
OX_LAST=r-1
ws.cell(row=r,column=1,value='Subtotal')
c=ws.cell(row=r,column=2,value=f'=SUM(B{OX_FIRST}:B{OX_LAST})'); c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
OX_SUB=r; r+=1
ws.cell(row=r,column=1,value='Contingency %')
c=ws.cell(row=r,column=2,value=CONT); c.font,c.fill,c.number_format=IN,YEL,PCT
OX_CONT=r; r+=1
ws.cell(row=r,column=1,value='Year 1 opex total')
c=ws.cell(row=r,column=2,value=f'=B{OX_SUB}*(1+B{OX_CONT})'); c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
OX_Y1=r; r+=1
ws.cell(row=r,column=1,value='Annual opex growth')
c=ws.cell(row=r,column=2,value=OPEX_GROWTH); c.font,c.fill,c.number_format=IN,YEL,PCT
OX_G=r; r+=2

ws.cell(row=r,column=1,value='WORKING CAPITAL & FUNDING').font=Font(name=F,size=12,bold=True,color=NAVY); r+=1
ws.cell(row=r,column=1,value='Debtor days (invoice to cash)')
c=ws.cell(row=r,column=2,value=60); c.font,c.fill=IN,YEL
DD=r; r+=1
ws.cell(row=r,column=1,value='Blended CAC ($ per new logo)')
c=ws.cell(row=r,column=2,value=14000); c.font,c.fill,c.number_format=IN,YEL,MONEY
r+=1
ws.cell(row=r,column=1,value='Retainer annual churn')
c=ws.cell(row=r,column=2,value=0.25); c.font,c.fill,c.number_format=IN,YEL,PCT
r+=1
fin(ws,4,r,8,wrap=('A','H'))

# ---------------- Annual P&L ----------------
ws2=wb.create_sheet('Annual P&L'); ws2.sheet_view.showGridLines=False
ws2['A1']='Annual P&L - Years 1 to 5'; ws2['A1'].font=Font(name=F,size=16,bold=True,color=NAVY)
ws2['A2']='All figures are formulas driven by the Assumptions sheet. Change a driver there and this recomputes.'
ws2['A2'].font=Font(name=F,size=10,italic=True,color='555555')
for k,v in {'A':52,'B':15,'C':15,'D':15,'E':15,'F':15}.items(): ws2.column_dimensions[k].width=v
hdr(ws2,4,['','Year 1','Year 2','Year 3','Year 4','Year 5'])
rr=5
def put(label,bold=False,fill=None):
    global rr
    c=ws2.cell(row=rr,column=1,value=label)
    if bold: c.font=Font(name=F,size=10,bold=True)
    if fill: c.fill=fill
    row=rr; rr+=1; return row

REVROWS=[]
put('REVENUE',bold=True)
for L in LINES:
    row=put('   '+L['name'])
    for i in range(5):
        col=gl(2+i)
        cell=ws2.cell(row=row,column=2+i,
            value=f"=Assumptions!$B${LROW[L['key']]}*Assumptions!{gl(3+i)}${LROW[L['key']]}*Assumptions!{SCEN}")
        cell.number_format=MONEY
    REVROWS.append(row)
TOTREV=put('Total revenue',bold=True)
for i in range(5):
    c=ws2.cell(row=TOTREV,column=2+i,value='='+'+'.join(f'{gl(2+i)}{x}' for x in REVROWS))
    c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
rr+=1
GPROWS=[]
put('GROSS PROFIT',bold=True)
for L,rev in zip(LINES,REVROWS):
    row=put('   '+L['name'])
    for i in range(5):
        c=ws2.cell(row=row,column=2+i,value=f"={gl(2+i)}{rev}*Assumptions!$B${GMROW[L['key']]}")
        c.number_format=MONEY
    GPROWS.append(row)
TOTGP=put('Total gross profit',bold=True)
for i in range(5):
    c=ws2.cell(row=TOTGP,column=2+i,value='='+'+'.join(f'{gl(2+i)}{x}' for x in GPROWS))
    c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
GPM=put('Gross margin %')
for i in range(5):
    c=ws2.cell(row=GPM,column=2+i,value=f'=IFERROR({gl(2+i)}{TOTGP}/{gl(2+i)}{TOTREV},"")'); c.number_format=PCT
rr+=1
put('OPERATING COSTS',bold=True)
HCROW=put('   Headcount (FTE, year end)')
for i in range(5):
    c=ws2.cell(row=HCROW,column=2+i,value=f'=SUM(Assumptions!{gl(3+i)}${HC_FIRST}:{gl(3+i)}${HC_LAST})')
PAY=put('   Payroll (fully loaded)')
for i in range(5):
    c=ws2.cell(row=PAY,column=2+i,
      value=f'=SUMPRODUCT(Assumptions!$B${HC_FIRST}:$B${HC_LAST},Assumptions!{gl(3+i)}${HC_FIRST}:{gl(3+i)}${HC_LAST})')
    c.number_format=MONEY
OPX=put('   Non-payroll opex')
for i in range(5):
    v=f'=Assumptions!$B${OX_Y1}' if i==0 else f'={gl(1+i)}{OPX}*(1+Assumptions!$B${OX_G})'
    c=ws2.cell(row=OPX,column=2+i,value=v); c.number_format=MONEY
TOTC=put('Total operating costs',bold=True)
for i in range(5):
    c=ws2.cell(row=TOTC,column=2+i,value=f'={gl(2+i)}{PAY}+{gl(2+i)}{OPX}')
    c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
rr+=1
EB=put('EBITDA',bold=True)
for i in range(5):
    c=ws2.cell(row=EB,column=2+i,value=f'={gl(2+i)}{TOTGP}-{gl(2+i)}{TOTC}')
    c.number_format=MONEY; c.font=Font(name=F,size=11,bold=True)
EBM=put('EBITDA margin %')
for i in range(5):
    c=ws2.cell(row=EBM,column=2+i,value=f'=IFERROR({gl(2+i)}{EB}/{gl(2+i)}{TOTREV},"")'); c.number_format=PCT
CUM=put('Cumulative EBITDA',bold=True)
for i in range(5):
    v=f'={gl(2)}{EB}' if i==0 else f'={gl(1+i)}{CUM}+{gl(2+i)}{EB}'
    c=ws2.cell(row=CUM,column=2+i,value=v); c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
rr+=1
RPH=put('Revenue per FTE')
for i in range(5):
    c=ws2.cell(row=RPH,column=2+i,value=f'=IFERROR({gl(2+i)}{TOTREV}/{gl(2+i)}{HCROW},"")'); c.number_format=MONEY
NOV=put('Revenue from the UNVALIDATED novation line')
for i in range(5):
    c=ws2.cell(row=NOV,column=2+i,value=f'={gl(2+i)}{REVROWS[2]}'); c.number_format=MONEY
NOVP=put('   as % of total revenue  <-- keep this low; the leg is not proven')
for i in range(5):
    c=ws2.cell(row=NOVP,column=2+i,value=f'=IFERROR({gl(2+i)}{NOV}/{gl(2+i)}{TOTREV},"")'); c.number_format=PCT
    c.font=Font(name=F,size=10,bold=True,color='9C0006')
EXNOV=put('EBITDA EXCLUDING the novation line',bold=True)
for i in range(5):
    c=ws2.cell(row=EXNOV,column=2+i,
      value=f'={gl(2+i)}{EB}-{gl(2+i)}{NOV}*Assumptions!$B${GMROW["novation"]}')
    c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
fin(ws2,5,rr-1,6,wrap=('A',))
ws2.freeze_panes='B5'

# ---------------- Monthly Year 1 ----------------
ws3=wb.create_sheet('Monthly Y1'); ws3.sheet_view.showGridLines=False
ws3['A1']='Year 1 by month - cash trough drives the raise'
ws3['A1'].font=Font(name=F,size=16,bold=True,color=NAVY)
ws3['A2']='Unit ramps are inputs (blue). The peak cumulative cash deficit is the minimum you must raise.'
ws3['A2'].font=Font(name=F,size=10,italic=True,color='555555')
ws3.column_dimensions['A'].width=48
for i in range(12): ws3.column_dimensions[gl(2+i)].width=11
ws3.column_dimensions['N'].width=13
hdr(ws3,4,['']+[f'M{i+1}' for i in range(12)]+['Year 1'])
mr=5
def mput(label,bold=False):
    global mr
    c=ws3.cell(row=mr,column=1,value=label)
    if bold: c.font=Font(name=F,size=10,bold=True)
    row=mr; mr+=1; return row
MUNIT={}
mput('UNITS SOLD (inputs)',bold=True)
for L in LINES:
    row=mput('   '+L['name'])
    for i,u in enumerate(L['m']):
        c=ws3.cell(row=row,column=2+i,value=u); c.font,c.fill=IN,YEL
    c=ws3.cell(row=row,column=14,value=f'=SUM(B{row}:M{row})'); c.font=Font(name=F,size=10,bold=True)
    MUNIT[L['key']]=row
mr+=1
MREV=[]
mput('REVENUE',bold=True)
for L in LINES:
    row=mput('   '+L['name'])
    for i in range(12):
        c=ws3.cell(row=row,column=2+i,
          value=f"={gl(2+i)}{MUNIT[L['key']]}*Assumptions!$B${LROW[L['key']]}*Assumptions!{SCEN}")
        c.number_format=MONEY
    c=ws3.cell(row=row,column=14,value=f'=SUM(B{row}:M{row})'); c.number_format=MONEY
    MREV.append(row)
MTR=mput('Total revenue',bold=True)
for i in list(range(12))+[12]:
    col=2+i if i<12 else 14
    c=ws3.cell(row=MTR,column=col,value='='+'+'.join(f'{gl(col)}{x}' for x in MREV))
    c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
MGP=mput('Gross profit',bold=True)
for i in list(range(12))+[12]:
    col=2+i if i<12 else 14
    c=ws3.cell(row=MGP,column=col,value='+'.join(
        [f'{gl(col)}{rw}*Assumptions!$B${GMROW[L["key"]]}' for L,rw in zip(LINES,MREV)]))
    c.value='='+c.value; c.number_format=MONEY
MPAY=mput('Payroll')
for i in range(12):
    c=ws3.cell(row=MPAY,column=2+i,value=f"='Annual P&L'!$B${PAY}/12"); c.number_format=MONEY
c=ws3.cell(row=MPAY,column=14,value=f'=SUM(B{MPAY}:M{MPAY})'); c.number_format=MONEY
MOPX=mput('Non-payroll opex')
for i in range(12):
    c=ws3.cell(row=MOPX,column=2+i,value=f'=Assumptions!$B${OX_Y1}/12'); c.number_format=MONEY
c=ws3.cell(row=MOPX,column=14,value=f'=SUM(B{MOPX}:M{MOPX})'); c.number_format=MONEY
MEB=mput('EBITDA',bold=True)
for i in list(range(12))+[12]:
    col=2+i if i<12 else 14
    c=ws3.cell(row=MEB,column=col,value=f'={gl(col)}{MGP}-{gl(col)}{MPAY}-{gl(col)}{MOPX}')
    c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
MCASH=mput('Gross profit collected (lagged by debtor days)')
for i in range(12):
    lag=f'=IF({i+1}-ROUND(Assumptions!$B${DD}/30,0)<1,0,INDEX($B${MGP}:$M${MGP},{i+1}-ROUND(Assumptions!$B${DD}/30,0)))'
    c=ws3.cell(row=MCASH,column=2+i,value=lag); c.number_format=MONEY
MCF=mput('Monthly cash flow',bold=True)
for i in range(12):
    c=ws3.cell(row=MCF,column=2+i,
      value=f'={gl(2+i)}{MCASH}-{gl(2+i)}{MPAY}-{gl(2+i)}{MOPX}')
    c.number_format=MONEY
MCUM=mput('Cumulative cash',bold=True)
for i in range(12):
    v=f'=B{MCF}' if i==0 else f'={gl(1+i)}{MCUM}+{gl(2+i)}{MCF}'
    c=ws3.cell(row=MCUM,column=2+i,value=v); c.number_format=MONEY; c.font=Font(name=F,size=10,bold=True)
mr+=1
TR=mput('PEAK CUMULATIVE CASH DEFICIT (the minimum raise)',bold=True)
c=ws3.cell(row=TR,column=2,value=f'=MIN(B{MCUM}:M{MCUM})')
c.number_format=MONEY; c.font=Font(name=F,size=12,bold=True,color='9C0006'); c.fill=YEL
ws3.cell(row=TR,column=4,value='Raise at least 1.8x this for an 18-month buffer.').font=Font(name=F,size=9,italic=True)
fin(ws3,5,mr-1,14)
ws3.freeze_panes='B5'

# ---------------- Evidence ----------------
ws4=wb.create_sheet('Evidence'); ws4.sheet_view.showGridLines=False
ws4['A1']='Sourced evidence base - re-sourced 16 November 2026'
ws4['A1'].font=Font(name=F,size=14,bold=True,color=NAVY)
ws4['A2']=('Live web search only. Direct page fetching is proxy-blocked in this environment, so nothing below was read '
           'from a primary PDF - verify anything you will sign a cheque against.')
ws4['A2'].font=Font(name=F,size=10,italic=True,color='9C0006'); ws4['A2'].alignment=Alignment(wrap_text=True)
ws4.merge_cells('A2:E2'); ws4.row_dimensions[2].height=28
hdr(ws4,4,['Topic','Question','What was established','Figures','Confidence','As of','Sources'],
    {'A':22,'B':58,'C':95,'D':70,'E':16,'F':30,'G':70})
er=5
res=json.load(open('/home/user/CI_Test/research/slot_resource.json'))
for t in res:
    for f in t['findings']:
        ws4.cell(row=er,column=1,value=t['topic'][:60])
        ws4.cell(row=er,column=2,value=f['question'])
        ws4.cell(row=er,column=3,value=f['answer'])
        ws4.cell(row=er,column=4,value=f['figures'])
        cc=ws4.cell(row=er,column=5,value=f['confidence'])
        cc.fill=GRN if f['confidence']=='sourced-strong' else (RED if f['confidence'] in ('not-established','inferred') else YEL)
        ws4.cell(row=er,column=6,value=f['as_of'])
        ws4.cell(row=er,column=7,value='\n'.join(f['sources'][:6]))
        ws4.row_dimensions[er].height=120
        er+=1
fin(ws4,5,er-1,7,wrap=('B','C','D','F','G'))
ws4.freeze_panes='C5'; ws4.auto_filter.ref=f'A4:G{er-1}'

wb.calculation.fullCalcOnLoad=True
out='/home/user/CI_Test/research/slot_exchange_model.xlsx'
wb.save(out)

# ---- independent python check of the same arithmetic
scen=1.0
rev=[sum(L['price']*L['y'][i]*scen for L in LINES) for i in range(5)]
gp=[sum(L['price']*L['y'][i]*scen*L['gm'] for L in LINES) for i in range(5)]
hc=[sum(y[i] for _,_,y in ROLES) for i in range(5)]
pay=[sum(s*y[i] for _,s,y in ROLES) for i in range(5)]
ox1=sum(a for _,a in OPEX)*(1+CONT)
ox=[ox1*(1+OPEX_GROWTH)**i for i in range(5)]
eb=[gp[i]-pay[i]-ox[i] for i in range(5)]
print(f"{'':22}"+''.join(f'{"Y"+str(i+1):>12}' for i in range(5)))
for lbl,arr in [('Revenue',rev),('Gross profit',gp),('Payroll',pay),('Opex',ox),('EBITDA',eb)]:
    print(f'{lbl:22}'+''.join(f'{v/1e6:>11.2f}M' for v in arr))
print(f"{'EBITDA margin':22}"+''.join(f'{eb[i]/rev[i]*100:>11.1f}%' for i in range(5)))
print(f"{'Headcount':22}"+''.join(f'{h:>12}' for h in hc))
print(f"{'Rev / FTE':22}"+''.join(f'{rev[i]/hc[i]/1e3:>11.0f}k' for i in range(5)))
nov=[LINES[2]['price']*LINES[2]['y'][i] for i in range(5)]
print(f"{'Novation % of rev':22}"+''.join(f'{nov[i]/rev[i]*100:>11.1f}%' for i in range(5)))
print('saved', out)
