/* ==========================================================================
   SC's WEBSITES — SCRIPT
   Table of contents:
   1. Data (websites, upcoming, featured, stats, social)
   2. Render functions
   3. Filtering
   4. Modal
   5. Navbar + mobile menu
   6. Preloader
   7. Scroll reveal (IntersectionObserver)
   8. Stat counters
   9. Progress bars
   10. Timeline reveal
   11. Hero particles
   12. Cursor glow + card spotlight + tilt
   13. Magnetic buttons
   14. Init
   ========================================================================== */

/* ==========================================================================
   1. DATA
   -------------------------------------------------------------------------
   TO ADD A NEW WEBSITE: add a new object to the `websites` array below.
   status must be one of: "live", "in-development", "coming-soon", "planned"
   ========================================================================== */

const websites = [
  {
    name: "Aurora Studio",
    description: "A portfolio and case-study site for a design studio, built with scroll-driven storytelling and a soft, editorial layout.",
    category: "Portfolio",
    status: "live",
    image: "assets/images/website-1.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "#"
  },
  {
    name: "Northbound",
    description: "A product landing page for a productivity app, with pricing tiers, testimonials, and an animated feature walkthrough.",
    category: "Landing Page",
    status: "live",
    image: "assets/images/website-2.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "#"
  },
  {
    name: "Ledger",
    description: "A personal finance dashboard concept with charts, budget tracking, and a clean data-dense interface.",
    category: "Web App",
    status: "in-development",
    image: "assets/images/placeholder.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "#"
  },
  {
    name: "Field Notes",
    description: "A minimal blogging platform for long-form writing, with a distraction-free reading mode and tag-based archives.",
    category: "Web App",
    status: "in-development",
    image: "assets/images/placeholder.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "#"
  },
  {
    name: "Glasshouse",
    description: "An experimental WebGL-inspired visual playground exploring light, glass, and motion in the browser.",
    category: "Experimental",
    status: "coming-soon",
    image: "assets/images/placeholder.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "#"
  },
  {
    name: "Roster",
    description: "A team scheduling tool for small studios, with drag-and-drop shift planning and conflict detection.",
    category: "Web App",
    status: "planned",
    image: "assets/images/placeholder.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "#"
  }
];

/* TO ADD A NEW UPCOMING PROJECT: add a new object to the `upcomingProjects` array. */
const upcomingProjects = [
  {
    name: "Glasshouse",
    description: "An experimental visual playground exploring light, glass, and motion in the browser.",
    progress: 80,
    note: "Currently in development"
  },
  {
    name: "Roster",
    description: "A team scheduling tool for small studios, with drag-and-drop shift planning.",
    progress: 35,
    note: "Currently in development"
  },
  {
    name: "Field Notes v2",
    description: "A full rebuild of the blogging platform with themes and a plugin system.",
    progress: 15,
    note: "Early development"
  }
];

/* Edit this object to change the featured project section. */
const featuredProject = {
  name: "Aurora Studio",
  description: "The flagship project of SC's Websites — a portfolio and case-study site built around scroll-driven storytelling, soft gradients, and an editorial layout designed to let the work speak for itself.",
  status: "Live",
  category: "Portfolio",
  technologies: ["HTML", "CSS", "JavaScript"],
  image: "assets/images/website-1.png",
  url: "#"
};

/* Edit these numbers to update the statistics section. */
const stats = [
  { number: 5, suffix: "+", label: "Websites" },
  { number: 3, suffix: "", label: "In Development" },
  { number: 2, suffix: "", label: "Coming Soon" },
  { number: 0, suffix: "∞", label: "Ideas" }
];

/* Edit this array to change footer social links. Use short text labels as icons. */
const socialLinks = [
  { label: "GH", name: "GitHub", url: "#" },
  { label: "TW", name: "Twitter / X", url: "#" },
  { label: "IN", name: "LinkedIn", url: "#" },
  { label: "EM", name: "Email", url: "#" }
];

const STATUS_LABELS = {
  "live": "Live",
  "in-development": "In Development",
  "coming-soon": "Coming Soon",
  "planned": "Planned"
};

/* ==========================================================================
   2. RENDER FUNCTIONS
   ========================================================================== */

function statusBadgeMarkup(status) {
  const label = STATUS_LABELS[status] || status;
  return `<span class="card-status status-${status}">${label}</span>`;
}

