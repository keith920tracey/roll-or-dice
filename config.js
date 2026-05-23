// Roll or Dice — Configuration
const CONFIG = {
  CLIENT_ID: '633281988309-qr2n4802c5bvopg8n6n7mag0n0gi4cm6.apps.googleusercontent.com',
  SHEET_ID: '1wkYulyN3Lr4JCxw4XwTvnpl5YpXsshK1uYT8LCuwbZU',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
  DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',

  // Sheet tab names — do not change after first run
  SHEETS: {
    PRODUCTS:  'Products',
    MATERIALS: 'Materials',
    INVENTORY: 'Inventory',
    SALES:     'Sales',
    EQUIPMENT: 'Equipment',
  },

  // Etsy fee structure
  FEES: {
    ETSY_TRANSACTION: 0.065,
    ETSY_PAYMENT:     0.03,
    ETSY_LISTING:     0.20,
  },

  // Low stock warning threshold (override per material in the Materials sheet)
  DEFAULT_LOW_STOCK: 3,
};
