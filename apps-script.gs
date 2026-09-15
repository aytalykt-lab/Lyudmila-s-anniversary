function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Гости");
    if (!sheet) {
      sheet = ss.insertSheet("Гости");
      sheet.appendRow(["Дата и время", "Фамилия", "Имя", "Ответ"]);
    }
    sheet.appendRow([
      new Date(),
      data.last || "",
      data.first || "",
      data.answer === "yes" ? "приду" : "не приду",
    ]);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(
      ContentService.MimeType.TEXT
    );
  }
}
