const contentDirectory = new URL("contents/", document.baseURI);
const contentSections = ["home", "news", "publications", "experience", "awards"];

// Inline SVGs keep navigation and section icons available without a remote CDN.
const iconPaths = {
  user: '<path d="M20 21v-2a7 7 0 0 0-14 0v2"/><circle cx="13" cy="7" r="4"/>',
  newspaper: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 17h8M13 11h3M13 14h3"/><rect x="8" y="11" width="2" height="3"/>',
  "book-open": '<path d="M12 5.5C9 3.5 5 3.5 2 4v15c3-.5 7-.5 10 1.5 3-2 7-2 10-1.5V4c-3-.5-7-.5-10 1.5Zm0 0v15"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M10 12v3h4v-3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7M5 12h14"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
  sparkles: '<path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8zM20 2v4M18 4h4"/>',
  award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 10L12 19l4.5 3-1-10"/>',
  "code-2": '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.4 6-1.5 6-6a4.7 4.7 0 0 0-1.3-3.3A4.3 4.3 0 0 0 18.6 2S17.5 1.7 15 3.3a12 12 0 0 0-6 0C6.5 1.7 5.4 2 5.4 2a4.3 4.3 0 0 0-.1 3.7A4.7 4.7 0 0 0 4 9c0 4.5 3 5.6 6 6a3.5 3.5 0 0 0-1 3v4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'
};

function makeIcon(name) {
  if (name === "google-scholar") {
    const icon = document.createElement("img");
    icon.src = "static/assets/icons/google-scholar.svg";
    icon.alt = "";
    icon.className = "brand-icon";
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("class", "icon");
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = iconPaths[name] || iconPaths["arrow-up-right"];
  return icon;
}

function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach(element => {
    element.append(makeIcon(element.dataset.icon));
    element.removeAttribute("data-icon");
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value != null) element.textContent = value;
}

function parseFrontMatter(markdown) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/);
  if (!match) return { data: {}, body: normalized };
  return { data: jsyaml.load(match[1]) || {}, body: match[2] };
}

function createLink(link) {
  const anchor = document.createElement("a");
  anchor.className = "contact-link";
  anchor.href = link.url;
  anchor.target = /^https?:/.test(link.url) ? "_blank" : "_self";
  anchor.rel = anchor.target === "_blank" ? "noopener noreferrer" : "";
  anchor.title = link.label;
  anchor.setAttribute("aria-label", link.label);
  anchor.append(makeIcon(link.icon || "arrow-up-right"), document.createTextNode(link.short_label || link.label));
  return anchor;
}

function renderProfile(profile) {
  document.title = document.body.dataset.page === "publications"
    ? "Publications | " + (profile.name || "Tianle Liu")
    : profile.page_title || "Tianle Liu | Researcher";
  setText("nav-name", profile.name);
  const emailLink = (profile.links || []).find(link => link.url.startsWith("mailto:"));
  if (emailLink) {
    const footerEmail = document.getElementById("footer-email");
    footerEmail.href = emailLink.url;
    footerEmail.textContent = emailLink.url.replace("mailto:", "");
  }
  if (!document.getElementById("hero-name")) return;
  setText("hero-name", profile.name);
  setText("hero-kicker", profile.kicker);
  setText("hero-role", profile.role);
  setText("hero-summary", profile.summary);
  const portrait = document.getElementById("portrait-image");
  if (profile.portrait) portrait.src = profile.portrait;
  portrait.alt = "Portrait of " + (profile.name || "Tianle Liu");
  const cover = document.getElementById("cover-photo");
  if (cover) {
    cover.hidden = profile.banner === false;
    document.body.classList.toggle("without-banner", cover.hidden);
    if (profile.banner) document.getElementById("banner-image").src = profile.banner;
    if (profile.banner_alt) document.getElementById("banner-image").alt = profile.banner_alt;
  }
  document.getElementById("hero-links").replaceChildren(...(profile.links || []).map(createLink));
  const details = (profile.details || []).map(detail => {
    const pair = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = detail.label;
    description.textContent = detail.value;
    if (detail.label.toLowerCase() === "status") description.className = "profile-status";
    pair.append(term, description);
    return pair;
  });
  document.getElementById("hero-details").replaceChildren(...details);
  const areas = (profile.research_areas || []).map(area => {
    const item = document.createElement("span");
    item.className = "research-area";
    item.textContent = area;
    return item;
  });
  document.getElementById("research-areas").replaceChildren(...areas);
}

function organizeProfile(container) {
  const nodes = [...container.children];
  let group;
  nodes.forEach(node => {
    if (node.tagName === "H3") {
      group = document.createElement("div");
      group.className = "education-block";
      container.append(group);
    }
    if (group) group.append(node);
  });
}

function organizeExperience(container) {
  const nodes = [...container.children];
  let entry;
  nodes.forEach(node => {
    if (node.tagName === "HR") {
      node.remove();
      return;
    }
    if (node.tagName === "H3") {
      entry = document.createElement("article");
      entry.className = "experience-entry";
      container.append(entry);
    }
    if (entry) entry.append(node);
  });
}

