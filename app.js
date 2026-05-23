// Roll or Dice — Main Application Logic

// ── Page Navigation ─────────────────────────────────────────────────────────

async function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
  const renders = {
    dashboard: renderDashboard,
    products:  renderProductList,
    materials: renderMaterialList,
    inventory: renderInventoryList,
    sales:     renderSalesList,
    equipment: renderEquipmentList,
  };
  await loadAllData();
  if (renders[name]) renders[name]();
}

// ── Cost Calculation ────────────────────────────────────────────────────────

function calcProductCost(p) {
  const mat = [
    'wood','acrylic','felt','adhesive','hardware','finishing','packaging_mat','other_mat'
  ].reduce((sum, k) => sum + parseFloat(p[k] || 0), 0);

  const wasteMult = 1 + (parseFloat(p.waste_pct || 0) / 100);
  const matWithWaste = mat * wasteMult;

  const labor = parseFloat(p.labor_hours || 0) * parseFloat(p.labor_rate || 0);

  // Equipment cost: find laser cutter and calc per-minute rate
  const laser = DB.equipment.find(e => e.name.toLowerCase().includes('laser'));
  let equipCost = 0;
  if (laser && p.laser_minutes) {
    const hoursPerYear = parseFloat(laser.hours_per_month || 0) * 12;
    const depreciationPerHour = hoursPerYear > 0
      ? parseFloat(laser.purchase_price || 0) / (parseFloat(laser.expected_life_years || 1) * hoursPerYear)
      : 0;
    const kwh = (parseFloat(laser.wattage || 0) / 1000) * (parseFloat(p.laser_minutes || 0) / 60);
    const electricityCost = kwh * parseFloat(laser.cost_per_kwh || 0.12);
    equipCost = (depreciationPerHour * parseFloat(p.laser_minutes || 0) / 60) + electricityCost;
  }

  const subtotal = matWithWaste + labor + equipCost;

  const priceEtsy = parseFloat(p.price_etsy || 0);
  const priceDirect = parseFloat(p.price_direct || 0);
  const priceWholesale = parseFloat(p.price_wholesale || 0);

  const etsyFees = priceEtsy > 0
    ? (priceEtsy * CONFIG.FEES.ETSY_TRANSACTION) + (priceEtsy * CONFIG.FEES.ETSY_PAYMENT) + CONFIG.FEES.ETSY_LISTING
    : 0;

  return {
    matRaw: mat,
    matWithWaste,
    labor,
    equipCost,
    subtotal,
    etsyFees,
    totalCostEtsy: subtotal + etsyFees,
    totalCostDirect: subtotal,
    profitEtsy: priceEtsy - (subtotal + etsyFees),
    profitDirect: priceDirect - subtotal,
    profitWholesale: priceWholesale - subtotal,
    marginEtsy: priceEtsy > 0 ? ((priceEtsy - subtotal - etsyFees) / priceEtsy) * 100 : 0,
    marginDirect: priceDirect > 0 ? ((priceDirect - subtotal) / priceDirect) * 100 : 0,
    marginWholesale: priceWholesale > 0 ? ((priceWholesale - subtotal) / priceWholesale) * 100 : 0,
  };
}

function suggestedPrice(cost, targetMarginPct, etsyFeesPct = 0) {
  // price = cost / (1 - margin - fees)
  const divisor = 1 - (targetMarginPct / 100) - etsyFeesPct;
  return divisor > 0 ? cost / divisor : null;
}

function marginColor(pct) {
  if (pct >= 40) return 'good';
  if (pct >= 20) return 'warn';
  return 'bad';
}

function fmt(n) { return '$' + parseFloat(n || 0).toFixed(2); }
function fmtPct(n) { return parseFloat(n || 0).toFixed(1) + '%'; }

// ── Dashboard ───────────────────────────────────────────────────────────────