function websiteCardMarkup(site, index) {
  const techList = site.technologies.join(" • ");
  return `
    <article class="website-card reveal" style="--reveal-index:${index}" data-status="${site.status}" data-index="${index}" tabindex="0" role="button" aria-label="View details for ${site.name}">
      <div class="card-image-wrap">
        ${statusBadgeMarkup(site.status)}
        <img class="card-image" src="${site.image}" alt="Preview of ${site.name}" loading="lazy"
             onerror="this.onerror=null;this.src='assets/images/placeholder.png';" />
      </div>
      <div class="card-body">
        <h3>${site.name}</h3>
        <p class="card-desc">${site.description}</p>
        <span class="card-category">${site.category}</span>
        <p class="card-tech">${techList}</p>
        <span class="card-link">Visit Website <span class="arrow">→</span></span>
      </div>
    </article>
  `;
}

function renderWebsites(filter = "all") {
  const grid = document.getElementById("websitesGrid");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;

  const filtered = filter === "all"
    ? websites
    : websites.filter((site) => site.status === filter);

  grid.innerHTML = filtered.map((site, i) => websiteCardMarkup(site, i)).join("");

  emptyState.hidden = filtered.length !== 0;

  // Attach interactions to freshly rendered cards
  attachCardInteractions();
  observeRevealTargets(grid.querySelectorAll(".reveal"));
}

function upcomingCardMarkup(project) {
  return `
    <div class="upcoming-card reveal">
      <span class="upcoming-status">Coming Soon</span>
      <h3>${project.name}</h3>
      <p class="upcoming-desc">${project.description}</p>
      <div class="progress-label">
        <span>Progress</span>
        <span>${project.progress}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" data-progress="${project.progress}"></div>
      </div>
      <p class="upcoming-note">${project.note}</p>
    </div>
  `;
}

function renderUpcoming() {
  const grid = document.getElementById("upcomingGrid");
  if (!grid) return;
  grid.innerHTML = upcomingProjects.map(upcomingCardMarkup).join("");
  observeRevealTargets(grid.querySelectorAll(".reveal"));
  observeProgressBars(grid.querySelectorAll(".progress-fill"));
}

