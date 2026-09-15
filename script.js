const MONTHS = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const MONTHS_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

const cfg = window.INVITE_CONFIG || {};
const EVENT_AT = new Date(cfg.startsAt || "2026-09-26T18:00:00+09:00");
const EVENT_END = new Date(cfg.endsAt || "2026-09-26T23:00:00+09:00");

const openBtn = document.getElementById("open-invite");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const autumnScene = document.getElementById("autumn-scene");
const autumnLeaves = document.getElementById("autumn-leaves");
const nameInput = document.getElementById("guest-name");
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
const musicHint = document.querySelector("[data-music-hint]");
const hint = document.getElementById("rsvp-hint");
const maxGroupLink = document.getElementById("max-group-link");
const LEAF_SVG =
  '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M32 3c1.4 7.4 6.2 12.2 8.8 14.6 5.8-8.6 14.6-11 16.8-11.4-3.6 8.2-2.4 14.2 1.2 20.2 8.4-2.8 15.4-1 17.6.2-8.2 6-9.4 13.2-6.4 19.4-6.6-1.2-11.8 1.2-15.6 6.4 2.8 3.6 4.6 9.4 3.4 13.2-6.4-4-11.2-3.4-13.8-1.8V62h-4V63.4c-2.6-1.6-7.4-2.2-13.8 1.8-1.2-3.8.6-9.6 3.4-13.2-3.8-5.2-9-7.6-15.6-6.4 3-6.2 1.8-13.4-6.4-19.4 2.2-1.2 9.2-3 17.6-.2 3.6-6 4.8-12 1.2-20.2 2.2.4 11 2.8 16.8 11.4C25.8 15.2 30.6 10.4 32 3z"/></svg>';
const LEAF_COLORS = ["#f59e0b", "#ea580c", "#c2410c", "#fb923c", "#b45309", "#dc2626", "#fbbf24", "#fdba74"];
let openingInvite = false;

function fill(name, value) {
  document.querySelectorAll(`[data-fill="${name}"]`).forEach((el) => {
    el.textContent = value;
  });
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function yakutskParts(date) {
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yakutsk",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  const weekdayEn = get("weekday").toLowerCase();
  const weekdayIndex = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ].indexOf(weekdayEn);
  return {
    year: Number(get("year")),
    month: Number(get("month")) - 1,
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: weekdayIndex >= 0 ? WEEKDAYS[weekdayIndex] : "",
  };
}

function formatLongDate(date) {
  const parts = yakutskParts(date);
  if (!parts) return "";
  const labeled = parts.weekday.charAt(0).toUpperCase() + parts.weekday.slice(1);
  return `${labeled}, ${parts.day} ${MONTHS_GEN[parts.month]} ${parts.year} г.`;
}

function formatShortDate(date) {
  const parts = yakutskParts(date);
  if (!parts) return "";
  return `${parts.day} ${MONTHS_GEN[parts.month]} ${parts.year} г.`;
}

function formatTime(date) {
  const parts = yakutskParts(date);
  if (!parts) return "";
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

function plural(n, one, few, many) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}

