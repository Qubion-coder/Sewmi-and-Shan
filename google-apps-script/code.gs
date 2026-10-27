/**
 * Sewmi & Shan – Wedding RSVP + Wishes backend (Google Apps Script)
 *
 * Paste this whole file into Extensions > Apps Script of the spreadsheet,
 * run `setup` once (to authorize and create the tabs), then Deploy as a Web app.
 * Sheets and headers are created automatically if they are missing.
 */

const SPREADSHEET_ID = '1PXOB-E5YvSNcHAQYP50KvVqof-FPz0qjGRxw01mcum4';
const TIME_ZONE = 'Asia/Colombo';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Name', 'Attendance', 'Guests', 'Dietary Notes', 'Invited As'],
    widths: [170, 220, 130, 80, 300, 200],
  },
  WISHES: {
    name: 'Wishes',
    // Untick "Show On Website" to hide a wish from the site.
    headers: ['Timestamp', 'Name', 'Message', 'Invited As', 'Show On Website'],
    widths: [170, 200, 420, 200, 130],
  },
};

const MAX_LEN = { name: 100, message: 1000, notes: 500 };

/* ---------------------------------- Entry points ---------------------------------- */

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = parsePayload_(e);
    const action = String(p.action || p.sheet || '').toLowerCase();

    if (action === 'rsvp') {
      const name = clean_(p.name, MAX_LEN.name);
      if (!name) return json_({ ok: false, error: 'Name is required.' });

      const sheet = getSheet_(SHEETS.RSVP);
      sheet.appendRow([
        new Date(),
        name,
        clean_(p.attendance, 30) || 'Attending',
        Number(p.guests) || 1,
        clean_(p.dietaryNotes, MAX_LEN.notes),
        clean_(p.invitedAs, MAX_LEN.name),
      ]);
      return json_({ ok: true });
    }

    if (action === 'wish' || action === 'wishes') {
      const name = clean_(p.name, MAX_LEN.name);
      const message = clean_(p.message, MAX_LEN.message);
      if (!name || !message) return json_({ ok: false, error: 'Name and message are required.' });

      const sheet = getSheet_(SHEETS.WISHES);
      sheet.appendRow([new Date(), name, message, clean_(p.invitedAs, MAX_LEN.name), true]);
      sheet.getRange(sheet.getLastRow(), 5).insertCheckboxes().check();
      return json_({ ok: true });
    }

    return json_({ ok: false, error: 'Unknown action. Use "rsvp" or "wish".' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || '').toLowerCase();
    if (action === 'wishes') {
      return json_({ ok: true, data: readWishes_() });
    }
    return json_({ ok: true, message: 'Sewmi & Shan wedding endpoint is running.' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** Run once from the editor to authorize the script and create both tabs. */
function setup() {
  getSheet_(SHEETS.RSVP);
  getSheet_(SHEETS.WISHES);
  SpreadsheetApp.openById(SPREADSHEET_ID).setSpreadsheetTimeZone(TIME_ZONE);
}

/* ------------------------------------ Helpers ------------------------------------ */

function readWishes_() {
  const sheet = getSheet_(SHEETS.WISHES);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, SHEETS.WISHES.headers.length).getValues();
  return rows
    .filter(function (r) { return r[1] && r[2] && r[4] !== false; })
    .map(function (r) {
      return {
        name: String(r[1]),
        message: String(r[2]),
        createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      };
    })
    .reverse(); // newest first
}

/** Returns the sheet, creating it and/or its header row when missing. */
function getSheet_(def) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(def.name);
  if (!sheet) sheet = ss.insertSheet(def.name);

  const width = def.headers.length;
  const current = sheet.getRange(1, 1, 1, width).getValues()[0];
  const hasHeaders = def.headers.every(function (h, i) { return current[i] === h; });

  if (!hasHeaders) {
    if (sheet.getLastRow() > 0 && current.some(function (c) { return c !== ''; })) {
      sheet.insertRowBefore(1); // keep any existing data below the new header
    }
    sheet.getRange(1, 1, 1, width)
      .setValues([def.headers])
      .setFontWeight('bold')
      .setFontColor('#fcf8ee')
      .setBackground('#061e14')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 34);
    sheet.setFrozenRows(1);
    def.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, width).setWrap(true).setVerticalAlignment('top');
  }
  return sheet;
}

function parsePayload_(e) {
  const params = (e && e.parameter) || {};
  if (Object.keys(params).length > 0) return params;

  const body = (e && e.postData && e.postData.contents) || '';
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch (_err) {
    return {};
  }
}

/** Trims, limits length and neutralises spreadsheet formula injection. */
function clean_(value, maxLen) {
  let s = String(value == null ? '' : value).trim().slice(0, maxLen);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
