# Tianle Liu Academic Homepage

The site keeps presentation code separate from academic content. Routine updates only require editing the Markdown files in the contents folder:

- home.md: hero profile, contact links, research areas, biography, and education
- publications.md: selected papers shown on the homepage
- publications-all.md: the full paper list on publications.html
- experience.md: research projects and experience
- awards.md: patents, grants, and awards
- config.yml: footer copyright text

The block between the two --- lines at the top of home.md controls structured hero fields. Keep the indentation when adding links, details, or research areas.

The Google Scholar button is configured under `links` in `home.md` with `icon: google-scholar`. Replace its `url` with your Google Scholar profile URL; the initial link searches for the author Tianle Liu. Its local SVG logo uses the Google Scholar path from Simple Icons (CC0).

Add every new paper to `publications-all.md`, then copy any papers you want to highlight to `publications.md`. Both files use the same Markdown list format: a bold title and venue on the first paragraph, followed by the authors in a separate indented paragraph. Keep your own name bold. The full list also supports optional `## 2026` year headings between lists and counts papers automatically.

## Local preview

The site always fetches the Markdown files in `contents/` at runtime. Preview it through a local HTTP server rather than opening `index.html` directly.

    python -m http.server 4173

Then visit http://localhost:4173. GitHub Pages uses the same direct Markdown loading path.

The `.nojekyll` file is required for GitHub Pages: it prevents Jekyll from converting the Markdown source files, so the browser can fetch `contents/*.md` unchanged.

Opening `index.html` with a `file:///` URL is intentionally unsupported because browsers block local file requests from JavaScript.