function applyCopy() {
  const name = cfg.honoree || "Людмила";
  const city = cfg.city || "Якутск";
  const eventLabel = cfg.eventLabel || "юбилей";
  const age = String(cfg.age || "").trim();

  fill("honoree", name);
  document.title = `${eventLabel.charAt(0).toUpperCase() + eventLabel.slice(1)} ${name}`;

  const ageLine = age ? `${age} лет` : "";
  document.querySelectorAll("[data-fill='age-line']").forEach((el) => {
    if (ageLine) {
      el.hidden = false;
      el.textContent = ageLine;
    } else {
      el.hidden = true;
    }
  });

  fill("event-line", eventLabel.charAt(0).toUpperCase() + eventLabel.slice(1));
  fill(
    "hero-kicker",
    EVENT_AT.getTime() ? `${formatShortDate(EVENT_AT)} · ${formatTime(EVENT_AT)} · ${city}` : city
  );
  fill(
    "event-when",
    EVENT_AT.getTime() ? `${formatLongDate(EVENT_AT)} · ${formatTime(EVENT_AT)}` : ""
  );
  fill(
    "close-meta",
    EVENT_AT.getTime() ? `${formatLongDate(EVENT_AT)} · ${city}` : city
  );
  fill("venue-name", cfg.venue?.name || "Банкетный зал");

  const addressParts = [cfg.venue?.address, cfg.venue?.floor].filter(Boolean);
  document.querySelectorAll("[data-fill='venue-address']").forEach((el) => {
    el.innerHTML = addressParts.join("<br />") || city;
  });

  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute(
      "content",
      `Приглашение на ${eventLabel} ${name}. ${formatShortDate(EVENT_AT)}${city ? `, ${city}` : ""}.`
    );
  }
}

function renderCalendar(date) {
  const root = document.getElementById("calendar");
  const parts = yakutskParts(date);
  if (!root || !parts) return;

  const year = parts.year;
  const month = parts.month;
  const marked = parts.day;
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push("<span></span>");
  for (let day = 1; day <= daysInMonth; day += 1) {
    if (day === marked) {
      cells.push(`<span class="cal-mark"><span>${day}</span></span>`);
    } else {
      cells.push(`<span>${day}</span>`);
    }
  }

  root.setAttribute(
    "aria-label",
    `Календарь: ${MONTHS[month]} ${year}, праздник ${marked}-го`
  );
  root.innerHTML = `
    <p class="cal-month">${MONTHS[month]}</p>
    <p class="cal-year">${year}</p>
    <div class="cal-weekdays" aria-hidden="true">
      <span>пн</span><span>вт</span><span>ср</span><span>чт</span><span>пт</span><span>сб</span><span>вс</span>
    </div>
    <div class="cal-grid">${cells.join("")}</div>
  `;
}

function icsStamp(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yakutsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "00";
  return `${get("year")}${get("month")}${get("day")}T${get("hour")}${get("minute")}${get("second")}`;
}

