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
const EVENT_AT = new Date(cfg.startsAt || "2026-12-05T17:00:00+09:00");
const EVENT_END = new Date(cfg.endsAt || "2026-12-05T23:00:00+09:00");

const openBtn = document.getElementById("open-invite");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const lastInput = document.getElementById("guest-last");
const firstInput = document.getElementById("guest-first");
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
const musicHint = document.querySelector("[data-music-hint]");
const hint = document.getElementById("rsvp-hint");
const maxGroupLink = document.getElementById("max-group-link");

function fill(name, value) {
  document.querySelectorAll(`[data-fill="${name}"]`).forEach((el) => {
    el.textContent = value;
  });
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatLongDate(date) {
  if (Number.isNaN(date.getTime())) return "";
  const weekday = WEEKDAYS[date.getDay()];
  const labeled = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${labeled}, ${date.getDate()} ${MONTHS_GEN[date.getMonth()]} ${date.getFullYear()}`;
}

function formatShortDate(date) {
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} ${MONTHS_GEN[date.getMonth()]} ${date.getFullYear()}`;
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
  fill("hero-kicker", EVENT_AT.getTime() ? `${formatShortDate(EVENT_AT)} · ${city}` : city);
  fill("program-date", formatLongDate(EVENT_AT));
  fill("close-meta", EVENT_AT.getTime() ? `${formatShortDate(EVENT_AT)} · ${city}` : city);
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
  if (!root || Number.isNaN(date.getTime())) return;

  const year = date.getFullYear();
  const month = date.getMonth();
  const marked = date.getDate();
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

  if (links && (venue.yandex || venue.twogis)) {
    const parts = [];
    if (venue.yandex) {
      parts.push(
        `<a class="text-link" href="${venue.yandex}" target="_blank" rel="noreferrer">Посмотреть на карте</a>`
      );
    }
    if (venue.yandex && venue.twogis) {
      parts.push('<span aria-hidden="true"> · </span>');
    }
    if (venue.twogis) {
      parts.push(
        `<a class="text-link" href="${venue.twogis}" target="_blank" rel="noreferrer">Маршрут в 2ГИС</a>`
      );
    }
    links.innerHTML = parts.join("");
    links.hidden = false;
  }

  if (note) note.hidden = hasExactPlace;
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
    const img = document.createElement("img");
    img.src = photos.hero;
    img.alt = cfg.honoree || "Людмила";
    hero.prepend(img);
    hero.classList.add("has-photo");
  }

  const plates = Array.isArray(photos.plates) ? photos.plates.filter(Boolean) : [];
  const anchors = letter.querySelectorAll(".divider");
  plates.forEach((src, index) => {
    const section = document.createElement("section");
    section.className = "plate plate-photo";
    section.innerHTML = `<img src="${src}" alt="" />`;
    const anchor = anchors[index] || letter.querySelector(".rsvp");
    if (anchor) anchor.before(section);
  });

  const close = letter.querySelector(".close");
  if (photos.close && close) {
    const img = document.createElement("img");
    img.className = "close-photo";
    img.src = photos.close;
    img.alt = "";
    close.prepend(img);
    close.classList.add("has-photo");
  }
}

function showHint(message, isError) {
  if (!hint) return;
  hint.hidden = false;
  hint.textContent = message;
  hint.style.color = isError ? "#9a6a64" : "";
}

function guestNames() {
  return {
    last: lastInput ? lastInput.value.trim() : "",
    first: firstInput ? firstInput.value.trim() : "",
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
  const { last, first } = guestNames();
  if (!last || !first) {
    showHint("Заполните фамилию и имя.", true);
    if (!last && lastInput) lastInput.focus();
    else if (firstInput) firstInput.focus();
    return;
  }

  const payload = {
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
  if (!href.startsWith("http")) {
    maxGroupLink.hidden = true;
    return;
  }
  maxGroupLink.href = href;
  maxGroupLink.hidden = false;
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

  music.hasInviteTrack = () => ready;
}

if (openBtn && envelope && letter) {
  openBtn.addEventListener("click", () => {
    envelope.hidden = true;
    letter.hidden = false;
    envelope.setAttribute("aria-hidden", "true");
    window.scrollTo(0, 0);
    if (music && music.hasInviteTrack && music.hasInviteTrack()) {
      music.volume = 0.45;
      music.play().catch(() => {});
      if (musicBtn) musicBtn.hidden = false;
    }
    window.setTimeout(startReveals, 80);
  });
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
      ".hero-copy > *, .flourish, .script-head, .lead, .cal, .countdown, .text-link, .calendar-btn, .program-date, .program-list li, .place, .addr, .map-bleed, .map-links, .dress p, .gifts p, .words p, .rsvp > p, .guest-grid, .rsvp-row, .swatches, .max-group p, .close-copy > *, .divider, .note"
    )
    .forEach((el) => el.classList.add("soft"));

  const groups = [
    ...letterEl.querySelectorAll(
      ".hero, .hero-copy, .intro, .when, .program-block > .script-head, .program-block > .program-date, .program-list li, .where, .dress, .gifts, .words, .rsvp, .max-group, .plate-photo, .close, .divider"
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
    [day, "дней"],
    [hour, "часов"],
    [min, "минут"],
    [sec, "секунд"],
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
