// Roll or Dice — Google Sheets API Layer
// Handles all read/write operations to Google Sheets

let tokenClient;
let gapiInited = false;
let gisInited  = false;

// ── Sheet column schemas ────────────────────────────────────────────────────

const SCHEMA = {
  Products: [
    'id','name','category','sku','description',
    'wood','acrylic','felt','adhesive','hardware','finishing','packaging_mat','other_mat',
    'waste_pct',
    'labor_hours','labor_rate',
    'laser_minutes',
    'price_etsy','price_direct','price_wholesale',
    'notes','created_at'
  ],
  Materials: [
    'id','name','category','unit','cost_per_unit','supplier','reorder_threshold','notes'
  ],
  Inventory: [
    'id','material_id','material_name','qty_on_hand','last_updated','notes'
  ],
  Sales: [
    'id','date','product_id','product_name','channel','qty','unit_price','total_revenue',
    'discount','shipping_charged','notes'
  ],
  Equipment: [
    'id','name','purchase_price','purchase_date','expected_life_years',
    'wattage','cost_per_kwh','hours_per_month','notes'
  ],
};

// ── GAPI init ───────────────────────────────────────────────────────────────

function gapiLoaded() {
  gapi.load('client', async () => {
    await gapi.client.init({
      discoveryDocs: [CONFIG.DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableApp();
  });
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.CLIENT_ID,
    scope: CONFIG.SCOPES,
    callback: async (resp) => {
      if (resp.error) { console.error(resp); return; }
      await ensureSheets();
      await loadAllData();
      showApp();
    },
  });
  gisInited = true;
  maybeEnableApp();
}

function maybeEnableApp() {
  if (gapiInited && gisInited) {
    document.getElementById('signin-btn').disabled = false;
  }
}

function handleSignIn() {
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

function handleSignOut() {
  const token = gapi.client.getToken();
  if (token) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
  }
  DB = { products:[], materials:[], inventory:[], sales:[], equipment:[] };
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  const profile = gapi.client.getToken();
  renderDashboard();
}

// ── Ensure all sheets exist ─────────────────────────────────────────────────

async function ensureSheets() {
  const res = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: CONFIG.SHEET_ID });
  const existing = res.result.sheets.map(s => s.properties.title);
  const requests = [];

  for (const [name, cols] of Object.entries(SCHEMA)) {
    if (!existing.includes(name)) {
      requests.push({ addSheet: { properties: { title: name } } });
    }
  }

  if (requests.length) {
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: CONFIG.SHEET_ID,
      resource: { requests },
    });
  }

  // Write headers for any new sheets
  for (const [name, cols] of Object.entries(SCHEMA)) {
    const range = `${name}!A1:${colLetter(cols.length)}1`;
    const res2 = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.SHEET_ID,
      range,
    });
    if (!res2.result.values || !res2.result.values.length) {
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: CONFIG.SHEET_ID,
        range,
        valueInputOption: 'RAW',
        resource: { values: [cols] },
      });
    }
  }
}

// ── In-memory DB ────────────────────────────────────────────────────────────

let DB = {
  products:  [],
  materials: [],
  inventory: [],
  sales:     [],
  equipment: [],
};

// ── Load all data ───────────────────────────────────────────────────────────

async function loadAllData() {
  showSync('Loading data...');
  try {
    DB.products  = await readSheet('Products');
    DB.materials = await readSheet('Materials');
    DB.inventory = await readSheet('Inventory');
    DB.sales     = await readSheet('Sales');
    DB.equipment = await readSheet('Equipment');
  } catch(e) {
    console.error('Load error', e);
  }
  hideSync();
}

async function readSheet(sheetName) {
  const cols = SCHEMA[sheetName];
  try {
    const res = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.SHEET_ID,
      range: `${sheetName}!A2:${colLetter(cols.length)}`,
    });
    const rows = res.result.values || [];
    return rows.filter(r => r[0]).map(row => {
      const obj = {};
      cols.forEach((col, i) => obj[col] = row[i] || '');
      return obj;
    });
  } catch(e) {
    return [];
  }
}

// ── Write helpers ───────────────────────────────────────────────────────────

async function appendRow(sheetName, obj) {
  const cols = SCHEMA[sheetName];
  const row = cols.map(c => obj[c] !== undefined ? obj[c] : '');
  await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: CONFIG.SHEET_ID,
    range: `${sheetName}!A:A`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: [row] },
  });
}

async function updateRow(sheetName, obj) {
  // Find row number by id (col A)
  const cols = SCHEMA[sheetName];
  const res = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.SHEET_ID,
    range: `${sheetName}!A:A`,
  });
  const rows = res.result.values || [];
  const rowNum = rows.findIndex(r => r[0] === obj.id);
  if (rowNum < 1) return;
  const sheetRow = rowNum + 1;
  const row = cols.map(c => obj[c] !== undefined ? obj[c] : '');
  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: CONFIG.SHEET_ID,
    range: `${sheetName}!A${sheetRow}:${colLetter(cols.length)}${sheetRow}`,
    valueInputOption: 'RAW',
    resource: { values: [row] },
  });
}

async function deleteRow(sheetName, id) {
  const res = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.SHEET_ID,
    range: `${sheetName}!A:A`,
  });
  const rows = res.result.values || [];
  const rowNum = rows.findIndex(r => r[0] === id);
  if (rowNum < 1) return;

  // Get sheet id
  const meta = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: CONFIG.SHEET_ID });
  const sheet = meta.result.sheets.find(s => s.properties.title === sheetName);
  if (!sheet) return;

  await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: CONFIG.SHEET_ID,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.properties.sheetId,
            dimension: 'ROWS',
            startIndex: rowNum,
            endIndex: rowNum + 1,
          }
        }
      }]
    }
  });
}

// ── Utilities ───────────────────────────────────────────────────────────────

function colLetter(n) {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function showSync(msg) {
  const bar = document.getElementById('sync-bar');
  document.getElementById('sync-msg').textContent = msg;
  bar.classList.remove('hidden');
}

function hideSync() {
  document.getElementById('sync-bar').classList.add('hidden');
}