function icsUtc(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function downloadIcs() {
  const name = cfg.honoree || "Людмила";
  const eventLabel = cfg.eventLabel || "юбилей";
  const venue = [cfg.venue?.name, cfg.venue?.address, cfg.city].filter(Boolean).join(", ");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lyudmila Anniversary//Invite//RU",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:lyudmila-anniversary-${EVENT_AT.getFullYear()}@invite`,
    `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART;TZID=Asia/Yakutsk:${icsStamp(EVENT_AT)}`,
    `DTEND;TZID=Asia/Yakutsk:${icsStamp(EVENT_END)}`,
    `SUMMARY:${eventLabel.charAt(0).toUpperCase() + eventLabel.slice(1)} ${name}`,
    `LOCATION:${venue}`,
    `DESCRIPTION:Сбор гостей с ${pad(EVENT_AT.getHours())}:${pad(EVENT_AT.getMinutes())}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "jubilee.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function bindMaps() {
  const venue = cfg.venue || {};
  const wrap = document.getElementById("map-wrap");
  const frame = document.getElementById("map-frame");
  const links = document.getElementById("map-links");
  const note = document.getElementById("venue-note");
  const hasExactPlace = Boolean(venue.yandex || venue.twogis || venue.yandexWidget);

  if (venue.yandexWidget && frame && wrap) {
    frame.src = venue.yandexWidget;
    wrap.hidden = false;
  }

  if (links) links.hidden = true;

  if (note) note.hidden = hasExactPlace;
}

function setPhoto(el, src, className) {
  if (!el || !src) return;
  let img = el.tagName === "IMG" ? el : el.querySelector("img");
  if (!img) {
    img = document.createElement("img");
    if (className) img.className = className;
    el.prepend(img);
  }
  img.src = src;
  el.classList.add("has-photo");
}

function bindPhotos() {
  const photos = cfg.photos || {};
  if (!letter) return;
  const hero = document.getElementById("hero");

  if (photos.envelope && envelope) {
    envelope.classList.add("has-photo");
    envelope.style.setProperty("--envelope-photo", `url("${photos.envelope}")`);
  }

  if (photos.hero && hero) {
    setPhoto(hero, photos.hero);
    const img = hero.querySelector("img");
    if (img) img.alt = cfg.honoree || "Людмила";
  }

  const introPhoto = letter.querySelector(".is-intro-photo");
  if (photos.intro) setPhoto(introPhoto, photos.intro);

  const rsvpPhoto = letter.querySelector(".is-rsvp-photo");
  if (photos.rsvp) setPhoto(rsvpPhoto, photos.rsvp);

  const close = letter.querySelector(".close");
  if (photos.close && close) {
    setPhoto(close, photos.close, "close-photo");
  }
}

function showHint(message, isError) {
  if (!hint) return;
  hint.hidden = false;
  hint.textContent = message;
  hint.style.color = isError ? "#9a6a64" : "";
}

function guestNames() {
  const full = nameInput ? nameInput.value.trim() : "";
  const parts = full.split(/\s+/).filter(Boolean);
  return {
    full,
    first: parts[0] || "",
    last: parts.slice(1).join(" "),
  };
}

function messengerHref(kind, last, first) {
  const name = cfg.honoree || "Людмила";
  const eventLabel = cfg.eventLabel || "юбилей";
  const answer = kind === "yes" ? "приду" : "не смогу прийти";
  const text = `Здравствуйте! ${last} ${first}: ${answer} на ${eventLabel} ${name}.`;
  const messenger = String(cfg.messenger || "").toLowerCase();

  if (messenger === "whatsapp") {
    const phone = String(cfg.phone || "").replace(/\D/g, "");
    if (!phone) return "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  if (messenger === "max") {
    return String(cfg.maxLink || "").trim();
  }

  return "";
}

function sendRsvp(kind) {
  const { last, first, full } = guestNames();
  if (!full || !first || !last) {
    showHint("Напишите имя и фамилию.", true);
    if (nameInput) nameInput.focus();
    return;
  }

  const payload = {
    name: full,
    last,
    first,
    answer: kind,
    at: new Date().toISOString(),
  };

  const sheetsUrl = String(cfg.sheetsUrl || "").trim();
  if (sheetsUrl) {
    fetch(sheetsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  const href = messengerHref(kind, last, first);
  if (href) {
    window.open(href, "_blank", "noopener");
    showHint("Откроется сообщение — останется только отправить.");
    return;
  }

  showHint(
    kind === "yes"
      ? "Спасибо, мы записали вас в список гостей."
      : "Спасибо, мы записали ваш ответ."
  );
}

function bindMaxGroup() {
  if (!maxGroupLink) return;
  const href = String(cfg.maxGroupLink || "").trim();
  maxGroupLink.hidden = false;
  if (href.startsWith("http")) {
    maxGroupLink.href = href;
    maxGroupLink.setAttribute("target", "_blank");
    return;
  }
  maxGroupLink.href = "#";
  maxGroupLink.removeAttribute("target");
  maxGroupLink.addEventListener("click", (event) => event.preventDefault());
}

function bindMusic() {
  if (!music) return;
  const src = String(cfg.audio || "").trim();
  if (!src) return;

  music.src = src;
  music.load();
  let ready = false;

  music.addEventListener("canplaythrough", () => {
    ready = true;
    if (musicHint) musicHint.hidden = false;
  });
  music.addEventListener("error", () => {
    ready = false;
    if (musicBtn) musicBtn.hidden = true;
    if (musicHint) musicHint.hidden = true;
  });

  music.hasInviteTrack = () => ready || Boolean(music.src);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function spawnLeaves(root) {
  if (!root) return;
  root.innerHTML = "";
  const count = prefersReducedMotion() ? 10 : 36;
  for (let i = 0; i < count; i += 1) {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leaf.style.left = `${Math.random() * 110 - 5}%`;
    leaf.style.setProperty("--delay", `${(i % 14) * 0.11 + Math.random() * 0.18}s`);
    leaf.style.setProperty("--dur", `${2.5 + Math.random() * 1.7}s`);
    leaf.style.setProperty("--x", `${Math.random() * 140 - 70}px`);
    leaf.style.setProperty("--spin", `${160 + Math.random() * 520}deg`);
    leaf.style.setProperty("--size", `${16 + Math.random() * 24}px`);
    leaf.style.color = LEAF_COLORS[i % LEAF_COLORS.length];
    leaf.innerHTML = LEAF_SVG;
    root.appendChild(leaf);
  }
}

function unlockMusic() {
  if (!music) return;
  const src = String(cfg.audio || "").trim();
  if (!src) return;
  music.muted = true;
  const play = music.play();
  const reset = () => {
    music.pause();
    music.currentTime = 0;
    music.muted = false;
  };
  if (play && typeof play.then === "function") {
    play.then(reset).catch(() => {
      music.muted = false;
    });
  } else {
    reset();
  }
}

function startInviteMusic() {
  if (!music) return;
  const src = String(cfg.audio || "").trim();
  if (!src) return;
  music.muted = false;
  music.volume = 0.45;
  const play = music.play();
  const showBtn = (playing) => {
    if (!musicBtn) return;
    musicBtn.hidden = false;
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    musicBtn.setAttribute("aria-label", playing ? "Выключить музыку" : "Включить музыку");
    musicBtn.classList.toggle("is-off", !playing);
  };
  if (play && typeof play.then === "function") {
    play.then(() => showBtn(true)).catch(() => showBtn(false));
  } else {
    showBtn(!music.paused);
  }
}

function revealLetterWithMusic() {
  if (!letter) return;
  letter.hidden = false;
  window.scrollTo(0, 0);
  startInviteMusic();
  window.setTimeout(startReveals, 40);
  if (autumnScene) {
    window.requestAnimationFrame(() => {
      autumnScene.classList.add("is-done");
    });
    window.setTimeout(() => {
      autumnScene.hidden = true;
      autumnScene.setAttribute("aria-hidden", "true");
      if (autumnLeaves) autumnLeaves.innerHTML = "";
    }, 1000);
  }
}

function openLetter() {
  if (openingInvite || !envelope || !letter) return;
  openingInvite = true;
  unlockMusic();
  envelope.hidden = true;
  envelope.setAttribute("aria-hidden", "true");
  if (autumnScene) {
    autumnScene.hidden = false;
    autumnScene.classList.remove("is-done");
    autumnScene.setAttribute("aria-hidden", "false");
    spawnLeaves(autumnLeaves);
  }
  const leafMs = prefersReducedMotion() ? 400 : 2800;
  window.setTimeout(revealLetterWithMusic, autumnScene ? leafMs : 0);
}

if (openBtn && envelope && letter) {
  openBtn.addEventListener("click", openLetter);
  const params = new URLSearchParams(window.location.search);
  if (params.get("open")) {
    openLetter();
  }
} else if (letter) {
  letter.hidden = false;
  startReveals();
}

function inView(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  return rect.top < vh * 0.72 && rect.bottom > 80;
}

function playSoft(el, delay) {
  if (!el || el.classList.contains("is-in")) return;
  el.style.animationDelay = `${delay}s`;
  el.classList.add("is-in");
}

function playGroup(root) {
  if (!root || root.dataset.played === "1") return;
  root.dataset.played = "1";

  if (
    root.classList.contains("hero") ||
    root.classList.contains("plate-photo") ||
    root.classList.contains("close")
  ) {
    root.classList.add("is-in");
  }

  const items = root.classList.contains("soft")
    ? [root]
    : [...root.children].filter((el) => el.classList.contains("soft"));

  items.forEach((el, i) => playSoft(el, 0.12 + i * 0.42));

  if (root.classList.contains("close")) {
    [...root.querySelectorAll(".soft")].forEach((el, i) => playSoft(el, 0.45 + i * 0.4));
  }
  if (root.classList.contains("hero-copy")) {
    document.querySelector(".hero")?.classList.add("is-in");
  }
}

function startReveals() {
  if (startReveals.done) return;
  startReveals.done = true;
  const letterEl = document.getElementById("letter");
  if (!letterEl) return;

  letterEl
    .querySelectorAll(
      ".hero-copy > *, .script-head, .photo-copy > *, .cal, .event-when, .countdown, .place, .addr, .map-bleed, .map-links, .rsvp > p, .guest-grid, .rsvp-row, .max-group p, .close-copy > *, .note"
    )
    .forEach((el) => el.classList.add("soft"));

  const groups = [
    ...letterEl.querySelectorAll(
      ".hero, .hero-copy, .when, .where, .rsvp, .max-group, .plate-photo, .photo-copy, .close"
    ),
  ];

  const tickView = () => {
    groups.forEach((group) => {
      if (group.dataset.played === "1") return;
      if (inView(group)) playGroup(group);
    });
  };

  window.setTimeout(() => {
    playGroup(letterEl.querySelector(".hero"));
    playGroup(letterEl.querySelector(".hero-copy"));
    tickView();
  }, 60);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          playGroup(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -18% 0px" }
    );
    groups.forEach((group) => observer.observe(group));
  }

  window.addEventListener("scroll", tickView, { passive: true, capture: true });
  window.addEventListener("resize", tickView);
}

function prepareEnvelope() {
  if (!envelope) return;
  [...envelope.children].forEach((el) => el.classList.add("soft"));
  window.setTimeout(() => {
    [...envelope.children].forEach((el, i) => playSoft(el, i * 0.38));
  }, 200);
}

function tick() {
  const root = document.getElementById("countdown");
  if (!root) return;
  const diff = EVENT_AT.getTime() - Date.now();
  if (Number.isNaN(EVENT_AT.getTime())) {
    root.innerHTML = "";
    return;
  }
  if (diff <= 0) {
    root.innerHTML = "<p>Этот день уже наступил.</p>";
    return;
  }
  const day = Math.floor(diff / 86400000);
  const hour = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  root.innerHTML = [
    [day, plural(day, "день", "дня", "дней")],
    [hour, plural(hour, "час", "часа", "часов")],
    [min, plural(min, "минута", "минуты", "минут")],
    [sec, plural(sec, "секунда", "секунды", "секунд")],
  ]
    .map(([n, label]) => `<div><strong>${pad(n)}</strong><span>${label}</span></div>`)
    .join("");
}

applyCopy();
renderCalendar(EVENT_AT);
bindMaps();
bindPhotos();
bindMaxGroup();
bindMusic();
prepareEnvelope();
tick();
setInterval(tick, 1000);

document.getElementById("add-calendar")?.addEventListener("click", downloadIcs);

document.querySelectorAll("[data-rsvp]").forEach((button) => {
  button.addEventListener("click", () => {
    sendRsvp(button.dataset.rsvp);
  });
});

if (musicBtn && music) {
  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicBtn.setAttribute("aria-pressed", "true");
      musicBtn.setAttribute("aria-label", "Выключить музыку");
      musicBtn.classList.remove("is-off");
    } else {
      music.pause();
      musicBtn.setAttribute("aria-pressed", "false");
      musicBtn.setAttribute("aria-label", "Включить музыку");
      musicBtn.classList.add("is-off");
    }
  });
}
