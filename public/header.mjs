import { toHtmlElement } from "./toHtmlElement.mjs";

const NAV_LINKS = [
  { href: "./index.html", label: "Catalog" },
  { href: "./account.html", label: "Account" },
  { href: "./review.html", label: "Write a review" },
];

function normalizeCurrentPage() {
  // Examples:
  //  - "/" -> "index.html"
  //  - "/index.html" -> "index.html"
  //  - "/account.html" -> "account.html"
  const path = window.location.pathname;
  if (path.endsWith("/")) return "index.html";
  const last = path.split("/").filter(Boolean).at(-1);
  return last ?? "index.html";
}

function filenameFromHref(href) {
  // "./account.html" -> "account.html"
  const clean = href.split("?")[0].split("#")[0];
  return clean.split("/").filter(Boolean).at(-1) ?? clean;
}

function buildNavLinks(navEl) {
  const current = normalizeCurrentPage();

  for (const { href, label } of NAV_LINKS) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;

    if (filenameFromHref(href) === current) {
      a.setAttribute("aria-current", "page");
    }

    navEl.append(a);
  }
}

function setTheme(theme) {
  // theme: "dark" | "light"
  document.body.classList.toggle("dark-mode", theme === "dark");
}

function loadSavedTheme() {
  const saved = window.localStorage.getItem("darkMode");
  if (saved === "true") return "dark";
  if (saved === "false") return "light";
  return "dark"; // default to dark for this site
}

function saveTheme(theme) {
  window.localStorage.setItem("darkMode", theme === "dark" ? "true" : "false");
}

function createHeader() {
  // Checkbox markup matches the lab prompt.
  const header = toHtmlElement(`
    <header class="site-header" data-menu-open="false">
      <div class="container header-inner">
        <a class="brand" href="./index.html" aria-label="PrintMart home">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>
            PrintMart
            <small>3D print shop marketplace (MVP UI)</small>
          </span>
        </a>

        <nav id="primary-nav" class="nav" aria-label="Primary"></nav>

        <div class="header-actions" aria-label="Quick actions">
          <label>
            <input type="checkbox" autocomplete="off" />
            Dark mode
          </label>

          <button class="menu-btn" type="button" aria-controls="primary-nav" aria-expanded="false">
            Menu
          </button>

          <a class="pill" href="./cart.html" aria-label="Go to cart">
            Cart <span class="badge" aria-label="Items in cart">3</span>
          </a>

          <span class="pill" aria-label="Logged in user">
            Signed in as <strong>Alex Rivera</strong>
          </span>
        </div>
      </div>
    </header>
  `);

  const nav = header.querySelector("#primary-nav");
  const menuBtn = header.querySelector(".menu-btn");
  const themeCheckbox = header.querySelector('input[type="checkbox"]');
  const cartLink = header.querySelector('a[href="./cart.html"]');

  buildNavLinks(nav);

  // Highlight cart when on cart page
  if (normalizeCurrentPage() === "cart.html") {
    cartLink.setAttribute("aria-current", "page");
  }

  // Theme init
  const theme = loadSavedTheme();
  setTheme(theme);
  themeCheckbox.checked = theme === "dark";

  themeCheckbox.addEventListener("change", () => {
    const nextTheme = themeCheckbox.checked ? "dark" : "light";
    setTheme(nextTheme);
    saveTheme(nextTheme);
  });

  function setMenuOpen(isOpen) {
    header.dataset.menuOpen = String(isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = header.dataset.menuOpen === "true";
    setMenuOpen(!isOpen);
  });

  // Clicks outside the header should close the menu (no stopPropagation).
  document.body.addEventListener("click", (e) => {
    if (header.dataset.menuOpen !== "true") return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (header.contains(target)) return;
    setMenuOpen(false);
  });

  // Close menu after clicking a link (mobile UX)
  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) {
      setMenuOpen(false);
    }
  });

  // If we leave mobile, force the menu "open" state off (nav will still show on desktop)
  const media = window.matchMedia("(max-width: 640px)");
  media.addEventListener("change", (evt) => {
    if (!evt.matches) setMenuOpen(false);
  });

  return header;
}

function insertHeader() {
  const header = createHeader();

  // If an old header exists, replace it. Otherwise insert after skip link.
  const existing = document.querySelector("header.site-header");
  if (existing) {
    existing.replaceWith(header);
    return;
  }

  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.insertAdjacentElement("afterend", header);
    return;
  }

  document.body.prepend(header);
}

insertHeader();

