#!/usr/bin/env python3
"""Set each sitemap <lastmod> to the date its page last changed.

A page with uncommitted changes gets today's date; otherwise it gets the
date of the last commit that touched its index.html. Runs from the
pre-commit hook in .githooks/, or by hand: python3 scripts/update-sitemap.py
"""
import datetime
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITEMAP = ROOT / "sitemap.xml"
SITE = "https://thegbmotors.com/"


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True).stdout.strip()


def page_date(path):
    rel = str(path.relative_to(ROOT))
    if git("status", "--porcelain", "--", rel):
        return datetime.date.today().isoformat()
    return git("log", "-1", "--format=%cs", "--", rel) or datetime.date.today().isoformat()


def replace(match):
    url = match.group(1)
    path = ROOT / url[len(SITE):] / "index.html"
    if not path.exists():
        return match.group(0)
    return f"<loc>{url}</loc><lastmod>{page_date(path)}</lastmod>"


xml = SITEMAP.read_text()
new = re.sub(r"<loc>([^<]+)</loc><lastmod>[^<]*</lastmod>", replace, xml)
if new != xml:
    SITEMAP.write_text(new)
    print("sitemap.xml: lastmod dates updated")
