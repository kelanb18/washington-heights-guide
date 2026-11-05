import os,re,sys,glob,subprocess
sys.path.insert(0,'.')
from data import G
STORE='/cursor/stores/store-3f12b6cc-4fc4-4eae-b9c5-c2fbde41bcc2/heights'
OUT=STORE+'/queue/guides1/guides'
main=set(os.path.basename(f)[:-3] for f in glob.glob('/workspace/whg/src/content/listings/*.md'))
b3=set(os.path.basename(f)[:-3] for f in glob.glob(STORE+'/queue/batch3/listings/*.md'))
areas=set(os.path.basename(f)[:-3] for f in glob.glob('/workspace/whg/src/content/areas/*.md'))
# sources
src={};cur=None
for l in open('/workspace/sources.txt'):
    l=l.strip()
    if l.startswith('## '): cur=l[3:]; src.setdefault(cur,[]); continue
    if l.startswith('http'): src[cur].append(l.split()[0])
deny=('exa.ai','mapliv','mapquest','nooklyn','stormrage','dateyet','velomesto','postmates','ubereats','reddit','nycrestaurantinspections','yelp','restaurantji','newyorkeatsguide','opentable','timeout.com','sushi-heights.square','grubhub','realsabor','boletosexpress','bxtimes')
def q(s): return '"'+s.replace('\\','\\\\').replace('"','\\"')+'"'
os.makedirs(OUT,exist_ok=True)
for f in glob.glob(OUT+'/*.md'): os.remove(f)
report=[]
for g in G:
    picks=[p for p in g['picks'] if p[0] in main]
    dropped=[p[0] for p in g['picks'] if p[0] not in main]
    for d in dropped: assert d in b3,d
    if len(picks)<3:
        report.append((g['slug'],'SKIPPED',[p[0] for p in picks])); continue
    assert len(g['description'])<160,(g['slug'],len(g['description']))
    assert 3<=len(g['intro'])<=3
    if 'area' in g: assert g['area'] in areas
    urls=[]
    for p in picks:
        for u in src.get(p[0],[]):
            if any(d in u for d in deny): continue
            if u not in urls: urls.append(u)
    # description says things; fine
    lines=['---','title: '+q(g['title']),'description: '+q(g['description'])]
    if 'area' in g: lines.append('area: '+q(g['area']))
    if 'category' in g: lines.append('category: '+q(g['category']))
    lines.append('updated: 2026-10-28')
    lines.append('picks:')
    for slug,badge,blurb,_ in picks:
        lines+=['  - listing: '+q(slug),'    blurb: '+q(blurb),'    badge: '+q(badge)]
    lines.append('sources:')
    lines+=['  - '+q(u) for u in urls] if urls else []
    if not urls: lines[-1]='sources: []'; lines.pop(-2)
    lines+=['---','']
    body=g['intro']
    if dropped is not None: pass
    lines.append('\n\n'.join(body)); lines.append('')
    open(f"{OUT}/{g['slug']}.md",'w').write('\n'.join(lines))
    report.append((g['slug'],len(picks),dropped,len(g['description'])))
for r in report: print(r)
