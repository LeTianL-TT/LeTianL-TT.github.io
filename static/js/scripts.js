const contentDirectory = "contents/";
const contentSections = ["home", "publications", "experience", "awards"];

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: markdown };
  return { data: jsyaml.load(match[1]) || {}, body: match[2] };
}

function makeIcon(name) {
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", name);
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) element.textContent = value;
}

function createLink(link, index) {
  const anchor = document.createElement("a");
  anchor.className = "contact-link" + (index === 0 ? " is-primary" : "");
  anchor.href = link.url;
  anchor.target = link.url.startsWith("http") ? "_blank" : "_self";
  anchor.rel = link.url.startsWith("http") ? "noreferrer" : "";
  anchor.append(makeIcon(link.icon || "arrow-up-right"), document.createTextNode(link.label));
  return anchor;
}

function renderHero(profile) {
  document.title = profile.page_title || "Tianle Liu | Researcher";
  setText("nav-name", profile.name);
  const heroName = document.getElementById("hero-name");
  if (profile.name) {
    const nameParts = profile.name.trim().split(/\s+/);
    const lastName = nameParts.pop();
    heroName.textContent = nameParts.length ? nameParts.join(" ") + " " : "";
    const accentName = document.createElement("em");
    accentName.textContent = lastName;
    heroName.append(accentName);
  }
  setText("hero-kicker", profile.kicker);
  setText("hero-role", profile.role);
  setText("hero-summary", profile.summary);
  const portrait = document.getElementById("portrait-image");
  if (profile.portrait) portrait.src = profile.portrait;
  if (profile.name) portrait.alt = "Portrait of " + profile.name;

  const linkTarget = document.getElementById("hero-links");
  (profile.links || []).forEach((link, index) => linkTarget.append(createLink(link, index)));

  const detailTarget = document.getElementById("hero-details");
  (profile.details || []).forEach(detail => {
    const pair = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = detail.label;
    description.textContent = detail.value;
    pair.append(term, description);
    detailTarget.append(pair);
  });

  const areaTarget = document.getElementById("research-areas");
  (profile.research_areas || []).forEach(area => {
    const item = document.createElement("span");
    item.className = "research-area";
    item.textContent = area;
    areaTarget.append(item);
  });

  const emailLink = (profile.links || []).find(link => link.url.startsWith("mailto:"));
  if (emailLink) {
    const footerEmail = document.getElementById("footer-email");
    footerEmail.href = emailLink.url;
    footerEmail.textContent = emailLink.url.replace("mailto:", "");
  }
}

function organizeExperience(container) {
  const nodes = [...container.children];
  let entry;
  nodes.forEach(node => {
    if (node.tagName === "H3") {
      entry = document.createElement("article");
      entry.className = "experience-entry";
      container.append(entry);
    }
    if (entry) entry.append(node);
  });
}

function decoratePublications(container) {
  [...container.querySelectorAll("li")].forEach((item, index) => {
    item.dataset.index = String(index + 1).padStart(2, "0");
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal:not(.is-visible)").forEach(element => observer.observe(element));
}

function setNavigation() {
  const header = document.getElementById("site-header");
  const menuButton = document.getElementById("menu-button");
  const mobileNav = document.getElementById("mobile-nav");
  const links = [...document.querySelectorAll(".desktop-nav a")];
  const sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 16), { passive: true });
  menuButton.addEventListener("click", () => {
    const isOpen = !mobileNav.hasAttribute("hidden");
    mobileNav.toggleAttribute("hidden", isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    menuButton.innerHTML = "";
    menuButton.append(makeIcon(isOpen ? "menu" : "x"));
    if (window.lucide) window.lucide.createIcons();
  });
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileNav.setAttribute("hidden", "");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  const navigationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-34% 0px -58%" });
  sections.forEach(section => navigationObserver.observe(section));
}

async function loadText(filename) {
  const response = await fetch(contentDirectory + filename, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load " + filename);
  return response.text();
}

async function loadContent() {
  const responses = await Promise.all(contentSections.map(async name => {
    return [name, await loadText(name + ".md")];
  }));

  responses.forEach(([name, markdown]) => {
    const parsed = parseFrontMatter(markdown);
    if (name === "home") renderHero(parsed.data);
    const target = document.getElementById(name + "-md");
    target.innerHTML = marked.parse(parsed.body, { mangle: false, headerIds: false });
    if (name === "publications") decoratePublications(target);
    if (name === "experience") organizeExperience(target);
  });

  const config = jsyaml.load(await loadText("config.yml")) || {};
  setText("copyright-text", config["copyright-text"]);

  if (window.lucide) window.lucide.createIcons();
  revealOnScroll();
}

window.addEventListener("DOMContentLoaded", () => {
  setNavigation();
  loadContent().catch(error => console.error(error));
});
