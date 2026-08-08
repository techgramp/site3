/* Woodlands Pet Retreat — interactions */
(function () {
  "use strict";

  /* ---------- nav: solid on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
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
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1200 && links.classList.contains("open")) setMenu(false);
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- gallery lightbox ---------- */
  var figures = Array.prototype.slice.call(document.querySelectorAll(".photo-grid .ph"));
  var lightbox = document.getElementById("lightbox");
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
  function openLb(i) {
    show(i);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  figures.forEach(function (fig, i) {
    fig.addEventListener("click", function () { openLb(i); });
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });
  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ---------- FAQ: close others when one opens ---------- */
  var faqs = document.querySelectorAll(".faq-item");
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqs.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- CTA click tracking (activates once GA4 snippet is enabled) ---------- */
(function () {
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (typeof window.gtag === "function") {
        window.gtag("event", "cta_click", {
          cta_name: el.getAttribute("data-cta"),
          cta_url: el.getAttribute("href") || ""
        });
      }
    });
  });
})();

/* ---------- copy phone number / email buttons ---------- */
function wireCopyButton(btnId, dataAttr, labelClass, defaultText) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  var label = btn.querySelector("." + labelClass);
  btn.addEventListener("click", function () {
    var value = btn.getAttribute(dataAttr);
    function done() {
      btn.classList.add("copied");
      label.textContent = "Copied!";
      setTimeout(function () {
        btn.classList.remove("copied");
        label.textContent = defaultText;
      }, 2000);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(fallback);
    } else {
      fallback();
    }
  });
}
wireCopyButton("copyNumber", "data-number", "copy-label", "Copy Number");
wireCopyButton("copyEmail", "data-email", "copy-email-label", "Copy Email");

/* ---------- paw-print scroll trail (injected so both pages get it) ---------- */
(function () {
  var trail = document.createElement("div");
  trail.className = "scroll-trail";
  trail.setAttribute("aria-hidden", "true");
  trail.innerHTML = '<div class="scroll-trail-fill"></div>' +
    '<span class="scroll-paw"><svg viewBox="0 0 24 24" fill="currentColor">' +
    '<circle cx="11" cy="4.5" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="5" cy="7" r="2"/>' +
    '<circle cx="8" cy="11" r="1.8"/><circle cx="14" cy="11" r="1.8"/>' +
    '<path d="M11 13.5c-3 0-5.4 2.1-5.4 4.5 0 1.6 1.3 2.5 2.8 2.2 1-.2 1.7-.6 2.6-.6s1.6.4 2.6.6c1.5.3 2.8-.6 2.8-2.2 0-2.4-2.4-4.5-5.4-4.5z"/></svg></span>';
  document.body.appendChild(trail);
  var fill = trail.querySelector(".scroll-trail-fill");
  var paw = trail.querySelector(".scroll-paw");
  function updateTrail() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    fill.style.width = pct + "%";
    paw.style.left = pct + "%";
  }
  window.addEventListener("scroll", updateTrail, { passive: true });
  window.addEventListener("resize", updateTrail);
  updateTrail();
})();

/* ---------- Stay Builder estimator ---------- */
(function () {
  var card = document.querySelector(".est-card");
  if (!card) return;

  var RATES = {
    basic:  { label: "Basic suite",  price: 45, unit: "night", extraDog: 20 },
    deluxe: { label: "Deluxe suite", price: 65, unit: "night", extraDog: 20 },
    day:    { label: "Day stay",     price: 25, unit: "day",  extraDog: 10 }
  };
  var ADDON_LABELS = {
    photo: "Daily photo update",
    walkShort: "Nature walk (10 to 15 min)",
    walkLong: "Nature walk (25 to 30 min)",
    play: "Extended play session",
    egg: "Sunrise Scramble"
  };

  var state = { type: "basic", nights: 3, dogs: 1 };
  var linesEl = document.getElementById("estLines");
  var totalEl = document.getElementById("estTotal");
  var nightsEl = document.getElementById("nightsVal");
  var dogsEl = document.getElementById("dogsVal");
  var unitLabel = document.getElementById("unitLabel");
  var dogNote = document.getElementById("dogNote");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var shownTotal = 0;

  function fmt(n) { return "$" + n.toLocaleString("en-US"); }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function compute() {
    var r = RATES[state.type];
    var n = state.nights;
    var lines = [];
    var base = r.price * n;
    lines.push([r.label + ", " + plural(n, r.unit), fmt(base)]);
    var total = base;

    var extras = state.dogs - 1;
    if (extras > 0) {
      var dogCost = extras * r.extraDog * n;
      lines.push([plural(extras, "additional dog") + ", same suite", fmt(dogCost)]);
      total += dogCost;
    }

    card.querySelectorAll(".est-addons input:checked").forEach(function (cb) {
      var price = parseInt(cb.getAttribute("data-price"), 10) * n;
      lines.push([ADDON_LABELS[cb.getAttribute("data-addon")], fmt(price)]);
      total += price;
    });

    linesEl.innerHTML = lines.map(function (l) {
      return "<li><span>" + l[0] + "</span><strong>" + l[1] + "</strong></li>";
    }).join("");

    animateTotal(total);
  }

  function animateTotal(target) {
    if (reduced) { shownTotal = target; totalEl.textContent = fmt(target); return; }
    var start = shownTotal, t0 = null, dur = 350;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      totalEl.textContent = fmt(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
      else shownTotal = target;
    }
    requestAnimationFrame(tick);
  }

  card.querySelectorAll('input[name="stayType"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      state.type = radio.value;
      var r = RATES[state.type];
      unitLabel.textContent = r.unit === "night" ? "Nights" : "Days";
      dogNote.textContent = "(+$" + r.extraDog + "/" + r.unit + " each additional)";
      compute();
    });
  });

  card.querySelectorAll(".step-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-step");
      var dir = parseInt(btn.getAttribute("data-dir"), 10);
      if (key === "nights") state.nights = Math.max(1, Math.min(30, state.nights + dir));
      if (key === "dogs") state.dogs = Math.max(1, Math.min(4, state.dogs + dir));
      nightsEl.textContent = state.nights;
      dogsEl.textContent = state.dogs;
      compute();
    });
  });

  card.querySelectorAll(".est-addons input").forEach(function (cb) {
    cb.addEventListener("change", compute);
  });

  compute();
})();

/* ---------- day / night theme ----------
   Follows the operating system's light/dark setting by default, and
   live-updates if the OS switches while the page is open. A manual
   toggle overrides it for the rest of the visit. */
(function () {
  var btn = document.getElementById("themeToggle");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function osPrefersDark() { return mq ? mq.matches : false; }

  function apply(night) {
    document.body.classList.toggle("theme-night", night);
    document.documentElement.classList.toggle("theme-night-pre", night);
    if (btn) {
      btn.setAttribute("aria-label", night ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("aria-pressed", night ? "true" : "false");
    }
  }

  function manualChoice() {
    try { return window.sessionStorage.getItem("wprTheme"); } catch (e) { return null; }
  }

  apply(manualChoice() ? manualChoice() === "night" : osPrefersDark());

  if (btn) {
    btn.addEventListener("click", function () {
      var night = !document.body.classList.contains("theme-night");
      apply(night);
      try { window.sessionStorage.setItem("wprTheme", night ? "night" : "day"); } catch (e) {}
    });
  }

  // follow the OS if the visitor hasn't chosen manually
  if (mq) {
    var onChange = function () { if (!manualChoice()) apply(mq.matches); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
