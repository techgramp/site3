/* Woodlands Pet Retreat — interactions */
(function () {
  "use strict";

  /* ---------- nav: solid on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
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
  }

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

/* ---------- faint paw background ----------
   Paws, bones and water bowls drift slowly across the page at very low
   opacity. On devices with a mouse, nearby shapes glide away from the
   cursor. Skipped entirely for visitors who prefer reduced motion. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var ICONS = {
    paw: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="14" ry="12"/><ellipse cx="14" cy="26" rx="6" ry="8" transform="rotate(-18 14 26)"/><ellipse cx="26" cy="16" rx="6" ry="8"/><ellipse cx="38" cy="16" rx="6" ry="8"/><ellipse cx="50" cy="26" rx="6" ry="8" transform="rotate(18 50 26)"/></svg>',
    bone: '<svg viewBox="0 0 64 64"><path d="M14 22a7 7 0 1 1 9-7l18 18a7 7 0 1 1 7 9 7 7 0 1 1-9 7L21 31a7 7 0 1 1-7-9z" transform="rotate(-8 32 32)"/></svg>',
    bowl: '<svg viewBox="0 0 64 64"><path d="M32 4c5 8 9 13 9 18a9 9 0 0 1-18 0c0-5 4-10 9-18z"/><path d="M6 38h52l-5 16a6 6 0 0 1-6 4H17a6 6 0 0 1-6-4z"/><rect x="4" y="33" width="56" height="6" rx="3"/></svg>'
  };
  var small = window.innerWidth < 700;
  var spots = [
    [6, 14, "paw", 46, -18], [22, 72, "bone", 54, 20], [38, 30, "paw", 38, 12], [55, 86, "bowl", 56, 0],
    [70, 18, "bone", 48, -30], [86, 58, "paw", 52, 24], [12, 48, "bowl", 50, 0], [48, 55, "paw", 34, -8],
    [92, 10, "paw", 36, 32], [30, 92, "paw", 44, -26], [78, 88, "bone", 44, 40], [62, 40, "paw", 40, 16]
  ];
  if (small) spots = spots.slice(0, 7);
  var layer = document.createElement("div");
  layer.className = "paw-bg";
  layer.setAttribute("aria-hidden", "true");
  var items = spots.map(function (s, i) {
    var el = document.createElement("span");
    el.className = "paw-bg-item";
    el.style.left = s[0] + "%"; el.style.top = s[1] + "%";
    el.style.width = el.style.height = (small ? s[3] * 0.8 : s[3]) + "px";
    el.innerHTML = '<span class="paw-bg-float" style="--r:' + s[4] + 'deg;--dur:' + (16 + (i * 7) % 12) + 's;--delay:-' + (i * 3) % 11 + 's">' + ICONS[s[2]] + "</span>";
    layer.appendChild(el);
    return { el: el, x: 0, y: 0 };
  });
  document.body.appendChild(layer);

  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var mx = -9999, my = -9999, queued = false, R = 150, PUSH = 70;
  function update() {
    queued = false;
    var rects = items.map(function (it) { return it.el.getBoundingClientRect(); });
    items.forEach(function (it, i) {
      var r = rects[i];
      var cx = r.left + r.width / 2 - it.x, cy = r.top + r.height / 2 - it.y;
      var dx = cx - mx, dy = cy - my, d = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = 0, ny = 0;
      if (d < R) { var f = (R - d) / R * PUSH; nx = dx / d * f; ny = dy / d * f; }
      if (Math.abs(nx - it.x) > 0.5 || Math.abs(ny - it.y) > 0.5) {
        it.x = nx; it.y = ny;
        it.el.style.transform = "translate(" + nx.toFixed(1) + "px," + ny.toFixed(1) + "px)";
      }
    });
  }
  document.addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  document.addEventListener("pointerleave", function () { mx = my = -9999; requestAnimationFrame(update); });
})();

/* ---------- photo viewer ----------
   Every content photo on the page opens in one shared viewer. Click or
   double-tap the enlarged photo to zoom 2.5x, move to pan, swipe or use
   the arrow keys to browse. The viewer is built here so every page gets
   the same markup. */
(function () {
  var imgs = [].slice.call(document.querySelectorAll("img")).filter(function (img) {
    var src = img.getAttribute("src") || "";
    return /\.(webp|jpe?g)(\?|$)/i.test(src) &&
      !img.closest("nav, footer, .site-nav, .app-strip, #lightbox, noscript");
  });
  if (!imgs.length) return;

  var box = document.createElement("div");
  box.id = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.innerHTML = '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-arrow lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure><div class="lb-stage"><img id="lb-img" alt=""></div><figcaption id="lb-cap"></figcaption></figure>' +
    '<button type="button" class="lb-arrow lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(box);
  var big = box.querySelector("#lb-img"), cap = box.querySelector("#lb-cap");
  var closeBtn = box.querySelector(".lb-close");
  var current = 0, lastFocus = null, zoomed = false;
  var single = imgs.length < 2;
  box.classList.toggle("lb-single", single);

  function setZoom(on, x, y) {
    zoomed = on;
    box.classList.toggle("zoomed", on);
    if (on && x !== undefined) pan(x, y);
    if (!on) big.style.transformOrigin = "";
  }
  function pan(x, y) {
    var r = big.getBoundingClientRect();
    var px = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
    var py = Math.max(0, Math.min(100, ((y - r.top) / r.height) * 100));
    big.style.transformOrigin = px + "% " + py + "%";
  }
  function show(i) {
    current = (i + imgs.length) % imgs.length;
    var img = imgs[current], fig = img.closest("figure");
    var fc = fig && fig.querySelector("figcaption");
    setZoom(false);
    big.src = img.getAttribute("data-full") || img.src;
    big.alt = img.alt || "";
    cap.textContent = fc ? fc.textContent.trim() : (img.alt || "");
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add("active");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close() {
    box.classList.remove("active");
    setZoom(false);
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  imgs.forEach(function (img, i) {
    img.classList.add("zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "View larger: " + (img.alt || "photo"));
    var target = img.closest(".ph") || img;
    target.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  box.addEventListener("click", function (e) { if (e.target === box || e.target.tagName === "FIGURE") close(); });
  closeBtn.addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  big.addEventListener("click", function (e) { setZoom(!zoomed, e.clientX, e.clientY); });
  big.addEventListener("mousemove", function (e) { if (zoomed) pan(e.clientX, e.clientY); });

  var tx = null, ty = null;
  big.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) { tx = null; return; }
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  big.addEventListener("touchmove", function (e) {
    if (zoomed && e.touches.length === 1) { e.preventDefault(); pan(e.touches[0].clientX, e.touches[0].clientY); }
  }, { passive: false });
  big.addEventListener("touchend", function (e) {
    if (tx === null || zoomed || single) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    tx = null;
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("active")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      var f = [].slice.call(box.querySelectorAll("button")).filter(function (b) { return b.offsetParent; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

/* ---------- Stay Builder estimator ----------
   Runs once per .est-card on the page. Everything is looked up inside
   the card rather than by document id, so the calculator can appear on
   more than one page (and more than once on a page) without the ids
   colliding. Pricing rules live in the constants below. */
(function () {
  var RATES = {
    basic:  { label: "Basic suite",  price: 45, unit: "night", extraDog: 20 },
    deluxe: { label: "Deluxe suite", price: 65, unit: "night", extraDog: 20 },
    day:    { label: "Day stay",     price: 25, unit: "day",  extraDog: 10 }
  };
  var MONTH_MIN = 28, MONTH_PCT = 0.20;   // Month-Long Stay: 28+ nights, 20% off lodging, free daily photos
  var COMMUNITY_PCT = 0.05;               // firefighter / law enforcement / military, boarding only
  var DAY_FEE = { price: 25, extraDog: 10 }; // early drop-off + late pick-up
  var MAX_NIGHTS = 365, MAX_DOGS = 10;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmt(n) {
    var r = Math.round(n * 100) / 100;
    return "$" + r.toLocaleString("en-US", { minimumFractionDigits: r % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function parseDate(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function toISO(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function prettyDate(v) {
    var ms = parseDate(v);
    return ms === null ? "" : new Date(ms).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });
  }
  var DAY_MS = 86400000;

  function setup(card) {
    var q = function (s) { return card.querySelector(s); };
    var linesEl = q("[data-est=lines]"), totalEl = q("[data-est=total]");
    if (!linesEl || !totalEl) return;
    var nightsIn = q("[data-est=nights]"), dogsIn = q("[data-est=dogs]");
    var unitLabel = q("[data-est=unit]"), dogNote = q("[data-est=dognote]");
    var inDate = q("[data-est=in]"), outDate = q("[data-est=out]");
    var inTime = q("[data-est=inTime]"), outTime = q("[data-est=outTime]");
    var community = q("[data-est=community]");
    var badgeEl = q("[data-est=badge]"), hintEl = q("[data-est=hint]"), avgEl = q("[data-est=avg]");
    var copyBtn = q("[data-est=copy]"), smsLink = q("[data-est=sms]");
    var addons = [].slice.call(card.querySelectorAll(".est-addon"));
    var state = { type: "basic", nights: 1, dogs: 1 };
    var shownTotal = 0, quoteText = "";

    var checked = q(".est-pills input:checked");
    if (checked) state.type = checked.value;
    if (nightsIn) state.nights = clamp(parseInt(nightsIn.value, 10) || 1, 1, MAX_NIGHTS);

    if (inDate) {
      var now = new Date();
      var today = toISO(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      inDate.min = today;
      if (outDate) outDate.min = today;
    }

    function animateTotal(target) {
      if (reduced) { shownTotal = target; totalEl.textContent = fmt(target); return; }
      var start = shownTotal, t0 = null, dur = 350;
      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        totalEl.textContent = fmt(start + (target - start) * eased);
        if (p < 1) requestAnimationFrame(tick);
        else { shownTotal = target; totalEl.textContent = fmt(target); }
      }
      requestAnimationFrame(tick);
    }

    function syncOutDate() {
      if (!inDate || !outDate) return;
      var a = parseDate(inDate.value);
      if (a === null) return;
      outDate.min = toISO(a + DAY_MS);
      var span = RATES[state.type].unit === "night" ? state.nights : state.nights - 1;
      outDate.value = toISO(a + span * DAY_MS);
    }

    function fromDates() {
      var a = parseDate(inDate && inDate.value), b = parseDate(outDate && outDate.value);
      if (a === null || b === null) return false;
      var diff = Math.round((b - a) / DAY_MS);
      var n = RATES[state.type].unit === "night" ? diff : diff + 1;
      var ok = n >= 1;
      outDate.setAttribute("aria-invalid", ok ? "false" : "true");
      if (ok) setNights(n, true);
      return ok;
    }

    function setNights(n, keepDates) {
      state.nights = clamp(n, 1, MAX_NIGHTS);
      if (nightsIn) nightsIn.value = state.nights;
      addons.forEach(function (a) {
        var qty = a.querySelector(".est-qty input");
        if (qty && a.getAttribute("data-per") === "count" && !qty.hasAttribute("data-touched")) qty.value = state.nights;
      });
      if (!keepDates) syncOutDate();
    }

    function compute() {
      var r = RATES[state.type], n = state.nights, overnight = r.unit === "night";
      var lines = [], total = 0, extras = state.dogs - 1, quoted = [];
      var month = overnight && n >= MONTH_MIN;

      var lodging = r.price * n;
      lines.push([r.label + ", " + plural(n, r.unit), lodging]);
      if (extras > 0) {
        var dogCost = extras * r.extraDog * n;
        lines.push([plural(extras, "additional dog") + ", same suite", dogCost]);
        lodging += dogCost;
      }
      total += lodging;

      var discount = 0, discountLabel = "";
      if (month) { discount = lodging * MONTH_PCT; discountLabel = "Month-Long Stay savings (" + MONTH_PCT * 100 + "%)"; }
      else if (overnight && community && community.checked) { discount = lodging * COMMUNITY_PCT; discountLabel = "Community discount (" + COMMUNITY_PCT * 100 + "%)"; }
      if (discount) { lines.push([discountLabel, -discount, "save"]); total -= discount; }

      if (overnight && inTime && outTime && inTime.value === "am" && outTime.value === "late") {
        var fee = DAY_FEE.price + Math.max(0, extras) * DAY_FEE.extraDog;
        lines.push(["Day stay fee (morning drop-off, pick-up after 12:01 PM)", fee]);
        total += fee;
      }

      var photoIncluded = false;
      addons.forEach(function (a) {
        var cb = a.querySelector("input[type=checkbox]"), qtyWrap = a.querySelector(".est-qty");
        var on = cb && cb.checked;
        if (qtyWrap) qtyWrap.hidden = !on;
        a.classList.toggle("is-on", !!on);
        if (!on) return;
        var name = a.getAttribute("data-label"), per = a.getAttribute("data-per");
        var price = parseFloat(a.getAttribute("data-price")) || 0;
        if (per === "quote") { quoted.push(name); lines.push([name, "Quoted at booking"]); return; }
        var qtyIn = a.querySelector(".est-qty input");
        var qty = clamp(parseInt(qtyIn && qtyIn.value, 10) || 1, 1, 999);
        var count = per === "perday" ? qty * n : qty;
        var cost = price * count;
        var sum = a.querySelector(".est-qty-sum");
        if (month && a.getAttribute("data-addon") === "photo") {
          photoIncluded = true;
          lines.push([name + ", " + plural(count, "day"), "Included", "save"]);
          if (sum) sum.textContent = "Included";
          return;
        }
        if (sum) sum.textContent = "= " + fmt(cost);
        lines.push([name + " \u00d7 " + count, cost]);
        total += cost;
      });
      if (month && !photoIncluded) lines.push(["Daily photo update", "Included", "save"]);

      linesEl.innerHTML = lines.map(function (l) {
        var v = typeof l[1] === "number" ? (l[1] < 0 ? "\u2212" + fmt(-l[1]) : fmt(l[1])) : l[1];
        return "<li" + (l[2] ? ' class="est-' + l[2] + '"' : "") + "><span>" + l[0] + "</span><strong>" + v + "</strong></li>";
      }).join("");

      if (badgeEl) {
        var badge = month ? "Month-Long Stay pricing applied" : (discount ? "Community discount applied" : "");
        badgeEl.textContent = badge; badgeEl.hidden = !badge;
      }
      if (hintEl) {
        var left = MONTH_MIN - n, show = overnight && n >= 14 && left > 0;
        hintEl.textContent = show ? "Add " + plural(left, "more night") + " to unlock Month-Long Stay pricing: 20% off plus free daily photos." : "";
        hintEl.hidden = !show;
      }
      if (avgEl) {
        var avg = total / (n * state.dogs);
        avgEl.textContent = "About " + fmt(avg) + " per dog, per " + r.unit + (quoted.length ? ", plus quoted items" : "");
      }

      var parts = ["Woodlands Pet Retreat stay estimate"];
      if (inDate && inDate.value) parts.push("Drop-off: " + prettyDate(inDate.value) + (inTime && inTime.value ? ", " + inTime.options[inTime.selectedIndex].text : ""));
      if (outDate && outDate.value && overnight) parts.push("Pick-up: " + prettyDate(outDate.value) + (outTime && outTime.value ? ", " + outTime.options[outTime.selectedIndex].text : ""));
      lines.forEach(function (l) {
        parts.push(l[0] + ": " + (typeof l[1] === "number" ? (l[1] < 0 ? "-" + fmt(-l[1]) : fmt(l[1])) : l[1]));
      });
      parts.push("Estimated total: " + fmt(total));
      quoteText = parts.join("\n");
      if (smsLink) smsLink.href = "sms:+19126744709?&body=" + encodeURIComponent(quoteText);

      animateTotal(total);
    }

    function setType(type) {
      state.type = type;
      var r = RATES[type], overnight = r.unit === "night";
      card.classList.toggle("est-is-day", !overnight);
      if (unitLabel) unitLabel.textContent = overnight ? "Nights" : "Days";
      if (nightsIn) nightsIn.setAttribute("aria-label", overnight ? "Number of nights" : "Number of days");
      if (dogNote) dogNote.textContent = "(+$" + r.extraDog + "/" + r.unit + " each additional)";
      if (!fromDates()) syncOutDate();
      compute();
    }

    card.querySelectorAll(".est-pills input[type=radio]").forEach(function (radio) {
      radio.addEventListener("change", function () { if (radio.checked) setType(radio.value); });
    });

    card.querySelectorAll(".step-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-step");
        var dir = parseInt(btn.getAttribute("data-dir"), 10);
        if (key === "nights") setNights(state.nights + dir);
        if (key === "dogs") { state.dogs = clamp(state.dogs + dir, 1, MAX_DOGS); if (dogsIn) dogsIn.value = state.dogs; }
        compute();
      });
    });

    function bindNumber(input, onValid, lo, hi, getCurrent) {
      if (!input) return;
      input.addEventListener("input", function () {
        var v = parseInt(input.value, 10);
        if (!isNaN(v) && v >= lo && v <= hi) onValid(v);
      });
      input.addEventListener("change", function () {
        var v = parseInt(input.value, 10);
        onValid(isNaN(v) ? getCurrent() : clamp(v, lo, hi));
        input.value = getCurrent();
      });
    }
    bindNumber(nightsIn, function (v) { setNights(v); compute(); }, 1, MAX_NIGHTS, function () { return state.nights; });
    bindNumber(dogsIn, function (v) { state.dogs = v; compute(); }, 1, MAX_DOGS, function () { return state.dogs; });

    card.querySelectorAll(".est-chip").forEach(function (chip) {
      chip.addEventListener("click", function () { setNights(parseInt(chip.getAttribute("data-nights"), 10)); compute(); });
    });

    if (inDate) inDate.addEventListener("change", function () { if (!fromDates()) syncOutDate(); compute(); });
    if (outDate) outDate.addEventListener("change", function () { fromDates(); compute(); });
    [inTime, outTime, community].forEach(function (el) { if (el) el.addEventListener("change", compute); });

    addons.forEach(function (a) {
      var cb = a.querySelector("input[type=checkbox]"), qty = a.querySelector(".est-qty input");
      if (cb) cb.addEventListener("change", compute);
      if (qty) {
        if (a.getAttribute("data-per") === "count") qty.value = state.nights;
        qty.addEventListener("input", function () { qty.setAttribute("data-touched", ""); compute(); });
        qty.addEventListener("change", function () { qty.value = clamp(parseInt(qty.value, 10) || 1, 1, 999); compute(); });
      }
    });

    if (copyBtn) copyBtn.addEventListener("click", function () {
      var label = copyBtn.textContent;
      function done(ok) { copyBtn.textContent = ok ? "Quote copied" : "Copy failed"; setTimeout(function () { copyBtn.textContent = label; }, 2000); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(quoteText).then(function () { done(true); }, function () { done(false); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = quoteText; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done(ok);
      }
    });

    setType(state.type);
  }

  document.querySelectorAll(".est-card").forEach(setup);
})();

/* ---------- Meta Pixel conversion events ----------
   Fires standard Meta events from the buttons that already exist on the
   site, using their data-cta attributes. Booking clicks report as
   Schedule; calls, texts and emails report as Contact. Wrapped so the
   site works normally if the pixel is blocked or fails to load. */
(function () {
  function track(event, params) {
    try {
      if (typeof window.fbq === "function") window.fbq("track", event, params || {});
    } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("a, button") : null;
    if (!el) return;

    var cta = el.getAttribute("data-cta") || "";
    var href = el.getAttribute("href") || "";

    // Booking: the Gingr portal is the conversion that matters most
    if (href.indexOf("gingrapp.com") !== -1) {
      track("Schedule", { content_name: "Woodlands booking", content_category: "boarding" });
      return;
    }
    // Phone and text
    if (href.indexOf("tel:") === 0) {
      track("Contact", { content_name: "Phone call", content_category: "call" });
      return;
    }
    if (href.indexOf("sms:") === 0) {
      track("Contact", { content_name: "Text message", content_category: "text" });
      return;
    }
    // Email
    if (href.indexOf("mailto:") === 0) {
      track("Contact", { content_name: "Email", content_category: "email" });
      return;
    }
    // Rates and directions are strong intent signals short of booking
    if (cta === "hero_view_rates" || href === "/rates/") {
      track("ViewContent", { content_name: "Rates page", content_category: "pricing" });
      return;
    }
    if (href.indexOf("google.com/maps") !== -1 || cta === "visit_directions") {
      track("FindLocation", { content_name: "Directions" });
    }
  }, true);
})();


/* ---------- measure the sticky bar so fixed elements sit flush ----------
   The bar's height comes from its padding, not a fixed value, so we
   measure it and expose it as --bar-h. This removes the gap that
   appeared when a hard-coded offset did not match the real height. */
(function () {
  function setBarHeight() {
    var bar = document.querySelector(".mobile-bar");
    var h = bar && getComputedStyle(bar).display !== "none" ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty("--bar-h", h + "px");
    document.body.style.paddingBottom = h ? h + 8 + "px" : "";
  }
  setBarHeight();
  window.addEventListener("resize", setBarHeight);
  window.addEventListener("orientationchange", setBarHeight);
  window.addEventListener("load", setBarHeight);
})();

/* ---------- mobile scroll cue ----------
   Fixed to the viewport (the hero clips overflow, which previously hid
   it). Tapping the paw scrolls on; tapping the x dismisses it for the
   rest of the visit. */
(function () {
  if (!document.querySelector(".hero")) return;
  var DISMISS_KEY = "cueDismissed";
  try { if (window.sessionStorage.getItem(DISMISS_KEY) === "1") return; } catch (e) {}

  var cue = document.createElement("div");
  cue.className = "scroll-cue";
  cue.innerHTML =
    '<button type="button" class="scroll-cue-dismiss" aria-label="Hide this hint">&times;</button>' +
    '<span class="scroll-cue-paw"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<circle cx="11" cy="4.5" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="5" cy="7" r="2"/>' +
    '<circle cx="8" cy="11" r="1.8"/><circle cx="14" cy="11" r="1.8"/>' +
    '<path d="M11 13.5c-3 0-5.4 2.1-5.4 4.5 0 1.6 1.3 2.5 2.8 2.2 1-.2 1.7-.6 2.6-.6s1.6.4 2.6.6c1.5.3 2.8-.6 2.8-2.2 0-2.4-2.4-4.5-5.4-4.5z"/>' +
    '</svg></span><span>Scroll down</span>';
  document.body.appendChild(cue);

  function remove() {
    cue.classList.add("hidden");
    setTimeout(function () { if (cue.parentNode) cue.parentNode.removeChild(cue); }, 400);
  }

  cue.querySelector(".scroll-cue-dismiss").addEventListener("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
    try { window.sessionStorage.setItem(DISMISS_KEY, "1"); } catch (err) {}
    remove();
  });

  cue.addEventListener("click", function () {
    var hero = document.querySelector(".hero");
    var next = hero && hero.nextElementSibling;
    while (next && next.offsetHeight === 0) next = next.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  });

  function hideOnScroll() {
    if (window.scrollY > 60) {
      remove();
      window.removeEventListener("scroll", hideOnScroll);
    }
  }
  window.addEventListener("scroll", hideOnScroll, { passive: true });
})();

/* ---------- landing page: copy number ---------- */
(function () {
  var btn = document.getElementById("lpCopyNum");
  if (!btn) return;
  var label = btn.querySelector(".lp-copy-label");
  btn.addEventListener("click", function () {
    var num = btn.getAttribute("data-number");
    function done() {
      btn.classList.add("copied");
      label.textContent = "Copied!";
      setTimeout(function () {
        btn.classList.remove("copied");
        label.textContent = "Copy number";
      }, 2200);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = num; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(num).then(done).catch(fallback);
    } else { fallback(); }
  });
})();


/* ---------- community pages: discount figure counts up ----------
   The real number lives in the HTML so it is correct with JS off or if
   the observer never fires. We only blank it at the moment we know the
   count-up is going to run. */
(function () {
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pcts = document.querySelectorAll("[data-pct]");
  if (!pcts.length) return;

  if (reduced || !("IntersectionObserver" in window)) return;  // leave the HTML value alone

  pcts.forEach(function (el) {
    var to = parseInt(el.getAttribute("data-pct"), 10);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var t0 = null, dur = 900;
        el.textContent = "0";
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = to;
        })(performance.now());
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });

  /* rate cards stagger in */
  var cards = document.querySelectorAll(".community-rate-card");
  if (cards.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        ro.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    cards.forEach(function (c, i) {
      c.style.transitionDelay = (Math.min(i, 4) * 70) + "ms";
      ro.observe(c);
    });
  }
})();
