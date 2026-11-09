#!/usr/bin/env python3
"""Write latitude/longitude into listing frontmatter from a reviewed JSON file.

Input: {"slug": {"lat": 40.85, "lng": -73.93}, ...}
Existing coordinates are replaced. Other frontmatter is left as it is.

Usage:
  python3 tools/apply_coordinates.py coordinates.json
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

LISTINGS = Path(__file__).resolve().parent.parent / "src" / "content" / "listings"


def apply(slug: str, lat: float, lng: float) -> None:
    path = LISTINGS / f"{slug}.md"
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.S)
    if not match:
        raise SystemExit(f"{slug}: no frontmatter")
    lines = [line for line in match.group(1).splitlines() if not re.match(r"^(latitude|longitude):", line)]
    # Place coordinates after postalCode, else after address.
    anchor = next((i for i, line in enumerate(lines) if line.startswith("postalCode:")), None)
    if anchor is None:
        anchor = next(i for i, line in enumerate(lines) if line.startswith("address:"))
    lines[anchor + 1 : anchor + 1] = [f"latitude: {lat:.6f}", f"longitude: {lng:.6f}"]
    path.write_text(text[: match.start(1)] + "\n".join(lines) + text[match.end(1) :], encoding="utf-8")


def main() -> None:
    coordinates = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    for slug, point in sorted(coordinates.items()):
        apply(slug, point["lat"], point["lng"])
    print(f"Wrote coordinates for {len(coordinates)} listings.")


if __name__ == "__main__":
    main()
