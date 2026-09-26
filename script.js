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
  if (lightbox) {
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
