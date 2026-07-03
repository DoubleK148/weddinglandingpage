/**
 * Google Apps Script — gắn vào Google Sheet thiệp cưới
 *
 * QUAN TRỌNG: Web App KHÔNG dùng được getActiveSpreadsheet().
 * Phải khai báo SPREADSHEET_ID (lấy từ URL Sheet).
 *
 * Sau khi dán code:
 * 1. Chạy setupSheets() một lần
 * 2. Deploy → New deployment → Web app (Execute as: Me, Anyone)
 * 3. Copy URL /exec → VITE_GOOGLE_SHEETS_URL trên Vercel
 */

// ← ID Sheet của bạn (từ URL docs.google.com/spreadsheets/d/XXXX/edit)
const SPREADSHEET_ID = '1GxXQWVRBoClY4hvbHS4jL6rPPac4GiB5TdK-QuLFLHo'

const RSVP_SHEET = 'RSVP'
const WISHES_SHEET = 'Loi_chuc'

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID)
}

function setupSheets() {
  const ss = getSpreadsheet()

  let rsvp = ss.getSheetByName(RSVP_SHEET)
  if (!rsvp) {
    rsvp = ss.insertSheet(RSVP_SHEET)
  }
  if (rsvp.getLastRow() === 0) {
    rsvp.appendRow(['Thời gian', 'Họ tên', 'SĐT', 'Số người', 'Tham dự', 'Lời nhắn'])
    rsvp.getRange(1, 1, 1, 6).setFontWeight('bold')
  }

  let wishes = ss.getSheetByName(WISHES_SHEET)
  if (!wishes) {
    wishes = ss.insertSheet(WISHES_SHEET)
  }
  if (wishes.getLastRow() === 0) {
    wishes.appendRow(['Thời gian', 'Tên', 'Lời chúc', 'Hiển thị'])
    wishes.getRange(1, 1, 1, 4).setFontWeight('bold')
  }
}

/** Chạy thủ công để test — nếu Sheet có dòng "TEST OK" là đúng */
function testWrite() {
  setupSheets()
  getSpreadsheet().getSheetByName(RSVP_SHEET).appendRow([
    new Date(),
    'TEST OK',
    '',
    1,
    'Có',
    'Chạy testWrite() từ Apps Script',
  ])
}

function parsePayload(e) {
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload)
  }
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents)
  }
  throw new Error('Missing payload')
}

function doPost(e) {
  try {
    setupSheets()
    const data = parsePayload(e)
    const ss = getSpreadsheet()
    const now = new Date()

    if (data.type === 'rsvp') {
      ss.getSheetByName(RSVP_SHEET).appendRow([
        now,
        data.name || '',
        data.phone || '',
        data.guest_count || 1,
        data.attending ? 'Có' : 'Không',
        data.message || '',
      ])
    } else if (data.type === 'wish') {
      ss.getSheetByName(WISHES_SHEET).appendRow([
        now,
        data.name || '',
        data.message || '',
        'Có',
      ])
    } else {
      throw new Error('Unknown type: ' + data.type)
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function getWishesList() {
  setupSheets()
  const sheet = getSpreadsheet().getSheetByName(WISHES_SHEET)
  const rows = sheet.getDataRange().getValues()
  const wishes = []

  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i]
    const visible = String(row[3] || 'Có').toLowerCase()
    if (visible === 'không' || visible === 'false' || visible === '0') {
      continue
    }
    wishes.push({
      id: String(i),
      name: String(row[1] || ''),
      message: String(row[2] || ''),
      created_at: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
    })
    if (wishes.length >= 50) break
  }

  return wishes
}

function doGet(e) {
  const action = e.parameter.action
  const callback = e.parameter.callback

  if (action === 'wishes') {
    const json = JSON.stringify(getWishesList())
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + json + ')').setMimeType(
        ContentService.MimeType.JAVASCRIPT,
      )
    }
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON)
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: 'Wedding sheet API', spreadsheetId: SPREADSHEET_ID }),
  ).setMimeType(ContentService.MimeType.JSON)
}
