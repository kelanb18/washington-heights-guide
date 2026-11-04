#!/usr/bin/env python3
"""Download OLV (@olv) weekly 'Filming Locations' Google Docs and print Washington Heights lines.
Usage: scan_olv_docs.py DOC_ID [DOC_ID ...]   (IDs from docs.google.com/document/d/<ID>/edit links in @olv's Sunday posts)
Docs are public; export as txt. Table layout is flattened: the line before a location is its project, the line after is the credit."""
import re,sys,subprocess
pat=re.compile(r"\b(W\.?|West)?\s?(15[5-9]|1[6-9]\d|20\d)(st|nd|rd|th)\b|Tryon|Cloisters|United Palace|Washington Heights|Dyckman|Hudson Heights|Cabrini|Ft\.? Washington|Fort Washington|Bennett|Haven Ave|Wadsworth|Audubon|Magaw|Pinehurst|Edward Morgan|Jumel|Sylvan",re.I)
skip=re.compile(r"Jamaica|Queens|Brooklyn|Bronx|Staten|Whitestone|Howard Beach|Newark|Hoboken|Jersey|, NJ")
for k in sys.argv[1:]:
    t=subprocess.run(['curl','-sL','-m','30',f'https://docs.google.com/document/d/{k}/export?format=txt'],capture_output=True,text=True).stdout
    L=[re.sub(r'[\t ]+',' ',l).strip() for l in t.split('\n')]; L=[l for l in L if l]
    for i,l in enumerate(L):
        if pat.search(l) and not l.startswith('Week of') and not skip.search(l):
            print(k[:8],'|',' / '.join(L[max(0,i-1):i+2]))
