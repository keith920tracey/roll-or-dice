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
    const btn = document.getElementById('signin-btn');
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"/><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.48a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"/></svg> Sign in with Google`;
  }
}

function handleSignIn() {
  if (!gapiInited || !gisInited) {
    alert('Still initializing — please wait a moment and try again.');
    return;
  }
  // Use empty prompt so it doesn't force re-consent every time
  tokenClient.requestAccessToken({ prompt: '' });
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
  renderDashboard();
}

// ── Ensure all sheets exist ─────────────────────────────────────────────────

async function ensureSheets() {
  const res = await gapi.client.sheets.spreadsheets.get({ spreadsheetId: CONFIG.SHEET_ID });
  const existing = res.result.sheets.map(s => s.properties.title);
  const requests = [];

  for (const name of Object.keys(SCHEMA)) {
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
