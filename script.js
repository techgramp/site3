/* Chien d'amour — interactions & analytics hooks */
(function () {
  "use strict";

  /* ---------- nav: compact + solid on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  var backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  var savedScroll = 0;
  function setMenu(open) {
    if (open) savedScroll = window.scrollY || window.pageYOffset || 0;
    links.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      document.body.style.position = "fixed";
      document.body.style.top = -savedScroll + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScroll);
    }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setMenu(!links.classList.contains("open"));
  });
  backdrop.addEventListener("click", function () { setMenu(false); });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("open")) setMenu(false);
  });
  // reset if resized back to desktop while open
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1200 && links.classList.contains("open")) setMenu(false);
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- gallery lightbox ---------- */
  var figures = Array.prototype.slice.call(document.querySelectorAll(".photo-grid .ph"));
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var current = 0;

  function show(i) {
    current = (i + figures.length) % figures.length;
    var img = figures[current].querySelector("img");
    var cap = figures[current].querySelector("figcaption");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent : "";
  }
  function openLb(i) { show(i); lightbox.classList.add("active"); document.body.style.overflow = "hidden"; }
  function closeLb() { lightbox.classList.remove("active"); document.body.style.overflow = ""; }

  figures.forEach(function (fig, i) { fig.addEventListener("click", function () { openLb(i); }); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  }

  /* ---------- FAQ: close others when one opens ---------- */
  var faqs = document.querySelectorAll(".faq-item");
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) faqs.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* ---------- copy phone number ---------- */
  var copyBtn = document.getElementById("copyNumber");
  if (copyBtn) {
    var label = copyBtn.querySelector(".copy-label");
    copyBtn.addEventListener("click", function () {
      var number = copyBtn.getAttribute("data-number");
      function done() {
        copyBtn.classList.add("copied");
        label.textContent = "Copied!";
        track("copy_number_click", {});
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          label.textContent = "Copy Number";
        }, 2000);
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = number;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(done).catch(fallback);
      } else { fallback(); }
    });
  }

  /* ---------- GA4 event tracking (activates once GA snippet is enabled) ----------
     Event names: book_grooming_click, call_amber_click, text_amber_click,
     directions_click, facebook_click, woodlands_referral_click,
     service_card_click, copy_number_click */
  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }
  document.querySelectorAll("[data-event]").forEach(function (el) {
    el.addEventListener("click", function () {
      track(el.getAttribute("data-event"), { link_url: el.getAttribute("href") || "" });
    });
  });
  document.querySelectorAll(".menu-list li[data-service]").forEach(function (li) {
    li.addEventListener("click", function () {
      track("service_card_click", { service_name: li.getAttribute("data-service") });
    });
  });

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- gold scroll progress trail with a bow ---------- */
(function () {
  var trail = document.createElement("div");
  trail.className = "scroll-trail";
  trail.setAttribute("aria-hidden", "true");
  trail.innerHTML = '<div class="scroll-trail-fill"></div>' +
    '<span class="scroll-bow"><svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M11 12 4.6 7.2a1 1 0 0 0-1.6.8v8a1 1 0 0 0 1.6.8L11 12z"/>' +
    '<path d="M13 12l6.4-4.8a1 1 0 0 1 1.6.8v8a1 1 0 0 1-1.6.8L13 12z"/>' +
    '<circle cx="12" cy="12" r="2.3"/></svg></span>';
  document.body.appendChild(trail);
  var fill = trail.querySelector(".scroll-trail-fill");
  var bow = trail.querySelector(".scroll-bow");
  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    fill.style.width = pct + "%";
    bow.style.left = pct + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ---------- day / night theme ----------
   Follows the operating system's light/dark setting by default and
   live-updates if the OS switches. A manual toggle overrides it for
   the rest of the visit. */
(function () {
  var btn = document.getElementById("themeToggle");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function manualChoice() {
    try { return window.sessionStorage.getItem("cdaTheme"); } catch (e) { return null; }
  }
  function apply(night) {
    document.body.classList.toggle("theme-night", night);
    document.documentElement.classList.toggle("theme-night-pre", night);
    if (btn) {
      btn.setAttribute("aria-label", night ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("aria-pressed", night ? "true" : "false");
    }
  }
  apply(manualChoice() ? manualChoice() === "night" : (mq ? mq.matches : false));
  if (btn) {
    btn.addEventListener("click", function () {
      var night = !document.body.classList.contains("theme-night");
      apply(night);
      try { window.sessionStorage.setItem("cdaTheme", night ? "night" : "day"); } catch (e) {}
    });
  }
  if (mq) {
    var onChange = function () { if (!manualChoice()) apply(mq.matches); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();

/* ---------- Groom Builder estimator ---------- */
(function () {
  var card = document.querySelector(".gb-card");
  if (!card) return;

  var PRICES = {
    full: { s: 80, m: 95,  l: 110, xl: 130, label: "Full-service groom" },
    bath: { s: 45, m: 55,  l: 65,  xl: 75,  label: "Bath & tidy" }
  };
  var SIZE_LABELS = { s: "small", m: "medium", l: "large", xl: "X-large" };
  var ADDONS = { ear: "Ear trimming", nail: "Nail trim only" };

  var linesEl = document.getElementById("gbLines");
  var totalEl = document.getElementById("gbTotal");
  var loyalEl = document.getElementById("gbLoyal");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var shown = 0;

  function fmt(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  function compute() {
    var svc = card.querySelector('input[name="svc"]:checked').value;
    var size = card.querySelector('input[name="size"]:checked').value;
    var base = PRICES[svc][size];
    var lines = [[PRICES[svc].label + ", " + SIZE_LABELS[size], "from " + fmt(base), ""]];
    var total = base;

    card.querySelectorAll(".gb-addons input:checked").forEach(function (cb) {
      var p = parseInt(cb.getAttribute("data-price"), 10);
      lines.push([ADDONS[cb.getAttribute("data-addon")], fmt(p), ""]);
      total += p;
    });

    if (loyalEl && loyalEl.checked) {
      var save = total * 0.10;
      lines.push(["Grooming regular discount, 10%", "\u2212" + fmt(save), "gb-save"]);
      total -= save;
    }

    linesEl.innerHTML = lines.map(function (l) {
      return '<li class="' + l[2] + '"><span>' + l[0] + "</span><strong>" + l[1] + "</strong></li>";
    }).join("");

    animate(total);
  }

  function animate(target) {
    if (reduced) { shown = target; totalEl.textContent = fmt(target); return; }
    var start = shown, t0 = null, dur = 350;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      totalEl.textContent = fmt(start + (target - start) * e);
      if (p < 1) requestAnimationFrame(tick); else shown = target;
    }
    requestAnimationFrame(tick);
  }

  card.querySelectorAll('input[name="svc"], input[name="size"], .gb-addons input').forEach(function (el) {
    el.addEventListener("change", compute);
  });
  if (loyalEl) loyalEl.addEventListener("change", compute);
  compute();
})();
