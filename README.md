# Tianle Liu Academic Homepage

The site keeps presentation code separate from academic content. Routine updates only require editing the Markdown files in the contents folder:

- home.md: hero profile, contact links, research areas, biography, and education
- publications.md: papers and authors
- experience.md: research projects and experience
- awards.md: patents, grants, and awards
- config.yml: footer copyright text

The block between the two --- lines at the top of home.md controls structured hero fields. Keep the indentation when adding links, details, or research areas.

## Local preview

The site always fetches the Markdown files in `contents/` at runtime. Preview it through a local HTTP server rather than opening `index.html` directly.

    python -m http.server 4173

Then visit http://localhost:4173. GitHub Pages uses the same direct Markdown loading path.

The `.nojekyll` file is required for GitHub Pages: it prevents Jekyll from converting the Markdown source files, so the browser can fetch `contents/*.md` unchanged.

Opening `index.html` with a `file:///` URL is intentionally unsupported because browsers block local file requests from JavaScript.
