#!/usr/bin/env python3
"""List NYC film permits (tg4x-b46p) in Heights zips for a date window, to cross-check a sighting.
Usage: permit_check.py 2025-10-01 2025-10-07"""
import json,sys,urllib.request,urllib.parse
a,b=sys.argv[1:3]
q=urllib.parse.urlencode({"$where":f"startdatetime between '{a}T00:00:00' and '{b}T23:59:59' AND (zipcode_s like '%10032%' OR zipcode_s like '%10033%' OR zipcode_s like '%10040%')","$limit":"500","$order":"startdatetime"})
for p in json.load(urllib.request.urlopen("https://data.cityofnewyork.us/resource/tg4x-b46p.json?"+q)):
    print(p['eventid'],p['startdatetime'][:16],p.get('enddatetime','')[5:16],p['category'],'/',p['subcategoryname'],'|',p['parkingheld'][:250])
