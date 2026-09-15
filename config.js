window.INVITE_CONFIG = {
  honoree: "Людмила",
  eventLabel: "юбилей",
  // Если возраст ещё не указываем на странице — оставьте пустую строку.
  age: "",
  city: "Якутск",

  // Черновая дата. Как будет точная — замените эти две строки.
  startsAt: "2026-12-05T17:00:00+09:00",
  endsAt: "2026-12-05T23:00:00+09:00",

  venue: {
    name: "Банкетный зал",
    address: "г. Якутск",
    floor: "",
    // Ссылки появятся на странице, когда вставите их сюда.
    yandex: "",
    yandexWidget: "",
    twogis: "",
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
    hero: "photos/02-hero.jpg",
    plates: ["photos/03.jpg", "photos/04.jpg"],
    close: "",
  },

  // Положите файл audio/music.mp3 и укажите путь, если нужна музыка при открытии.
  audio: "",
};
