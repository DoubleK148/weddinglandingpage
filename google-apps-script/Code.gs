/**
 * Google Apps Script — thiệp cưới → Google Sheets
 *
 * THỨ TỰ CHẠY (từ Sheet → Extensions → Apps Script):
 * 1. linkThisSheet()   ← chạy đầu tiên, 1 lần duy nhất
 * 2. testWrite()       ← kiểm tra ghi dữ liệu
 * 3. Deploy Web app (Me + Anyone) → New version
 */

const FALLBACK_SPREADSHEET_ID = '1GxXQWVRBoClY4hvbHS4jL6rPPac4GiB5TdK-QuLFLHo'

const RSVP_SHEET = 'RSVP'
const WISHES_SHEET = 'Loi_chuc'

function getSpreadsheetId() {
  const saved = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
  if (saved) return saved

  try {
    const active = SpreadsheetApp.getActiveSpreadsheet()
    if (active) return active.getId()
  } catch (e) {
    // Web app context — không có active spreadsheet
  }

  return FALLBACK_SPREADSHEET_ID
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(getSpreadsheetId())
}

/** Bước 1 — Chạy hàm này TRƯỚC, từ Sheet đang mở (Extensions → Apps Script) */
function linkThisSheet() {
  const active = SpreadsheetApp.getActiveSpreadsheet()
  if (!active) {
    throw new Error(
      'Không tìm thấy Sheet. Hãy mở Google Sheet → Extensions → Apps Script, KHÔNG tạo project riêng trên script.google.com',
    )
  }

  const id = active.getId()
  const name = active.getName()
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', id)

  const first = active.getSheets()[0]
  first.getRange('A1').setValue('✅ Đã liên kết Apps Script — ' + new Date())
  first.getRange('A2').setValue('ID: ' + id)
  first.getRange('A3').setValue('Sheet: ' + name)
  first.getRange('A4').setValue('→ Tiếp theo chạy testWrite() trong Apps Script')

  Logger.log('linkThisSheet OK — ' + name + ' — ' + id)
}

function setupSheets() {
  const ss = getSpreadsheet()

  let rsvp = ss.getSheetByName(RSVP_SHEET)
  if (!rsvp) rsvp = ss.insertSheet(RSVP_SHEET)
  if (rsvp.getLastRow() === 0) {
    rsvp.appendRow(['Thời gian', 'Họ tên', 'SĐT', 'Số người', 'Tham dự', 'Lời nhắn'])
    rsvp.getRange(1, 1, 1, 6).setFontWeight('bold')
  }

  let wishes = ss.getSheetByName(WISHES_SHEET)
  if (!wishes) wishes = ss.insertSheet(WISHES_SHEET)
  if (wishes.getLastRow() === 0) {
    wishes.appendRow(['Thời gian', 'Tên', 'Lời chúc', 'Hiển thị'])
    wishes.getRange(1, 1, 1, 4).setFontWeight('bold')
  }
}

/** Bước 2 — Chạy sau linkThisSheet() */
function testWrite() {
  const ss = getSpreadsheet()
  setupSheets()

  ss.getSheetByName(RSVP_SHEET).appendRow([
    new Date(),
    'TEST OK',
    '',
    1,
    'Có',
    'Chạy testWrite() từ Apps Script',
  ])

  const first = ss.getSheets()[0]
  first.getRange('A5').setValue('✅ testWrite OK — ' + new Date())
  first.getRange('A6').setValue('→ Xem tab RSVP, dòng TEST OK')

  Logger.log('testWrite OK — ' + ss.getName() + ' — ' + ss.getId())
}

function writeSubmission(data) {
  setupSheets()
  const ss = getSpreadsheet()
  const now = new Date()

  if (data.type === 'rsvp') {
    ss.getSheetByName(RSVP_SHEET).appendRow([
      now,
      data.name || '',
      data.phone || '',
      Number(data.guest_count) || 1,
      data.attending === true || data.attending === 'true' ? 'Có' : 'Không',
      data.message || '',
    ])
    return { success: true, type: 'rsvp' }
  }

  if (data.type === 'wish') {
    ss.getSheetByName(WISHES_SHEET).appendRow([
      now,
      data.name || '',
      data.message || '',
      'Có',
    ])
    return { success: true, type: 'wish' }
  }

  throw new Error('Unknown type: ' + data.type)
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

function parseGetSubmission(params) {
  return {
    type: params.type,
    name: params.name || '',
    phone: params.phone || '',
    guest_count: Number(params.guest_count) || 1,
    attending: params.attending === 'true',
    message: params.message || '',
  }
}

function jsonResponse(data, callback) {
  const json = JSON.stringify(data)
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + json + ')').setMimeType(
      ContentService.MimeType.JAVASCRIPT,
    )
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    const data = e.parameter && e.parameter.type ? parseGetSubmission(e.parameter) : parsePayload(e)
    return jsonResponse(writeSubmission(data))
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) })
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
    if (visible === 'không' || visible === 'false' || visible === '0') continue
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
  const params = e.parameter
  const callback = params.callback
  const action = params.action

  try {
    if (action === 'wishes') {
      return jsonResponse(getWishesList(), callback)
    }

    if (action === 'submit' || params.type) {
      const data = parseGetSubmission(params)
      return jsonResponse(writeSubmission(data), callback)
    }

    return jsonResponse({
      ok: true,
      message: 'Wedding sheet API',
      spreadsheetId: getSpreadsheetId(),
    })
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) }, callback)
  }
}
