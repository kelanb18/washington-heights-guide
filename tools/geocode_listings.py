#!/usr/bin/env python3
"""Look up coordinates for listings from two independent sources and compare them.

Sources:
  - US Census geocoder (street address, no key): https://geocoding.geo.census.gov/
  - OpenStreetMap Nominatim (place name + address): https://nominatim.org/
    Usage policy: at most 1 request per second, identify the app in the User-Agent.

Writes a JSON report; it does not edit listings. Review the report, then apply with
tools/apply_coordinates.py.

Usage:
  python3 tools/geocode_listings.py [--only slug,slug] > report.json
"""

from __future__ import annotations

import json
import math
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LISTINGS = ROOT / "src" / "content" / "listings"
USER_AGENT = "WashingtonHeightsGuide-geocoder/1.0 (+https://washingtonheightsguide.com)"

# Washington Heights and its edges, generously: W 150th St to Dyckman, river to river.
BOX = {"south": 40.824, "north": 40.872, "west": -73.960, "east": -73.918}


def frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.S)
    data = {}
    for line in (match.group(1) if match else "").splitlines():
        found = re.match(r'^([A-Za-z]+):\s*"?(.*?)"?\s*$', line)
        if found:
            data[found.group(1)] = found.group(2)
    return data


def get_json(url: str) -> object:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def census(address: str, postal: str) -> dict | None:
    if not address or not re.match(r"^\d", address):
        return None
    line = f"{address}, New York, NY {postal}".strip()
    url = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?" + urllib.parse.urlencode(
        {"address": line, "benchmark": "Public_AR_Current", "format": "json"}
    )
    try:
        matches = get_json(url)["result"]["addressMatches"]
    except Exception as error:  # noqa: BLE001
        return {"error": str(error)}
    if not matches:
        return None
    best = matches[0]
    return {"lat": best["coordinates"]["y"], "lng": best["coordinates"]["x"], "matched": best["matchedAddress"]}


def nominatim(name: str, address: str) -> dict | None:
    viewbox = f'{BOX["west"]},{BOX["north"]},{BOX["east"]},{BOX["south"]}'
    for query in (f"{name}, {address}, Manhattan", f"{name}, Manhattan", f"{address}, Manhattan"):
        url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
            {"q": query, "format": "jsonv2", "limit": 1, "viewbox": viewbox, "bounded": 1}
        )
        time.sleep(1.1)
        try:
            results = get_json(url)
        except Exception as error:  # noqa: BLE001
            return {"error": str(error)}
        if results:
            hit = results[0]
            return {
                "lat": float(hit["lat"]),
                "lng": float(hit["lon"]),
                "matched": hit.get("display_name", "")[:120],
                "kind": f'{hit.get("category")}/{hit.get("type")}',
                "query": query,
            }
    return None


def metres(a: dict, b: dict) -> float:
    lat1, lng1, lat2, lng2 = map(math.radians, (a["lat"], a["lng"], b["lat"], b["lng"]))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lng2 - lng1) / 2) ** 2
    return 2 * 6371000 * math.asin(math.sqrt(h))


def in_box(point: dict | None) -> bool:
    return bool(point and "lat" in point and BOX["south"] <= point["lat"] <= BOX["north"] and BOX["west"] <= point["lng"] <= BOX["east"])


def main() -> None:
    only = None
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    report = []
    for path in sorted(LISTINGS.glob("*.md")):
        slug = path.stem
        data = frontmatter(path)
        if data.get("example") == "true" or (only and slug not in only):
            continue
        name, address, postal = data.get("name", ""), data.get("address", ""), data.get("postalCode", "")
        a = census(address, postal)
        b = nominatim(name, address)
        a = a if in_box(a) else ({"rejected": a} if a else None)
        b = b if in_box(b) else ({"rejected": b} if b else None)
        entry = {"slug": slug, "name": name, "address": address, "crossStreets": data.get("crossStreets", ""), "census": a, "osm": b}
        if a and b and "lat" in a and "lat" in b:
            entry["apart_m"] = round(metres(a, b))
        report.append(entry)
        print(f"{slug}: census={'ok' if a and 'lat' in a else '-'} osm={'ok' if b and 'lat' in b else '-'} apart={entry.get('apart_m', '-')}", file=sys.stderr)
    json.dump(report, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