function renderDashboard() {
  const totalRevenue = DB.sales.reduce((s, sale) => s + parseFloat(sale.total_revenue || 0), 0);
  const totalUnits   = DB.sales.reduce((s, sale) => s + parseInt(sale.qty || 0), 0);
  const productCount = DB.products.length;
  const lowStock     = DB.inventory.filter(i => {
    const mat = DB.materials.find(m => m.id === i.material_id);
    const thresh = parseFloat(mat?.reorder_threshold || CONFIG.DEFAULT_LOW_STOCK);
    return parseFloat(i.qty_on_hand || 0) <= thresh;
  });

  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Revenue</div>
      <div class="stat-value">${fmt(totalRevenue)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Units Sold</div>
      <div class="stat-value">${totalUnits}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Products</div>
      <div class="stat-value">${productCount}</div>
    </div>
    <div class="stat-card ${lowStock.length ? 'stat-warn' : ''}">
      <div class="stat-label">Low Stock Alerts</div>
      <div class="stat-value">${lowStock.length}</div>
    </div>
  `;

  // Top products by profit (Etsy channel)
  const ranked = DB.products
    .map(p => ({ p, c: calcProductCost(p) }))
    .sort((a, b) => b.c.profitEtsy - a.c.profitEtsy)
    .slice(0, 5);

  document.getElementById('dash-top-products').innerHTML = ranked.length
    ? ranked.map(({ p, c }) => `
        <div class="dash-row-item">
          <div>
            <div class="item-name">${p.name}</div>
            <div class="item-sub">${p.category || ''}</div>
          </div>
          <div class="item-right">
            <span class="badge badge-${marginColor(c.marginEtsy)}">${fmtPct(c.marginEtsy)} margin</span>
            <span class="item-profit">${fmt(c.profitEtsy)}/unit</span>
          </div>
        </div>`).join('')
    : '<div class="empty-msg">No products yet.</div>';

  // Low stock
  document.getElementById('dash-low-stock').innerHTML = lowStock.length
    ? lowStock.map(i => {
        const mat = DB.materials.find(m => m.id === i.material_id);
        return `<div class="dash-row-item">
          <div>
            <div class="item-name">${i.material_name}</div>
            <div class="item-sub">${mat?.category || ''}</div>
          </div>
          <div class="item-right">
            <span class="badge badge-bad">${i.qty_on_hand} ${mat?.unit || ''} left</span>
          </div>
        </div>`;
      }).join('')
    : '<div class="empty-msg">All materials well stocked.</div>';

  // Recent sales
  const recent = [...DB.sales].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  document.getElementById('dash-recent-sales').innerHTML = recent.length
    ? `<table class="data-table">
        <thead><tr><th>Date</th><th>Product</th><th>Channel</th><th>Qty</th><th>Revenue</th></tr></thead>
        <tbody>${recent.map(s => `
          <tr>
            <td>${s.date}</td>
            <td>${s.product_name}</td>
            <td><span class="channel-badge channel-${s.channel.toLowerCase().replace(/\s|[-]/g,'')}">${s.channel}</span></td>
            <td>${s.qty}</td>
            <td>${fmt(s.total_revenue)}</td>
          </tr>`).join('')}</tbody>
      </table>`
    : '<div class="empty-msg">No sales logged yet.</div>';
}

// ── Products ────────────────────────────────────────────────────────────────

function renderProductList() {
  const q   = (document.getElementById('product-search')?.value || '').toLowerCase();
  const cat = document.getElementById('product-filter-cat')?.value || '';
  const list = DB.products.filter(p => {
    const mq = !q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
    const mc = !cat || p.category === cat;
    return mq && mc;
  });

  document.getElementById('product-list').innerHTML = list.length
    ? list.map(p => {
        const c = calcProductCost(p);
        return `<div class="product-card" onclick="openEditModal('product','${p.id}')">
          <div class="pc-top">
            <div>
              <div class="pc-name">${p.name}</div>
              <div class="pc-meta">${p.category || ''}${p.sku ? ' · ' + p.sku : ''}</div>
            </div>
            <div class="pc-actions" onclick="event.stopPropagation()">
              <button class="btn-icon" onclick="openEditModal('product','${p.id}')">✎</button>
              <button class="btn-icon btn-icon-del" onclick="confirmDelete('Products','${p.id}','products')">✕</button>
            </div>
          </div>
          <div class="pc-channels">
            <div class="channel-row">
              <span class="ch-label">Etsy</span>
              <span class="ch-price">${fmt(p.price_etsy)}</span>
              <span class="badge badge-${marginColor(c.marginEtsy)}">${fmtPct(c.marginEtsy)}</span>
            </div>
            <div class="channel-row">
              <span class="ch-label">Direct</span>
              <span class="ch-price">${fmt(p.price_direct)}</span>
              <span class="badge badge-${marginColor(c.marginDirect)}">${fmtPct(c.marginDirect)}</span>
            </div>
            <div class="channel-row">
              <span class="ch-label">Wholesale</span>
              <span class="ch-price">${fmt(p.price_wholesale)}</span>
              <span class="badge badge-${marginColor(c.marginWholesale)}">${fmtPct(c.marginWholesale)}</span>
            </div>
          </div>
          <div class="pc-cost-bar">
            <span>Total cost: ${fmt(c.subtotal)}</span>
            <span>Materials: ${fmt(c.matWithWaste)} · Labor: ${fmt(c.labor)} · Equip: ${fmt(c.equipCost)}</span>
          </div>
        </div>`;
      }).join('')
    : '<div class="empty-msg">No products found. Click "+ Add Product" to get started.</div>';
}

// ── Materials ───────────────────────────────────────────────────────────────

function renderMaterialList() {
  const cat = document.getElementById('material-filter-cat')?.value || '';
  const list = DB.materials.filter(m => !cat || m.category === cat);

  const grouped = {};
  list.forEach(m => {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m);
  });

  document.getElementById('material-list').innerHTML = Object.entries(grouped).length
    ? Object.entries(grouped).map(([cat, mats]) => `
        <div class="group-header">${cat}</div>
        <table class="data-table">
          <thead><tr><th>Name</th><th>Thickness</th><th>Unit</th><th>Cost/Unit</th><th>Supplier</th><th>Reorder At</th><th></th></tr></thead>
          <tbody>${mats.map(m => `
            <tr>
              <td>${m.name}</td>
              <td>${m.thickness || '—'}</td>
              <td>${m.unit}</td>
              <td>${fmt(m.cost_per_unit)}</td>
              <td>${m.supplier_url ? `<a href="${m.supplier_url}" target="_blank" class="supplier-link">${m.supplier || 'Visit'} ↗</a>` : (m.supplier || '—')}</td>
              <td>${m.reorder_threshold || CONFIG.DEFAULT_LOW_STOCK} ${m.unit}</td>
              <td class="td-actions">
                <button class="btn-icon" onclick="openEditModal('material','${m.id}')">✎</button>
                <button class="btn-icon btn-icon-del" onclick="confirmDelete('Materials','${m.id}','materials')">✕</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>`).join('')
    : '<div class="empty-msg">No materials yet. Click "+ Add Material" to get started.</div>';
}

// ── Inventory ───────────────────────────────────────────────────────────────

function renderInventoryList() {
  const sorted = [...DB.inventory].sort((a, b) => a.material_name.localeCompare(b.material_name));
  document.getElementById('inventory-list').innerHTML = sorted.length
    ? `<table class="data-table">
        <thead><tr><th>Material</th><th>Category</th><th>On Hand</th><th>Status</th><th>Last Updated</th><th></th></tr></thead>
        <tbody>${sorted.map(i => {
          const mat = DB.materials.find(m => m.id === i.material_id);
          const thresh = parseFloat(mat?.reorder_threshold || CONFIG.DEFAULT_LOW_STOCK);
          const qty = parseFloat(i.qty_on_hand || 0);
          const status = qty <= 0 ? 'bad' : qty <= thresh ? 'warn' : 'good';
          const statusLabel = qty <= 0 ? 'Out of stock' : qty <= thresh ? 'Low stock' : 'OK';
          return `<tr>
            <td>${i.material_name}</td>
            <td>${mat?.category || '—'}</td>
            <td>${i.qty_on_hand} ${mat?.unit || ''}</td>
            <td><span class="badge badge-${status}">${statusLabel}</span></td>
            <td>${i.last_updated || '—'}</td>
            <td class="td-actions">
              <button class="btn-icon" onclick="openEditModal('stock','${i.id}')">✎</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>`
    : '<div class="empty-msg">No inventory records. Add materials first, then update stock.</div>';
}

// ── Sales ───────────────────────────────────────────────────────────────────

function renderSalesList() {
  const channel = document.getElementById('sales-filter-channel')?.value || '';
  const month   = document.getElementById('sales-filter-month')?.value || '';
  let list = DB.sales.filter(s => {
    const mc = !channel || s.channel === channel;
    const mm = !month || s.date.startsWith(month);
    return mc && mm;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalRev = list.reduce((s, x) => s + parseFloat(x.total_revenue || 0), 0);
  const totalUnits = list.reduce((s, x) => s + parseInt(x.qty || 0), 0);
  document.getElementById('sales-summary').innerHTML = list.length ? `
    <div class="summary-pill">Sales: <strong>${list.length}</strong></div>
    <div class="summary-pill">Units: <strong>${totalUnits}</strong></div>
    <div class="summary-pill">Revenue: <strong>${fmt(totalRev)}</strong></div>
  ` : '';

  document.getElementById('sales-list').innerHTML = list.length
    ? `<table class="data-table">
        <thead><tr><th>Date</th><th>Product</th><th>Channel</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Shipping</th><th>Total</th><th>Notes</th><th></th></tr></thead>
        <tbody>${list.map(s => `
          <tr>
            <td>${s.date}</td>
            <td>${s.product_name}</td>
            <td><span class="channel-badge channel-${s.channel.toLowerCase().replace(/[\s-]/g,'')}">${s.channel}</span></td>
            <td>${s.qty}</td>
            <td>${fmt(s.unit_price)}</td>
            <td>${s.discount ? fmt(s.discount) : '—'}</td>
            <td>${s.shipping_charged ? fmt(s.shipping_charged) : '—'}</td>
            <td><strong>${fmt(s.total_revenue)}</strong></td>
            <td>${s.notes || '—'}</td>
            <td class="td-actions">
              <button class="btn-icon btn-icon-del" onclick="confirmDelete('Sales','${s.id}','sales')">✕</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : '<div class="empty-msg">No sales match your filters.</div>';
}

// ── Equipment ───────────────────────────────────────────────────────────────

function renderEquipmentList() {
  document.getElementById('equipment-list').innerHTML = DB.equipment.length
    ? `<table class="data-table">
        <thead><tr><th>Equipment</th><th>Purchase Price</th><th>Purchased</th><th>Life (yrs)</th><th>Wattage</th><th>$/kWh</th><th>Hrs/Month</th><th>Cost/Hr</th><th></th></tr></thead>
        <tbody>${DB.equipment.map(e => {
          const hoursPerYear = parseFloat(e.hours_per_month || 0) * 12;
          const depPerHr = hoursPerYear > 0
            ? parseFloat(e.purchase_price || 0) / (parseFloat(e.expected_life_years || 1) * hoursPerYear)
            : 0;
          const elecPerHr = (parseFloat(e.wattage || 0) / 1000) * parseFloat(e.cost_per_kwh || 0);
          const totalPerHr = depPerHr + elecPerHr;
          return `<tr>
            <td><strong>${e.name}</strong></td>
            <td>${fmt(e.purchase_price)}</td>
            <td>${e.purchase_date || '—'}</td>
            <td>${e.expected_life_years || '—'}</td>
            <td>${e.wattage ? e.wattage + 'W' : '—'}</td>
            <td>${e.cost_per_kwh ? fmt(e.cost_per_kwh) : '—'}</td>
            <td>${e.hours_per_month || '—'}</td>
            <td><strong>${fmt(totalPerHr)}/hr</strong></td>
            <td class="td-actions">
              <button class="btn-icon" onclick="openEditModal('equipment','${e.id}')">✎</button>
              <button class="btn-icon btn-icon-del" onclick="confirmDelete('Equipment','${e.id}','equipment')">✕</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>
      <div class="equip-note">Cost/Hr = depreciation + electricity. This value is used automatically in product cost calculations when you enter laser minutes.</div>`
    : '<div class="empty-msg">No equipment tracked yet. Add your laser cutter to enable per-product equipment cost calculations.</div>';
}

// ── Modal System ────────────────────────────────────────────────────────────

let currentModal = null;
let currentEditId = null;

function openModal(type) {
  currentModal = type;
  currentEditId = null;
  renderModalContent(type, null);
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function openEditModal(type, id) {
  currentModal = type;
  currentEditId = id;
  const data = {
    product:   DB.products.find(x => x.id === id),
    material:  DB.materials.find(x => x.id === id),
    stock:     DB.inventory.find(x => x.id === id),
    sale:      DB.sales.find(x => x.id === id),
    equipment: DB.equipment.find(x => x.id === id),
  }[type];
  renderModalContent(type, data);
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  currentModal = null;
  currentEditId = null;
}

function closeModalIfOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function renderModalContent(type, data) {
  const v = (k, def = '') => data?.[k] !== undefined ? data[k] : def;
  const titles = { product:'Product', material:'Material', stock:'Update Stock', sale:'Log Sale', equipment:'Equipment' };
  document.getElementById('modal-title').textContent = (currentEditId ? 'Edit ' : 'Add ') + titles[type];

  const forms = {
    product: () => `
      <div class="form-section"><div class="form-section-title">Product Info</div>
        <div class="fg2">
          <div class="field"><label>Name *</label><input id="f-name" value="${v('name')}" placeholder="e.g. Dragon's Hoard Dice Box"></div>
          <div class="field"><label>Category</label><select id="f-category">${['','Dice Box','Dice Tray','Dice Jail','Card Box','Chest','Coaster','Other'].map(c=>`<option${v('category')===c?' selected':''}>${c}</option>`).join('')}</select></div>
          <div class="field"><label>SKU</label><input id="f-sku" value="${v('sku')}" placeholder="e.g. DB-001"></div>
          <div class="field full"><label>Description / Notes</label><textarea id="f-description">${v('description')}</textarea></div>
        </div>
      </div>
      <div class="form-section"><div class="form-section-title">Material Costs ($ per unit, before waste)</div>
        <div class="fg3">
          <div class="field"><label>Wood / MDF</label><input type="number" id="f-wood" value="${v('wood','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Acrylic</label><input type="number" id="f-acrylic" value="${v('acrylic','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Felt</label><input type="number" id="f-felt" value="${v('felt','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Adhesive (glue/CA)</label><input type="number" id="f-adhesive" value="${v('adhesive','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Hardware (magnets etc.)</label><input type="number" id="f-hardware" value="${v('hardware','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Finishing (stain/polish)</label><input type="number" id="f-finishing" value="${v('finishing','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Packaging materials</label><input type="number" id="f-packaging_mat" value="${v('packaging_mat','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Other materials</label><input type="number" id="f-other_mat" value="${v('other_mat','0')}" step="0.01" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Material waste %</label><input type="number" id="f-waste_pct" value="${v('waste_pct','5')}" step="1" min="0" max="100" oninput="updateProductPreview()"><span class="field-hint">e.g. 5 = 5% waste added to material cost</span></div>
        </div>
      </div>
      <div class="form-section"><div class="form-section-title">Labor & Equipment</div>
        <div class="fg3">
          <div class="field"><label>Labor hours</label><input type="number" id="f-labor_hours" value="${v('labor_hours','0')}" step="0.25" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Your hourly rate ($)</label><input type="number" id="f-labor_rate" value="${v('labor_rate','15')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Laser time (minutes)</label><input type="number" id="f-laser_minutes" value="${v('laser_minutes','0')}" step="1" min="0" oninput="updateProductPreview()"><span class="field-hint">Auto-calculates from equipment settings</span></div>
        </div>
      </div>
      <div class="form-section"><div class="form-section-title">Pricing by Channel</div>
        <div class="pricing-helper">
          <label>Target margin %</label>
          <input type="number" id="f-target-margin" value="40" step="5" min="0" max="100" oninput="updateProductPreview()">
          <button type="button" class="btn-secondary btn-sm" onclick="applyTargetMargin()">Apply suggested prices</button>
        </div>
        <div class="fg3">
          <div class="field"><label>Etsy price ($)</label><input type="number" id="f-price_etsy" value="${v('price_etsy','0')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Direct sale price ($)</label><input type="number" id="f-price_direct" value="${v('price_direct','0')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
          <div class="field"><label>Hobby shop price ($)</label><input type="number" id="f-price_wholesale" value="${v('price_wholesale','0')}" step="0.5" min="0" oninput="updateProductPreview()"></div>
        </div>
        <div id="product-preview" class="cost-preview"></div>
      </div>`,

    material: () => `
      <div class="fg2">
        <div class="field"><label>Category *</label><select id="f-category" onchange="updateMaterialNameOptions()">
          ${['Sheet Good - Wood','Sheet Good - Acrylic','Sheet Good - Felt','Adhesive','Hardware','Magnets','Finishing','Packaging','Dice','Other']
            .map(c=>`<option${v('category')===c?' selected':''}>${c}</option>`).join('')}
        </select></div>
        <div class="field"><label>Name *</label>
          <div class="name-input-wrap">
            <input id="f-name" value="${v('name')}" placeholder="e.g. Basswood 12x12" list="f-name-suggestions">
            <datalist id="f-name-suggestions"></datalist>
          </div>
        </div>
        <div class="field" id="magnet-size-field">
          <label>Magnet size *</label>
          <select id="f-magnet-size" onchange="document.getElementById('f-name').value=this.value">
            ${['Round 5x3','Round 10x3','Round 10x2','Round 5x2','Round 6x2','Round 3x1','Round 4x2','Round 3x2']
              .map(s=>`<option${v('name')===s?' selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Thickness <span class="optional-label">(optional)</span></label>
          <select id="f-thickness">
            <option value="">— not applicable —</option>
            ${['1mm','3mm','5mm'].map(t=>`<option${v('thickness')===t?' selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Unit *</label><input id="f-unit" value="${v('unit','sheet')}" placeholder="e.g. sheet, bottle, pack, each"></div>
        <div class="field"><label>Supplier</label><input id="f-supplier" value="${v('supplier')}" placeholder="e.g. Woodcraft, Amazon"></div>
        <div class="field"><label>Reorder when below</label><input type="number" id="f-reorder_threshold" value="${v('reorder_threshold','3')}" step="1" min="0"></div>
        <div class="field full supplier-url-field">
          <label>Supplier website</label>
          <div class="url-input-wrap">
            <input id="f-supplier_url" value="${v('supplier_url')}" placeholder="https://www.amazon.com/your-product-link" type="url">
            ${v('supplier_url') ? `<a href="${v('supplier_url')}" target="_blank" class="url-open-btn" title="Open supplier page">↗</a>` : ''}
          </div>
        </div>
      </div>
      <div class="cost-calc-box">
        <div class="cost-calc-title">Cost calculator — enter what you paid and how many you got</div>
        <div class="cost-calc-row">
          <div class="field">
            <label>Total price paid ($)</label>
            <input type="number" id="f-total-paid" step="0.01" min="0" placeholder="e.g. 24.99" oninput="calcCostPerUnit()">
          </div>
          <div class="cost-calc-divider">÷</div>
          <div class="field">
            <label>Quantity purchased</label>
            <input type="number" id="f-qty-purchased" step="1" min="1" placeholder="e.g. 12" oninput="calcCostPerUnit()">
          </div>
          <div class="cost-calc-divider">=</div>
          <div class="field">
            <label>Cost per unit ($) *</label>
            <input type="number" id="f-cost_per_unit" value="${v('cost_per_unit','0')}" step="0.01" min="0" oninput="calcCostPerUnit()">
          </div>
        </div>
      </div>
      <div class="fg2">
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`,

    stock: () => {
      const matOptions = DB.materials.map(m =>
        `<option value="${m.id}" data-name="${m.name}"${v('material_id')===m.id?' selected':''}>${m.name} (${m.category})</option>`
      ).join('');
      return `<div class="fg2">
        <div class="field"><label>Material *</label><select id="f-material_id">${matOptions}</select></div>
        <div class="field"><label>Quantity on hand *</label><input type="number" id="f-qty_on_hand" value="${v('qty_on_hand','0')}" step="0.5" min="0"></div>
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`;
    },

    sale: () => {
      const productOptions = DB.products.map(p =>
        `<option value="${p.id}" data-name="${p.name}"${v('product_id')===p.id?' selected':''}>${p.name}</option>`
      ).join('');
      return `<div class="fg2">
        <div class="field"><label>Date *</label><input type="date" id="f-date" value="${v('date', new Date().toISOString().slice(0,10))}"></div>
        <div class="field"><label>Product *</label><select id="f-product_id" onchange="updateSalePrice()">${productOptions}</select></div>
        <div class="field"><label>Channel *</label><select id="f-channel">
          ${['Etsy','Direct - Customer','Direct - Hobby Shop'].map(c=>`<option${v('channel')===c?' selected':''}>${c}</option>`).join('')}
        </select></div>
        <div class="field"><label>Quantity *</label><input type="number" id="f-qty" value="${v('qty','1')}" step="1" min="1" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Unit price ($) *</label><input type="number" id="f-unit_price" value="${v('unit_price','0')}" step="0.01" min="0" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Discount ($)</label><input type="number" id="f-discount" value="${v('discount','0')}" step="0.01" min="0" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Shipping charged ($)</label><input type="number" id="f-shipping_charged" value="${v('shipping_charged','0')}" step="0.01" min="0" oninput="updateSaleTotal()"></div>
        <div class="field"><label>Total revenue</label><input type="number" id="f-total_revenue" value="${v('total_revenue','0')}" step="0.01" min="0"></div>
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`;
    },

    equipment: () => `
      <div class="fg2">
        <div class="field"><label>Equipment name *</label><input id="f-name" value="${v('name')}" placeholder="e.g. xTool D1 Pro Laser"></div>
        <div class="field"><label>Purchase price ($)</label><input type="number" id="f-purchase_price" value="${v('purchase_price','0')}" step="0.01" min="0"></div>
        <div class="field"><label>Purchase date</label><input type="date" id="f-purchase_date" value="${v('purchase_date')}"></div>
        <div class="field"><label>Expected life (years)</label><input type="number" id="f-expected_life_years" value="${v('expected_life_years','5')}" step="1" min="1"></div>
        <div class="field"><label>Wattage (W)</label><input type="number" id="f-wattage" value="${v('wattage','0')}" step="1" min="0"><span class="field-hint">Used to calc electricity cost</span></div>
        <div class="field"><label>Electricity cost ($/kWh)</label><input type="number" id="f-cost_per_kwh" value="${v('cost_per_kwh','0.12')}" step="0.01" min="0"><span class="field-hint">Check your electric bill</span></div>
        <div class="field"><label>Avg hours used/month</label><input type="number" id="f-hours_per_month" value="${v('hours_per_month','0')}" step="0.5" min="0"><span class="field-hint">Used for depreciation calc</span></div>
        <div class="field full"><label>Notes</label><textarea id="f-notes">${v('notes')}</textarea></div>
      </div>`,
  };

  document.getElementById('modal-body').innerHTML = forms[type]();
  if (type === 'product') setTimeout(updateProductPreview, 50);
  if (type === 'sale') setTimeout(updateSalePrice, 50);
  if (type === 'material') setTimeout(updateMaterialNameOptions, 50);
}

function updateSalePrice() {
  const sel = document.getElementById('f-product_id');
  if (!sel) return;
  const pid = sel.value;
  const prod = DB.products.find(p => p.id === pid);
  if (!prod) return;
  const channel = document.getElementById('f-channel')?.value || '';
  let price = 0;
  if (channel === 'Etsy') price = parseFloat(prod.price_etsy || 0);
  else if (channel === 'Direct - Customer') price = parseFloat(prod.price_direct || 0);
  else if (channel === 'Direct - Hobby Shop') price = parseFloat(prod.price_wholesale || 0);
  if (price) document.getElementById('f-unit_price').value = price.toFixed(2);
  updateSaleTotal();
}

const MATERIAL_NAMES = {
  'Sheet Good - Wood': ['Basswood','Mahogany','Black Walnut','Cherry','Maple'],
  'Sheet Good - Acrylic': ['Acrylic - Clear','Acrylic - Black','Acrylic - White','Acrylic - Red','Acrylic - Blue','Acrylic - Green','Acrylic - Yellow','Acrylic - Orange','Acrylic - Purple','Acrylic - Pink'],
  'Sheet Good - Felt': ['Felt - Black','Felt - White','Felt - Red','Felt - Blue','Felt - Green','Felt - Yellow','Felt - Orange','Felt - Purple','Felt - Pink','Felt - Grey'],
  'Adhesive': ['CA Glue','Wood Glue - PVA','Wood Glue - Titebond','Epoxy'],
  'Hardware': ['Hinges','Clasps','Screws','Nails'],
  'Magnets': ['Round 5x3','Round 10x3','Round 10x2','Round 5x2','Round 6x2','Round 3x1','Round 4x2','Round 3x2'],
  'Finishing': ['Stain','Wood Polish','Masking Tape','Nitrile Gloves','Sponges','Polishing Cloth'],
  'Packaging': ['Bubble Wrap','Shipping Box - Small','Shipping Box - Medium','Shipping Box - Large','Printer Paper','Shipping Labels','Tissue Paper'],
  'Dice': ['d4','d6','d8','d10','d12','d20','d100','Polyhedral Set'],
  'Other': [],
};

function updateMaterialNameOptions() {
  const cat = document.getElementById('f-category')?.value || '';
  const datalist = document.getElementById('f-name-suggestions');
  const nameInput = document.getElementById('f-name');
  const magnetSel = document.getElementById('f-magnet-size');

  // Show/hide thickness based on category
  const thickEl = document.getElementById('f-thickness')?.closest('.field');
  if (thickEl) {
    const showThickness = cat.startsWith('Sheet Good') || cat === 'Other';
    thickEl.style.display = showThickness ? '' : 'none';
  }

  // Handle Magnets category specially
  const nameField = nameInput?.closest('.field');
  const magnetField = magnetSel?.closest('.field');
  if (cat === 'Magnets') {
    if (nameField) nameField.style.display = 'none';
    if (magnetField) magnetField.style.display = '';
    // Sync magnet select to name input so it saves correctly
    if (magnetSel && nameInput) nameInput.value = magnetSel.value;
  } else {
    if (nameField) nameField.style.display = '';
    if (magnetField) magnetField.style.display = 'none';
    if (datalist) {
      const names = MATERIAL_NAMES[cat] || [];
      datalist.innerHTML = names.map(n => `<option value="${n}">`).join('');
    }
  }
}

function calcCostPerUnit() {
  const totalPaid = parseFloat(document.getElementById('f-total-paid')?.value || 0);
  const qtyPurchased = parseFloat(document.getElementById('f-qty-purchased')?.value || 0);
  const costField = document.getElementById('f-cost_per_unit');
  if (!costField) return;
  if (totalPaid > 0 && qtyPurchased > 0) {
    costField.value = (totalPaid / qtyPurchased).toFixed(4);
  }
}

function updateSaleTotal() {
  const qty = parseFloat(document.getElementById('f-qty')?.value || 1);
  const unit = parseFloat(document.getElementById('f-unit_price')?.value || 0);
  const disc = parseFloat(document.getElementById('f-discount')?.value || 0);
  const ship = parseFloat(document.getElementById('f-shipping_charged')?.value || 0);
  const total = (qty * unit) - disc + ship;
  const el = document.getElementById('f-total_revenue');
  if (el) el.value = total.toFixed(2);
}

function updateProductPreview() {
  const mock = {
    wood: document.getElementById('f-wood')?.value || 0,
    acrylic: document.getElementById('f-acrylic')?.value || 0,
    felt: document.getElementById('f-felt')?.value || 0,
    adhesive: document.getElementById('f-adhesive')?.value || 0,
    hardware: document.getElementById('f-hardware')?.value || 0,
    finishing: document.getElementById('f-finishing')?.value || 0,
    packaging_mat: document.getElementById('f-packaging_mat')?.value || 0,
    other_mat: document.getElementById('f-other_mat')?.value || 0,
    waste_pct: document.getElementById('f-waste_pct')?.value || 0,
    labor_hours: document.getElementById('f-labor_hours')?.value || 0,
    labor_rate: document.getElementById('f-labor_rate')?.value || 15,
    laser_minutes: document.getElementById('f-laser_minutes')?.value || 0,
    price_etsy: document.getElementById('f-price_etsy')?.value || 0,
    price_direct: document.getElementById('f-price_direct')?.value || 0,
    price_wholesale: document.getElementById('f-price_wholesale')?.value || 0,
  };
  const c = calcProductCost(mock);
  const el = document.getElementById('product-preview');
  if (!el) return;
  el.innerHTML = `
    <div class="preview-row"><span>Materials (with ${mock.waste_pct}% waste)</span><span>${fmt(c.matWithWaste)}</span></div>
    <div class="preview-row"><span>Labor (${mock.labor_hours}h × $${mock.labor_rate}/hr)</span><span>${fmt(c.labor)}</span></div>
    <div class="preview-row"><span>Equipment (laser ${mock.laser_minutes} min)</span><span>${fmt(c.equipCost)}</span></div>
    <div class="preview-row preview-subtotal"><span>Your cost to make</span><span>${fmt(c.subtotal)}</span></div>
    <div class="preview-channels">
      <div class="preview-channel">
        <div class="preview-ch-label">Etsy</div>
        <div class="preview-ch-fees">Fees: ${fmt(c.etsyFees)}</div>
        <div class="preview-ch-profit ${marginColor(c.marginEtsy)}">${fmt(c.profitEtsy)} profit</div>
        <div class="preview-ch-margin">${fmtPct(c.marginEtsy)} margin</div>
      </div>
      <div class="preview-channel">
        <div class="preview-ch-label">Direct</div>
        <div class="preview-ch-fees">No platform fees</div>
        <div class="preview-ch-profit ${marginColor(c.marginDirect)}">${fmt(c.profitDirect)} profit</div>
        <div class="preview-ch-margin">${fmtPct(c.marginDirect)} margin</div>
      </div>
      <div class="preview-channel">
        <div class="preview-ch-label">Wholesale</div>
        <div class="preview-ch-fees">No platform fees</div>
        <div class="preview-ch-profit ${marginColor(c.marginWholesale)}">${fmt(c.profitWholesale)} profit</div>
        <div class="preview-ch-margin">${fmtPct(c.marginWholesale)} margin</div>
      </div>
    </div>`;
}

function applyTargetMargin() {
  const target = parseFloat(document.getElementById('f-target-margin')?.value || 40);
  const mock = {
    wood: document.getElementById('f-wood')?.value||0,
    acrylic: document.getElementById('f-acrylic')?.value||0,
    felt: document.getElementById('f-felt')?.value||0,
    adhesive: document.getElementById('f-adhesive')?.value||0,
    hardware: document.getElementById('f-hardware')?.value||0,
    finishing: document.getElementById('f-finishing')?.value||0,
    packaging_mat: document.getElementById('f-packaging_mat')?.value||0,
    other_mat: document.getElementById('f-other_mat')?.value||0,
    waste_pct: document.getElementById('f-waste_pct')?.value||0,
    labor_hours: document.getElementById('f-labor_hours')?.value||0,
    labor_rate: document.getElementById('f-labor_rate')?.value||15,
    laser_minutes: document.getElementById('f-laser_minutes')?.value||0,
    price_etsy:'0', price_direct:'0', price_wholesale:'0',
  };
  const c = calcProductCost(mock);
  const etsyFeesPct = CONFIG.FEES.ETSY_TRANSACTION + CONFIG.FEES.ETSY_PAYMENT;
  const priceEtsy = suggestedPrice(c.subtotal, target, etsyFeesPct);
  const priceDirect = suggestedPrice(c.subtotal, target, 0);
  const priceWholesale = suggestedPrice(c.subtotal, target, 0);
  if (priceEtsy) document.getElementById('f-price_etsy').value = Math.ceil(priceEtsy * 2) / 2;
  if (priceDirect) document.getElementById('f-price_direct').value = Math.ceil(priceDirect * 2) / 2;
  if (priceWholesale) document.getElementById('f-price_wholesale').value = Math.ceil(priceWholesale * 2) / 2;
  updateProductPreview();
}

// ── Save Modal ──────────────────────────────────────────────────────────────

function getActivePage() {
  const active = document.querySelector(".page.active");
  return active ? active.id.replace("page-", "") : null;
}

async function saveModal() {
  const btn = document.getElementById('modal-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving...';
  showSync('Saving to Google Sheets...');

  try {
    await doSave();
    await loadAllData();
    closeModal();
    // Always re-render whichever page is currently active
    const activePage = getActivePage();
    const renders = {
      dashboard: renderDashboard,
      products: renderProductList, materials: renderMaterialList,
      inventory: renderInventoryList, sales: renderSalesList, equipment: renderEquipmentList
    };
    if (activePage && renders[activePage]) renders[activePage]();
  } catch(e) {
    alert('Error saving: ' + e.message);
    console.error(e);
  }
  hideSync();
  btn.disabled = false;
  btn.textContent = 'Save';
}

async function doSave() {
  const gv = id => document.getElementById(id)?.value || '';
  const gvn = id => gv(id) || '0';

  if (currentModal === 'product') {
    if (!gv('f-name').trim()) throw new Error('Product name is required.');
    const obj = {
      id: currentEditId || genId(),
      name: gv('f-name').trim(),
      category: gv('f-category'),
      sku: gv('f-sku'),
      description: gv('f-description'),
      wood: gvn('f-wood'), acrylic: gvn('f-acrylic'), felt: gvn('f-felt'),
      adhesive: gvn('f-adhesive'), hardware: gvn('f-hardware'),
      finishing: gvn('f-finishing'), packaging_mat: gvn('f-packaging_mat'),
      other_mat: gvn('f-other_mat'), waste_pct: gvn('f-waste_pct'),
      labor_hours: gvn('f-labor_hours'), labor_rate: gvn('f-labor_rate'),
      laser_minutes: gvn('f-laser_minutes'),
      price_etsy: gvn('f-price_etsy'), price_direct: gvn('f-price_direct'),
      price_wholesale: gvn('f-price_wholesale'),
      notes: gv('f-description'),
      created_at: currentEditId ? (DB.products.find(p=>p.id===currentEditId)?.created_at||new Date().toISOString().slice(0,10)) : new Date().toISOString().slice(0,10),
    };
    if (currentEditId) await updateRow('Products', obj); else await appendRow('Products', obj);
  }

  else if (currentModal === 'material') {
    if (!gv('f-name').trim()) throw new Error('Material name is required.');
    const obj = {
      id: currentEditId || genId(),
      name: gv('f-name').trim(),
      category: gv('f-category'),
      unit: gv('f-unit') || 'sheet',
      cost_per_unit: gvn('f-cost_per_unit'),
      thickness: gv('f-thickness'),
      supplier: gv('f-supplier'),
      supplier_url: gv('f-supplier_url'),
      reorder_threshold: gvn('f-reorder_threshold'),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Materials', obj); else await appendRow('Materials', obj);
    // Auto-create inventory record
    if (!currentEditId) {
      await appendRow('Inventory', {
        id: genId(), material_id: obj.id, material_name: obj.name,
        qty_on_hand: '0', last_updated: new Date().toISOString().slice(0,10), notes: '',
      });
    }
  }

  else if (currentModal === 'stock') {
    const matSel = document.getElementById('f-material_id');
    const matId = matSel?.value || '';
    const matName = matSel?.selectedOptions[0]?.dataset.name || '';
    if (!matId) throw new Error('Please select a material.');
    const obj = {
      id: currentEditId || genId(),
      material_id: matId,
      material_name: matName,
      qty_on_hand: gvn('f-qty_on_hand'),
      last_updated: new Date().toISOString().slice(0,10),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Inventory', obj); else await appendRow('Inventory', obj);
  }

  else if (currentModal === 'sale') {
    const prodSel = document.getElementById('f-product_id');
    const prodId = prodSel?.value || '';
    const prodName = prodSel?.selectedOptions[0]?.text || '';
    if (!prodId) throw new Error('Please select a product.');
    const obj = {
      id: currentEditId || genId(),
      date: gv('f-date'),
      product_id: prodId,
      product_name: prodName,
      channel: gv('f-channel'),
      qty: gvn('f-qty'),
      unit_price: gvn('f-unit_price'),
      total_revenue: gvn('f-total_revenue'),
      discount: gvn('f-discount'),
      shipping_charged: gvn('f-shipping_charged'),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Sales', obj); else await appendRow('Sales', obj);
  }

  else if (currentModal === 'equipment') {
    if (!gv('f-name').trim()) throw new Error('Equipment name is required.');
    const obj = {
      id: currentEditId || genId(),
      name: gv('f-name').trim(),
      purchase_price: gvn('f-purchase_price'),
      purchase_date: gv('f-purchase_date'),
      expected_life_years: gvn('f-expected_life_years'),
      wattage: gvn('f-wattage'),
      cost_per_kwh: gvn('f-cost_per_kwh'),
      hours_per_month: gvn('f-hours_per_month'),
      notes: gv('f-notes'),
    };
    if (currentEditId) await updateRow('Equipment', obj); else await appendRow('Equipment', obj);
  }
}

// ── Delete ──────────────────────────────────────────────────────────────────

async function confirmDelete(sheetName, id, dbKey) {
  if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
  showSync('Deleting...');
  try {
    await deleteRow(sheetName, id);
    DB[dbKey] = DB[dbKey].filter(x => x.id !== id);
    const renders = {
      products: renderProductList, materials: renderMaterialList,
      inventory: renderInventoryList, sales: renderSalesList, equipment: renderEquipmentList,
    };
    if (renders[dbKey]) renders[dbKey]();
  } catch(e) {
    alert('Error deleting: ' + e.message);
  }
  hideSync();
}
