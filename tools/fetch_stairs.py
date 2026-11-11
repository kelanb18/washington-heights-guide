"""Fetch the outdoor public stairways of Washington Heights and Inwood from OpenStreetMap.

For each stairway it also looks up the height of the top and bottom (USGS elevation service)
and the nearest address (NYC GeoSearch). Writes src/data/stairs-snapshot.json. Run from the repo root:
    python3 -I tools/fetch_stairs.py
Data: (c) OpenStreetMap contributors, ODbL. Elevations: USGS 3D Elevation Program (public domain).
"""
from __future__ import annotations
import json
import math
import pathlib
import subprocess
import time
import urllib.parse

# W 155th St to the northern tip of Manhattan.
BBOX = (40.8285, -73.9520, 40.8790, -73.9050)
MIN_LENGTH_M = 12  # shorter flights are stoops and curbs, not climbs
UA = "WashingtonHeightsGuide/1.0 (+https://washingtonheightsguide.com)"


def curl_json(args: list[str], retries: int = 4) -> dict:
    # curl rather than urllib: the older Python that ships with macOS cannot complete some TLS handshakes.
    last = None
    for attempt in range(retries):
        result = subprocess.run(["curl", "-sS", "--fail", "--max-time", "120", "-A", UA, *args], capture_output=True, text=True)
        if result.returncode == 0:
            return json.loads(result.stdout)
        last = result.stderr.strip()
        time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"Request failed: {last}")


def overpass(query: str) -> dict:
    servers = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"]
    for attempt in range(6):
        try:
            return curl_json(["--data-urlencode", f"data={query}", servers[attempt % 2]], retries=1)
        except RuntimeError:
            time.sleep(10 * (attempt + 1))
    raise RuntimeError("Overpass failed after retries")


def metres(a: dict, b: dict) -> float:
    r = 6371000
    p1, p2 = math.radians(a["lat"]), math.radians(b["lat"])
    dp, dl = p2 - p1, math.radians(b["lon"] - a["lon"])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def elevation_ft(point: dict) -> float | None:
    query = urllib.parse.urlencode({"x": point["lon"], "y": point["lat"], "units": "Feet", "wkid": 4326, "includeDate": "false"})
    try:
        value = curl_json([f"https://epqs.nationalmap.gov/v1/json?{query}"]).get("value")
        value = float(value)
        return None if value < -1000 else value
    except (RuntimeError, TypeError, ValueError):
        return None


def nearest_address(point: dict) -> str | None:
    query = urllib.parse.urlencode({"point.lat": point["lat"], "point.lon": point["lon"], "size": 1})
    try:
        features = curl_json([f"https://geosearch.planninglabs.nyc/v2/reverse?{query}"]).get("features", [])
    except RuntimeError:
        return None
    if not features:
        return None
    props = features[0]["properties"]
    street = props.get("street")
    if street and props.get("housenumber"):
        return f"{props['housenumber']} {street}"
    return street or props.get("name")


def main() -> None:
    south, west, north, east = BBOX
    data = overpass(
        '[out:json][timeout:90];area["wikidata"="Q11299"]["boundary"="administrative"]->.manhattan;'
        f'way["highway"="steps"](area.manhattan)({south},{west},{north},{east});out geom tags;'
    )
    stairs = []
    for way in data.get("elements", []):
        tags = way.get("tags", {})
        geometry = way.get("geometry") or []
        if len(geometry) < 2:
            continue
        if tags.get("access") in ("private", "no") or tags.get("indoor") == "yes" or tags.get("level") or tags.get("railway"):
            continue
        length = sum(metres(a, b) for a, b in zip(geometry, geometry[1:]))
        if length < MIN_LENGTH_M:
            continue
        mid = geometry[len(geometry) // 2]
        steps = tags.get("step_count")
        stairs.append(
            {
                "osm": f"way/{way['id']}",
                "name": tags.get("name"),
                "lat": round(mid["lat"], 6),
                "lon": round(mid["lon"], 6),
                "lengthM": round(length),
                "steps": int(steps) if steps and steps.isdigit() else None,
                "handrail": tags.get("handrail") in ("yes", "both", "left", "right", "center") or None,
                "ramp": tags.get("ramp:bicycle") == "yes" or tags.get("ramp:stroller") == "yes" or None,
                "start": {"lat": geometry[0]["lat"], "lon": geometry[0]["lon"]},
                "end": {"lat": geometry[-1]["lat"], "lon": geometry[-1]["lon"]},
            }
        )

    for stair in stairs:
        a, b = elevation_ft(stair.pop("start")), elevation_ft(stair.pop("end"))
        stair["climbFt"] = round(abs(a - b)) if a is not None and b is not None else None
        stair["near"] = nearest_address(stair)
        time.sleep(0.2)

    stairs.sort(key=lambda s: (-(s["climbFt"] or 0), -s["lengthM"]))
    out = {"fetched": time.strftime("%Y-%m-%d"), "stairs": stairs}
    path = pathlib.Path("src/data/stairs-snapshot.json")
    path.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
    print(f"Saved {len(stairs)} stairways to {path}")


if __name__ == "__main__":
    main()
