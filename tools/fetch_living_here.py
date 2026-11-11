"""Fetch everyday places in Washington Heights from OpenStreetMap (Overpass API).

Writes src/data/living-here-snapshot.json. Run from the repo root:
    python3 -I tools/fetch_living_here.py
Data: (c) OpenStreetMap contributors, ODbL. Credit OSM wherever it is shown.
"""
import json
import pathlib
import time
import subprocess

# Roughly W 155th St to Dyckman St, Hudson River to Harlem River.
BBOX = (40.8285, -73.9520, 40.8665, -73.9200)

CATEGORIES = {
    "pharmacy": ['nwr["amenity"="pharmacy"]'],
    # Hospitals and urgent care only; specialist clinics (dialysis, radiology) are left out.
    "health": ['nwr["amenity"="hospital"]', 'nwr["healthcare"="urgent_care"]', 'nwr["amenity"="clinic"]["name"~"[Uu]rgent"]'],
    "laundry": ['nwr["shop"="laundry"]', 'nwr["shop"="dry_cleaning"]'],
    "grocery": ['nwr["shop"="supermarket"]', 'nwr["shop"="greengrocer"]'],
    "hardware": ['nwr["shop"="hardware"]', 'nwr["shop"="doityourself"]', 'nwr["shop"="locksmith"]', 'nwr["craft"="locksmith"]'],
    "post": ['nwr["amenity"="post_office"]'],
    "library": ['nwr["amenity"="library"]'],
    "gym": ['nwr["leisure"="fitness_centre"]'],
    "dogs": ['nwr["leisure"="dog_park"]'],
}


def overpass(query: str) -> dict:
    # curl rather than urllib: the older Python that ships with macOS cannot complete the server's TLS handshake.
    # Public Overpass servers rate-limit, so retry with a pause and fall back to a second server.
    servers = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"]
    last_error = None
    for attempt in range(6):
        server = servers[attempt % len(servers)]
        result = subprocess.run(
            [
                "curl", "-sS", "--fail", "--max-time", "120",
                "-A", "WashingtonHeightsGuide/1.0 (+https://washingtonheightsguide.com)",
                "--data-urlencode", f"data={query}",
                server,
            ],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
        last_error = result.stderr.strip()
        time.sleep(10 * (attempt + 1))
    raise RuntimeError(f"Overpass failed after retries: {last_error}")


def main() -> None:
    south, west, north, east = BBOX
    places = []
    for category, selectors in CATEGORIES.items():
        # Manhattan only (the box alone reaches into the Bronx across the Harlem River).
        parts = "".join(f"{selector}(area.manhattan)({south},{west},{north},{east});" for selector in selectors)
        data = overpass(
            f'[out:json][timeout:60];area["wikidata"="Q11299"]["boundary"="administrative"]->.manhattan;({parts});out center tags;'
        )
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name")
            lat = element.get("lat") or element.get("center", {}).get("lat")
            lon = element.get("lon") or element.get("center", {}).get("lon")
            if not name or lat is None or lon is None:
                continue
            # University libraries are not open to the public.
            if category == "library" and "universit" in (tags.get("operator", "") + name).lower():
                continue
            street = " ".join(filter(None, [tags.get("addr:housenumber"), tags.get("addr:street")]))
            places.append(
                {
                    "category": category,
                    "name": name,
                    "address": street or None,
                    "hours": tags.get("opening_hours"),
                    "lat": round(lat, 6),
                    "lon": round(lon, 6),
                    "osm": f"https://www.openstreetmap.org/{element['type']}/{element['id']}",
                }
            )
        time.sleep(5)
    unique = {(p["category"], p["name"].lower(), p["address"]): p for p in places}
    out = sorted(unique.values(), key=lambda p: (p["category"], p["name"].lower()))
    target = pathlib.Path("src/data/living-here-snapshot.json")
    target.write_text(json.dumps({"fetched": time.strftime("%Y-%m-%d"), "places": out}, indent=1, ensure_ascii=False) + "\n")
    counts = {}
    for p in out:
        counts[p["category"]] = counts.get(p["category"], 0) + 1
    print(counts)


if __name__ == "__main__":
    main()
