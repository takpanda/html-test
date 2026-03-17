import os
import shutil
import markdown
from pathlib import Path

SRC = Path(".")
DIST = Path("dist")
DIST.mkdir(exist_ok=True)

STATIC_EXTENSIONS = {
    ".html", ".css", ".js", ".json", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"
}

# Collect pages for index
pages = []

for md_file in sorted(SRC.rglob("*.md")):
    # Skip hidden dirs and dist
    if any(p.startswith(".") for p in md_file.parts) or "dist" in md_file.parts:
        continue
    rel = md_file.relative_to(SRC)
    html_path = DIST / rel.with_suffix(".html")
    html_path.parent.mkdir(parents=True, exist_ok=True)

    html_body = markdown.markdown(
        md_file.read_text(encoding="utf-8"),
        extensions=["fenced_code", "tables", "toc"]
    )

    html_path.write_text(
        f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{rel.stem}</title>
<style>
  body {{ max-width: 800px; margin: 2rem auto; font-family: -apple-system, sans-serif; padding: 0 1rem; line-height: 1.6; color: #333; }}
  h1 {{ border-bottom: 2px solid #eee; padding-bottom: 0.3em; }}
  code {{ background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }}
  pre {{ background: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }}
  pre code {{ background: none; padding: 0; }}
  a {{ color: #0366d6; }}
  .back {{ margin-bottom: 1rem; }}
</style>
</head>
<body>
<div class="back"><a href="index.html">← 一覧に戻る</a></div>
{html_body}
</body>
</html>""",
        encoding="utf-8"
    )
    pages.append((rel, html_path))
    print(f"✅ {rel} → {html_path}")

for static_file in sorted(SRC.rglob("*")):
    if not static_file.is_file():
        continue
    if any(p.startswith(".") for p in static_file.parts) or "dist" in static_file.parts:
        continue
    if static_file.suffix.lower() not in STATIC_EXTENSIONS:
        continue

    rel = static_file.relative_to(SRC)
    dist_path = DIST / rel
    dist_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(static_file, dist_path)
    if static_file.suffix.lower() == ".html":
        pages.append((rel, dist_path))
    print(f"📦 {rel} → {dist_path}")

# Generate index.html
if pages:
    items = "\n".join(
        f'<li><a href="{html_path.relative_to(DIST)}">{rel}</a></li>'
        for rel, html_path in pages
    )
    (DIST / "index.html").write_text(
        f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>html-test</title>
<style>
  body {{ max-width: 800px; margin: 2rem auto; font-family: -apple-system, sans-serif; padding: 0 1rem; }}
  h1 {{ color: #333; }}
  li {{ margin: 0.5em 0; }}
</style>
</head>
<body>
<h1>📄 html-test</h1>
<p>Markdown → HTML 自動変換</p>
<ul>
{items}
</ul>
</body>
</html>""",
        encoding="utf-8"
    )
    print(f"✅ index.html generated with {len(pages)} pages")