function decoratePublications(container) {
  const papers = [...container.querySelectorAll(":scope > ul > li")];
  papers.forEach((item, index) => {
    item.dataset.index = String(index + 1).padStart(2, "0");
    item.className = "publication-card";
    const image = item.querySelector("img");
    if (image) {
      const figure = document.createElement("div");
      figure.className = "publication-figure";
      const imageParagraph = image.closest("p");
      const imageLink = image.closest("a");
      figure.append(imageLink || image);
      if (imageParagraph && !imageParagraph.textContent.trim() && !imageParagraph.children.length) imageParagraph.remove();
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        const fallback = document.createElement("span");
        fallback.className = "publication-image-fallback";
        fallback.append(makeIcon("file-text"), document.createTextNode(image.alt || "Research paper"));
        figure.replaceChildren(fallback);
      });
      item.prepend(figure);
    } else {
      item.classList.add("publication-card--text");
    }
    const content = document.createElement("div");
    content.className = "publication-content";
    [...item.childNodes].filter(node => !node.classList?.contains("publication-figure")).forEach(node => content.append(node));
    item.append(content);
    const paragraphs = [...content.querySelectorAll(":scope > p")];
    const badges = paragraphs.find(paragraph => paragraph.querySelector(":scope > code") && !paragraph.querySelector("strong, a"));
    if (badges) {
      badges.className = "publication-badges";
      badges.querySelectorAll("code").forEach(badge => {
        const label = badge.textContent.trim();
        badge.className = /^CCF-?\s*[ABC]$/i.test(label) ? "publication-badge ranking-badge" : "publication-badge";
        if (/CCF-?\s*B/i.test(label)) badge.classList.add("ranking-badge-b");
        if (/oral|spotlight/i.test(label)) badge.classList.add("highlight-badge");
        if (/poster/i.test(label)) badge.classList.add("format-badge");
      });
      content.prepend(badges);
    }
    const title = paragraphs.find(paragraph => paragraph !== badges && paragraph.querySelector("strong"));
    if (!title) return;
    title.className = "publication-title";
    [...title.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && /\(Accepted by\b/.test(node.textContent)) {
        const venue = document.createElement("span");
        venue.className = "publication-venue";
        venue.textContent = node.textContent;
        node.replaceWith(venue);
      }
    });
    paragraphs.filter(paragraph => paragraph !== title && paragraph !== badges).forEach(paragraph => {
      if (paragraph.querySelector("a") && !paragraph.querySelector("strong")) {
        paragraph.className = "publication-links";
        paragraph.querySelectorAll("a").forEach(link => {
          link.prepend(makeIcon(/code|github/i.test(link.textContent) ? "github" : "file-text"));
        });
      } else paragraph.className = "publication-authors";
    });
    item.querySelectorAll('a[href^="http"]').forEach(link => {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  });
  setText("publication-count", papers.length + (papers.length === 1 ? " publication" : " publications"));
}

function organizeNews(container) {
  const items = [...container.querySelectorAll(":scope > ul > li")];
  items.forEach((item, index) => {
    const date = item.querySelector("strong");
    const content = document.createElement("div");
    content.className = "news-content";
    if (date) {
      date.className = "news-date";
      date.remove();
    }
    while (item.firstChild) content.append(item.firstChild);
    const textNodes = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    let firstText = textNodes.nextNode();
    while (firstText && !firstText.textContent.trim()) firstText = textNodes.nextNode();
    if (firstText) firstText.textContent = firstText.textContent.replace(/^\s*[—–:-]\s*/, "");
    if (date) item.append(date);
    else {
      const blankDate = document.createElement("span");
      blankDate.className = "news-date";
      item.append(blankDate);
    }
    item.append(content);
    item.classList.toggle("news-older", index >= 4);
  });
  const toggle = document.getElementById("news-toggle");
  if (!toggle) return;
  toggle.hidden = items.length <= 4;
  toggle.onclick = () => {
    const expanded = container.classList.toggle("is-expanded");
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.replaceChildren(document.createTextNode(expanded ? "Show less" : "Show all news"), makeIcon("chevron-down"));
  };
}

function setNavigation() {
  const header = document.getElementById("site-header");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  const menuButton = document.getElementById("menu-button");
  const mobileNav = document.getElementById("mobile-nav");
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.replaceChildren(makeIcon("menu"));
  };
  menuButton.addEventListener("click", () => {
    if (!mobileNav.hidden) return closeMenu();
    mobileNav.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");
    menuButton.replaceChildren(makeIcon("x"));
  });
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  const links = [...document.querySelectorAll(".desktop-nav a")];
  const sections = links.map(link => {
    const href = link.getAttribute("href");
    return href.startsWith("#") ? document.querySelector(href) : null;
  }).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

async function loadText(filename) {
  if (location.protocol === "file:") throw new Error("Please open this page through localhost or GitHub Pages to read Markdown.");
  const response = await fetch(new URL(filename, contentDirectory), { cache: "no-store" });
  if (!response.ok) throw new Error(filename + " returned HTTP " + response.status);
  return response.text();
}

function showContentError(target, filename, error) {
  console.error("Unable to render " + filename, error);
  const message = document.createElement("p");
  message.className = "load-error";
  message.textContent = "Could not load " + filename + ". " + error.message;
  (target || document.getElementById("home-md") || document.querySelector("main")).append(message);
}

async function loadContent() {
  const sections = contentSections.filter(name => name === "home" || document.getElementById(name + "-md"));
  await Promise.allSettled(sections.map(async name => {
    const target = document.getElementById(name + "-md");
    const filename = target?.dataset.contentFile || name + ".md";
    try {
      const parsed = parseFrontMatter(await loadText(filename));
      if (name === "home") renderProfile(parsed.data);
      if (!target) return;
      target.innerHTML = marked.parse(parsed.body, { mangle: false, headerIds: false });
      if (name === "home") organizeProfile(target);
      if (name === "news") organizeNews(target);
      if (name === "publications") decoratePublications(target);
      if (name === "experience") organizeExperience(target);
    } catch (error) {
      showContentError(target, filename, error);
    }
  }));
  try {
    const config = jsyaml.load(await loadText("config.yml")) || {};
    setText("copyright-text", config["copyright-text"]);
  } catch (error) {
    console.error("Unable to load config.yml", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderIcons();
  setNavigation();
  loadContent().catch(error => showContentError(null, "content", error));
});
