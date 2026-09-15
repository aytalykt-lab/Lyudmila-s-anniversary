function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Гости");
    if (!sheet) {
      sheet = ss.insertSheet("Гости");
      sheet.appendRow(["Дата и время", "Имя и фамилия", "Имя", "Фамилия", "Ответ"]);
    }
    sheet.appendRow([
      new Date(),
      data.name || [data.first, data.last].filter(Boolean).join(" "),
      data.first || "",
      data.last || "",
      data.answer === "yes" ? "приду" : "не приду",
    ]);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(
      ContentService.MimeType.TEXT
    );
  }
}
