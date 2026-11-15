# Tianle Liu Academic Homepage

The site keeps presentation code separate from academic content. Routine updates only require editing the Markdown files in the contents folder:

- home.md: hero profile, contact links, research areas, biography, and education
- news.md: dated news and announcements, newest first
- publications.md: selected papers shown on the homepage
- publications-all.md: the full paper list on publications.html
- experience.md: research projects and experience
- awards.md: patents, grants, and awards
- config.yml: footer copyright text

The block between the two --- lines at the top of home.md controls structured hero fields. Keep the indentation when adding links, details, or research areas.

The portrait and personal details appear in the left profile card. The `banner` field in `home.md` controls the photo that fills the top of the page and fades into the page background; set it to `false` to hide it and remove the extra top spacing. `banner_alt` is its accessible image description. Each link can have a `short_label` for the compact button while keeping its full `label` as the accessible name and tooltip.

## News

Edit `contents/news.md` using one Markdown bullet per update:

    - **2026.11** — A short announcement with **important text** or [a link](https://example.com).

Keep the first bold text as the date. Exact months are optional. The initial entries use only confirmed publication years. Four items appear initially; older items can be expanded with “Show all news”.

The Google Scholar button is configured under `links` in `home.md` with `icon: google-scholar`. Replace its `url` with your Google Scholar profile URL; the initial link searches for the author Tianle Liu. Its local SVG logo uses the Google Scholar path from Simple Icons (CC0).

## Publication cards

Add every new paper to `publications-all.md`, then copy any papers you want to highlight to `publications.md`. Both files use the same Markdown list format:

```markdown
- ![A short description of the paper figure](contents/paper_fig/example.png)

  `Conference 2026` `CCF-A` `Oral`

  **Paper title**

  First Author, **Tianle Liu**, Third Author

  [Paper](https://example.com/paper) · [Code](https://github.com/example/project)
```

Keep the two-space indentation inside each list item. The image appears on the left of the card on desktop, followed by the conference/ranking badges, title, authors, and optional links. Keep only your own name bold in the authors. The image and links are optional; older text-only paper entries still work. On small screens, the image moves above the text.

Put local figures in `contents/paper_fig/` and upload that directory with the site. Image paths are relative to the HTML page, so use `contents/paper_fig/filename.png`, preserving filename capitalization. Images are served by your own GitHub Pages site; external paper links are only used when a visitor chooses to open a paper. The image provenance is recorded in `contents/paper_fig/README.md`.

The conference, CCF rating, and presentation type come directly from the backtick labels in Markdown. Update them explicitly for each paper. The current CCF-A labels for NeurIPS, AAAI and CVPR follow the [CCF AI directory](https://www.ccf.org.cn/Academic_Evaluation/AI/), and ICME's CCF-B label follows the [CCF graphics and multimedia directory](https://www.ccf.org.cn/Academic_Evaluation/CGAndMT/).

The full list also supports optional `## 2026` year headings between lists and counts papers automatically.

## Local preview

The site always fetches the Markdown files in `contents/` at runtime. Preview it through a local HTTP server rather than opening `index.html` directly.

    python -m http.server 4173

Then visit http://localhost:4173. GitHub Pages uses the same direct Markdown loading path.

The `.nojekyll` file is required for GitHub Pages: it prevents Jekyll from converting the Markdown source files, so the browser can fetch `contents/*.md` unchanged.

Opening `index.html` with a `file:///` URL is intentionally unsupported because browsers block local file requests from JavaScript.

## GitHub Pages

Publish the contents of this site folder at the root of `LeTianL-TT.github.io`, including `.nojekyll`, both HTML pages, `contents/`, and `static/`. With branch-based publishing, select `main` and `/ (root)` under Settings → Pages. There is no build step and no generated content snapshot. All content requests use relative URLs, so the same site also works under a GitHub Pages project subdirectory.

Each Markdown section loads independently. A missing file or invalid front matter displays the affected filename in that section while allowing the other sections to render.

The visual refresh was inspired by [Anleeno Academic](https://github.com/Anleeno/anleeno-academic), with original HTML/CSS for this site and this site's own content and images.
