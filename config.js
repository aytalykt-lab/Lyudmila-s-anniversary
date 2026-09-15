window.INVITE_CONFIG = {
  honoree: "Людмила",
  eventLabel: "юбилей",
  age: "60",
  city: "Якутск",

  startsAt: "2026-09-26T18:00:00+09:00",
  endsAt: "2026-09-26T23:00:00+09:00",

  venue: {
    name: "Ресторан «Новый Пекин»",
    address: "Якутск",
    floor: "ул. Герцена, 3",
    yandex: "https://yandex.ru/maps/org/novy_pekin/1865642115/",
    yandexWidget: "https://yandex.ru/map-widget/v1/?ol=biz&oid=1865642115&z=16&scroll=false",
    twogis: "https://2gis.ru/yakutsk/firm/70000001017396050",
  },

  // Google Apps Script URL (оканчивается на /exec). Ответы гостей пишутся в таблицу.
  sheetsUrl: "",

  // Мессенджер для ответа: "whatsapp" | "max" | ""
  messenger: "whatsapp",
  // WhatsApp: только цифры, как 7914…
  phone: "",
  // Max: ссылка на чат из приложения (по номеру Max сам чат не открывает).
  maxLink: "",
  // Группа MAX, куда гости могут скидывать фото вечера.
  maxGroupLink: "",

  photos: {
    envelope: "",
    hero: "photos/01-envelope.jpg",
    intro: "photos/02-hero.jpg",
    rsvp: "photos/03.jpg",
    close: "photos/04.jpg",
  },

  audio: "audio/music.mp3",
};