function renderFeatured() {
  const wrap = document.getElementById("featuredWrap");
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="featured-preview">
      <img src="${featuredProject.image}" alt="Preview of ${featuredProject.name}"
           onerror="this.onerror=null;this.src='assets/images/placeholder.png';" />
    </div>
    <div class="featured-info">
      <span class="featured-eyebrow">Featured Project</span>
      <h3>${featuredProject.name}</h3>
      <p class="featured-desc">${featuredProject.description}</p>
      <div class="featured-meta">
        <div>
          <span class="featured-meta-label">Status</span>
          <span class="featured-meta-value">${featuredProject.status}</span>
        </div>
        <div>
          <span class="featured-meta-label">Technologies</span>
          <span class="featured-meta-value">${featuredProject.technologies.join(", ")}</span>
        </div>
      </div>
      <a href="${featuredProject.url}" class="btn btn-primary magnetic" target="_blank" rel="noopener noreferrer">
        View Website <span class="arrow">→</span>
      </a>
    </div>
  `;
}

function renderStats() {
  const grid = document.getElementById("statsGrid");
  if (!grid) return;

  grid.innerHTML = stats.map((stat) => `
    <div class="stat-item">
      <span class="stat-number" data-target="${stat.number}" data-suffix="${stat.suffix}">0${stat.suffix === "∞" ? "" : ""}</span>
      <span class="stat-label">${stat.label}</span>
    </div>
  `).join("");
}

function renderSocial() {
  const container = document.getElementById("footerSocial");
  if (!container) return;
  container.innerHTML = socialLinks.map((link) => `
    <a href="${link.url}" aria-label="${link.name}" target="_blank" rel="noopener noreferrer">${link.label}</a>
  `).join("");
}

/* ==========================================================================
   3. FILTERING
   ========================================================================== */

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      filterWebsites(btn.dataset.filter);
    });
  });
}

function filterWebsites(filter) {
  renderWebsites(filter);
}

/* ==========================================================================
   4. MODAL
   ========================================================================== */

let lastFocusedElement = null;

function attachCardInteractions() {
  const cards = document.querySelectorAll(".website-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.index));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.index);
      }
    });
  });
}

function openModal(index) {
  const site = websites[index];
  if (!site) return;

  lastFocusedElement = document.activeElement;

  const overlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modal");
  const img = document.getElementById("modalImage");
  const statusEl = document.getElementById("modalStatus");
  const statusTextEl = document.getElementById("modalStatusText");
  const title = document.getElementById("modalTitle");
  const desc = document.getElementById("modalDescription");
  const category = document.getElementById("modalCategory");
  const tech = document.getElementById("modalTech");
  const link = document.getElementById("modalLink");

  img.src = site.image;
  img.alt = `Preview of ${site.name}`;
  img.onerror = function () {
    this.onerror = null;
    this.src = "assets/images/placeholder.png";
  };

  statusEl.className = `modal-status status-${site.status}`;
  statusEl.textContent = STATUS_LABELS[site.status] || site.status;

  title.textContent = site.name;
  desc.textContent = site.description;
  category.textContent = site.category;
  statusTextEl.textContent = STATUS_LABELS[site.status] || site.status;

  tech.innerHTML = site.technologies.map((t) => `<span class="tech-pill">${t}</span>`).join("");

  link.href = site.url;

  overlay.classList.add("open");
  document.body.classList.add("no-scroll");
  modal.focus();
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function initModal() {
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("modalClose");

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. NAVBAR + MOBILE MENU
   ========================================================================== */

function initializeNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navbarToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-link");

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu + set active link when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Highlight active section link on scroll
  const sections = ["home", "websites", "upcoming", "about"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-50% 0px -45% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ==========================================================================
   6. PRELOADER
   ========================================================================== */

function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const hide = () => {
    preloader.classList.add("hidden");
  };

  // Hide once the page has loaded, with a short minimum display time
  window.addEventListener("load", () => {
    setTimeout(hide, 500);
  });

  // Fallback in case the load event is delayed
  setTimeout(hide, 2500);
}

/* ==========================================================================
   7. SCROLL REVEAL
   ========================================================================== */

let revealObserver;

function getRevealObserver() {
  if (revealObserver) return revealObserver;
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  return revealObserver;
}

function observeRevealTargets(elements) {
  const observer = getRevealObserver();
  elements.forEach((el) => observer.observe(el));
}

function initializeAnimations() {
  observeRevealTargets(document.querySelectorAll(".reveal"));
}

/* ==========================================================================
   8. STAT COUNTERS
   ========================================================================== */

function animateCount(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";

  // Infinity symbol: no counting needed
  if (suffix === "∞") {
    el.textContent = "∞";
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  }
  requestAnimationFrame(tick);
}

function initStatCounters() {
  const statsSection = document.getElementById("stats");
  if (!statsSection) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".stat-number").forEach(animateCount);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(statsSection);
}

/* ==========================================================================
   9. PROGRESS BARS
   ========================================================================== */

function observeProgressBars(elements) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = `${bar.dataset.progress}%`;
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   10. TIMELINE REVEAL
   ========================================================================== */

function initTimeline() {
  const steps = document.querySelectorAll(".timeline-step");
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.5 }
  );

  steps.forEach((step) => observer.observe(step));
  observeRevealTargets(steps);
}

/* ==========================================================================
   11. HERO PARTICLES
   ========================================================================== */

function initializeParticles() {
  const container = document.getElementById("heroParticles");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const count = window.innerWidth < 768 ? 18 : 34;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${Math.random() * 20}%`;
    particle.style.animationDuration = `${8 + Math.random() * 10}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.opacity = String(0.3 + Math.random() * 0.5);
    container.appendChild(particle);
  }
}

/* ==========================================================================
   12. CURSOR GLOW + CARD SPOTLIGHT + TILT
   ========================================================================== */

function initializeCardEffects() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none)").matches;
  const glow = document.getElementById("cursor-glow");

  if (!prefersReducedMotion && !isTouchDevice) {
    document.addEventListener("mousemove", (e) => {
      if (glow) {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    });
  }

  // Card spotlight + subtle 3D tilt (delegated so it works for re-rendered cards)
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".website-card");
    if (!card || prefersReducedMotion || isTouchDevice) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);

    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener(
    "mouseleave",
    (e) => {
      const card = e.target && e.target.closest ? e.target.closest(".website-card") : null;
      if (card) {
        card.style.transform = "";
      }
    },
    true
  );
}

/* ==========================================================================
   13. MAGNETIC BUTTONS
   ========================================================================== */

function initMagneticButtons() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none)").matches;
  if (prefersReducedMotion || isTouchDevice) return;

  const buttons = document.querySelectorAll(".magnetic");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ==========================================================================
   14. INIT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("footerYear").textContent = new Date().getFullYear();

  initPreloader();
  renderWebsites();
  renderUpcoming();
  renderFeatured();
  renderStats();
  renderSocial();

  initFilters();
  initModal();
  initializeNavbar();
  initializeAnimations();
  initStatCounters();
  initTimeline();
  initializeParticles();
  initializeCardEffects();
  initMagneticButtons();
});
