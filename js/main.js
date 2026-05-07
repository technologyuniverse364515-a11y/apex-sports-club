/* ============================================================
   APEX SPORTS CLUB — Dynamic Renderer
   Everything is read from /config/*.js (BUTTONS, TEXT, IMAGES, MESSAGES)
   Change config files = brand-new website.
   ============================================================ */

(function () {
  const T = window.TEXT || {};
  const B = window.BUTTONS || {};
  const I = window.IMAGES || {};
  const M = window.MESSAGES || {};

  /* ---------- Helpers ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const setText = (sel, v) => { const el = $(sel); if (el && v != null) el.textContent = v; };
  const setHTML = (sel, v) => { const el = $(sel); if (el && v != null) el.innerHTML = v; };
  const setSrc  = (sel, v) => { const el = $(sel); if (el && v) el.setAttribute("src", v); };
  const setBg   = (sel, v) => { const el = $(sel); if (el && v) el.style.backgroundImage = `url('${v}')`; };

  function renderButton(sel, key, classes = "btn btn-primary") {
    const el = $(sel); if (!el || !B[key]) return;
    const b = B[key];
    el.textContent = "";
    el.className = classes;
    el.setAttribute("href", b.link);
    const span = document.createElement("span"); span.textContent = b.text;
    const arr  = document.createElement("span"); arr.className = "arrow"; arr.textContent = "→";
    el.appendChild(span); el.appendChild(arr);
  }

  /* ---------- Header (every page) ---------- */
  function renderHeader() {
    setText("[data-brand-name]", T.brandName);
    setText("[data-brand-tag]",  T.brandTag);
    setText("[data-brand-mark]", (T.brandName || "A").charAt(0));

    const nav = $("[data-nav-links]");
    if (nav) {
      const here = (location.pathname.split("/").pop() || "club.html").toLowerCase();
      const links = [
        { label: T.navHome,    href: "club.html"   },
        { label: T.navAbout,   href: "about.html"   },
        { label: T.navSports,  href: "sports.html"  },
        { label: T.navGallery, href: "gallery.html" },
        { label: T.navContact, href: "contact.html" },
      ];
      nav.innerHTML = links.map(l => {
        const active = here === l.href ? " class=\"active\"" : "";
        return `<li><a href="${l.href}"${active}>${l.label}</a></li>`;
      }).join("");

      // Append nav CTA
      const cta = document.createElement("li");
      cta.innerHTML = `<a class="nav-cta" href="${B.joinNow.link}">${B.joinNow.text}</a>`;
      nav.appendChild(cta);
    }

    // Mobile toggle
    const tgl = $("[data-menu-toggle]");
    const list = $("[data-nav-links]");
    if (tgl && list) {
      tgl.addEventListener("click", () => list.classList.toggle("open"));
      list.addEventListener("click", e => {
        if (e.target.tagName === "A") list.classList.remove("open");
      });
    }

    // Scroll bg
    const header = $(".header");
    if (header) {
      const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    setText("[data-footer-brand]", T.brandName);
    setText("[data-footer-tag]",   T.brandTag);
    setText("[data-footer-mark]",  (T.brandName || "A").charAt(0));
    setText("[data-footer-tagline]", T.footerTagline);
    setText("[data-footer-rights]",  T.footerRights);

    const explore = $("[data-footer-explore]");
    if (explore) {
      explore.innerHTML = [
        ["club.html",   T.navHome],
        ["about.html",   T.navAbout],
        ["sports.html",  T.navSports],
        ["gallery.html", T.navGallery],
        ["contact.html", T.navContact],
      ].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("");
    }
    const contact = $("[data-footer-contact]");
    if (contact) {
      contact.innerHTML = `
        <li><a href="tel:${(T.contactPhone||"").replace(/\s/g,"")}">${T.contactPhone || ""}</a></li>
        <li><a href="mailto:${T.contactEmail || ""}">${T.contactEmail || ""}</a></li>
        <li><a href="#">${T.contactAddress || ""}</a></li>
      `;
    }
  }

  /* ---------- Page-specific renderers ---------- */
  function renderHome() {
    if (!$("[data-page='home']")) return;

    setSrc("[data-hero-img]", I.hero);
    setText("[data-hero-eyebrow]", T.heroEyebrow);
    // Highlight last word in accent color
    const title = T.heroTitle || "";
    const lines = title.split("\n");
    const html = lines.map((ln, i) =>
      i === lines.length - 1
        ? ln.replace(/(\S+)$/, '<span class="accent">$1</span>')
        : ln
    ).join("<br/>");
    setHTML("[data-hero-title]", html);
    setText("[data-hero-sub]", T.heroSubtitle);
    renderButton("[data-btn-join]",    "joinNow",       "btn btn-primary");
    renderButton("[data-btn-explore]", "exploreSports", "btn btn-ghost");

    // Stats
    const stats = [
      [T.stat1Value, T.stat1Label],
      [T.stat2Value, T.stat2Label],
      [T.stat3Value, T.stat3Label],
      [T.stat4Value, T.stat4Label],
    ];
    const sg = $("[data-stats]");
    if (sg) sg.innerHTML = stats.map(([v, l]) =>
      `<div><div class="stat-value">${v}</div><div class="stat-label">${l}</div></div>`
    ).join("");

    // Intro
    setText("[data-intro-eyebrow]", T.introEyebrow);
    setText("[data-intro-title]",   T.introTitle);
    setText("[data-intro-text]",    T.introText);
    setSrc ("[data-intro-img]",     I.introBg);
    renderButton("[data-btn-learn]", "learnMore", "btn btn-dark");

    // Sports preview
    setText("[data-sports-title]",    T.sportsPreviewTitle);
    setText("[data-sports-subtitle]", T.sportsPreviewSubtitle);
    renderSportsGrid("[data-sports-grid]");

    // CTA banner
    setSrc("[data-cta-img]", I.ctaBanner);
    setText("[data-cta-title]", T.ctaBannerTitle);
    setText("[data-cta-sub]",   T.ctaBannerSubtitle);
    renderButton("[data-btn-cta-join]",    "joinNow",   "btn btn-primary");
    renderButton("[data-btn-cta-contact]", "contactUs", "btn btn-ghost");
  }

  function renderSportsGrid(sel) {
    const grid = $(sel); if (!grid) return;
    const list = Array.isArray(T.sports) ? T.sports : [];
    grid.innerHTML = list.map((s, i) => {
      const num = String(i + 1).padStart(2, "0");
      const img = I[s.img] || s.img || "";
      const level = s.level ? `<span class="sport-level">${s.level}</span>` : "";
      return `
      <article class="sport-card reveal">
        <img src="${img}" alt="${s.name}" loading="lazy"/>
        <div class="sport-card-content">
          <div class="sport-card-num">${num} / DISCIPLINE ${level}</div>
          <h3>${s.name}</h3>
          <p class="sport-card-desc">${s.desc}</p>
          <div class="sport-tags">
            ${(s.tags || []).map(t => `<span class="sport-tag">${t}</span>`).join("")}
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function renderAbout() {
    if (!$("[data-page='about']")) return;
    setText("[data-page-title]",    T.aboutTitle);
    setText("[data-page-subtitle]", T.aboutEyebrow);

    setText("[data-about-eyebrow]", T.aboutEyebrow);
    setText("[data-about-title]",   T.aboutTitle);
    setText("[data-about-text]",    T.aboutText);
    setSrc ("[data-about-main]",    I.aboutMain);
    setSrc ("[data-about-side]",    I.aboutSide);

    setText("[data-mission-title]", T.missionTitle);
    setText("[data-mission-text]",  T.missionText);
    setText("[data-vision-title]",  T.visionTitle);
    setText("[data-vision-text]",   T.visionText);

    setText("[data-coaches-title]",    T.coachesTitle);
    setText("[data-coaches-subtitle]", T.coachesSubtitle);
    const coaches = [
      { n: T.coach1Name, r: T.coach1Role, b: T.coach1Bio, img: I.coach1 },
      { n: T.coach2Name, r: T.coach2Role, b: T.coach2Bio, img: I.coach2 },
      { n: T.coach3Name, r: T.coach3Role, b: T.coach3Bio, img: I.coach3 },
    ];
    const grid = $("[data-coaches-grid]");
    if (grid) grid.innerHTML = coaches.map(c => `
      <article class="coach-card reveal">
        <div class="coach-img"><img src="${c.img}" alt="${c.n}" loading="lazy"/></div>
        <div class="coach-body">
          <div class="coach-role">${c.r}</div>
          <h3>${c.n}</h3>
          <p>${c.b}</p>
        </div>
      </article>
    `).join("");

    renderButton("[data-btn-cta-join]",    "joinNow",   "btn btn-primary");
    renderButton("[data-btn-cta-contact]", "contactUs", "btn btn-ghost");
    setSrc("[data-cta-img]", I.ctaBanner);
    setText("[data-cta-title]", T.ctaBannerTitle);
    setText("[data-cta-sub]",   T.ctaBannerSubtitle);
  }

  function renderSports() {
    if (!$("[data-page='sports']")) return;
    setText("[data-page-title]",    T.sportsPageTitle);
    setText("[data-page-subtitle]", T.sportsPageEyebrow);

    setText("[data-sports-eyebrow]",  T.sportsPageEyebrow);
    setText("[data-sports-title]",    T.sportsPageTitle);
    setText("[data-sports-subtitle]", T.sportsPageSubtitle);
    renderSportsGrid("[data-sports-grid]");

    setSrc("[data-cta-img]", I.ctaBanner);
    setText("[data-cta-title]", T.ctaBannerTitle);
    setText("[data-cta-sub]",   T.ctaBannerSubtitle);
    renderButton("[data-btn-cta-join]",    "joinNow",   "btn btn-primary");
    renderButton("[data-btn-cta-contact]", "contactUs", "btn btn-ghost");
  }

  function renderGallery() {
    if (!$("[data-page='gallery']")) return;
    setText("[data-page-title]",    T.galleryTitle);
    setText("[data-page-subtitle]", T.galleryEyebrow);

    setText("[data-gallery-eyebrow]",  T.galleryEyebrow);
    setText("[data-gallery-title]",    T.galleryTitle);
    setText("[data-gallery-subtitle]", T.gallerySubtitle);

    const items = [
      { img: I.gallery1, cls: "tall" },
      { img: I.gallery2, cls: "" },
      { img: I.gallery3, cls: "wide" },
      { img: I.gallery4, cls: "" },
      { img: I.gallery5, cls: "" },
      { img: I.gallery6, cls: "tall" },
      { img: I.gallery7, cls: "wide" },
      { img: I.gallery8, cls: "" },
      { img: I.gallery9, cls: "" },
      { img: I.gallery10, cls: "tall" },
      { img: I.gallery11, cls: "wide" },
      { img: I.gallery12, cls: "" },
      { img: I.gallery13, cls: "" },
      { img: I.gallery14, cls: "tall" },
    ];
    const grid = $("[data-gallery-grid]");
    if (grid) grid.innerHTML = items.map(it => `
      <div class="gallery-item reveal ${it.cls}">
        <img src="${it.img}" alt="Gallery image" loading="lazy"/>
      </div>
    `).join("");
  }

  function renderContact() {
    if (!$("[data-page='contact']")) return;
    setText("[data-page-title]",    T.contactTitle);
    setText("[data-page-subtitle]", T.contactEyebrow);

    setText("[data-contact-eyebrow]",  T.contactEyebrow);
    setText("[data-contact-title]",    T.contactTitle);
    setText("[data-contact-subtitle]", T.contactSubtitle);

    setText("[data-info-title]",   T.contactInfoTitle);
    setText("[data-info-address]", T.contactAddress);
    setText("[data-info-phone]",   T.contactPhone);
    setText("[data-info-email]",   T.contactEmail);
    setText("[data-info-hours]",   T.contactHours);

    setText("[data-label-name]",    T.formNameLabel);
    setText("[data-label-email]",   T.formEmailLabel);
    setText("[data-label-phone]",   T.formPhoneLabel);
    setText("[data-label-message]", T.formMessageLabel);

    const submit = $("[data-form-submit]");
    if (submit) submit.textContent = B.submitForm.text;

    // Form handling
    const form = $("[data-contact-form]");
    const msg  = $("[data-form-msg]");
    if (form && msg) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = (fd.get("name")||"").toString().trim();
        const email= (fd.get("email")||"").toString().trim();
        const message = (fd.get("message")||"").toString().trim();

        if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
          msg.className = "form-msg show error";
          msg.textContent = M.formInvalid;
          return;
        }
        msg.className = "form-msg show success";
        msg.textContent = M.contactSuccess;
        form.reset();
        setTimeout(() => msg.classList.remove("show"), 5000);
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderHome();
    renderAbout();
    renderSports();
    renderGallery();
    renderContact();
    renderFooter();
    // Mark static .reveal items + auto-mark common blocks
    $$(".section, .hero-content, .intro-text, .intro-img, .mv-card, .stats-grid > div, .info-item")
      .forEach(el => el.classList.add("reveal"));
    requestAnimationFrame(initReveal);
  });
})();