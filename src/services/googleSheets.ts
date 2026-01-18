import Papa from 'papaparse';
import { Product } from '../types';

// Google Sheets Configuration
const getConfig = () => ({
  sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  csvUrl: import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || '',
});

// Sheets API base URL
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Fetch products from published Google Sheet CSV (no auth required)
 */
export async function fetchProductsFromSheet(): Promise<Product[]> {
  const { csvUrl } = getConfig();

  if (!csvUrl) {
    throw new Error('Google Sheet CSV URL not configured');
  }

  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch from Google Sheets: ${response.status}`);
  }

  const csv = await response.text();

  const { data, errors } = Papa.parse<Product>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (errors.length > 0) {
    console.warn('CSV parsing warnings:', errors);
  }

  // Filter out any rows without required fields
  return data.filter(product => product.id && product.name && product.brand);
}

/**
 * Get the row number for a product by ID
 */
async function getRowNumberById(id: string): Promise<number | null> {
  const { sheetId, apiKey } = getConfig();

  // Fetch column A (IDs) to find the row
  const url = `${SHEETS_API_BASE}/${sheetId}/values/A:A?key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.status}`);
  }

  const data = await response.json();
  const values: string[][] = data.values || [];

  // Find the row (1-indexed, row 1 is header)
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      return i + 1; // Sheets rows are 1-indexed
    }
  }

  return null;
}

/**
 * Get the next available ID
 */
async function getNextId(): Promise<string> {
  const { sheetId, apiKey } = getConfig();

  const url = `${SHEETS_API_BASE}/${sheetId}/values/A:A?key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.status}`);
  }

  const data = await response.json();
  const values: string[][] = data.values || [];

  // Find max ID (skip header row)
  let maxId = 0;
  for (let i = 1; i < values.length; i++) {
    const id = parseInt(values[i][0], 10);
    if (!isNaN(id) && id > maxId) {
      maxId = id;
    }
  }

  return String(maxId + 1);
}

/**
 * Add a new product to the Google Sheet
 */
export async function addProductToSheet(
  product: Omit<Product, 'id'>
): Promise<Product> {
  const { sheetId, apiKey } = getConfig();

  if (!sheetId || !apiKey) {
    throw new Error('Google Sheets API not configured');
  }

  const newId = await getNextId();

  const newProduct: Product = {
    id: newId,
    ...product,
  };

  // Prepare row data in column order
  const rowData = [
    newProduct.id,
    newProduct.name,
    newProduct.brand,
    newProduct.category,
    newProduct.ingredients || '',
    newProduct.imageUrl || '',
    newProduct.barcode || '',
  ];

  const url = `${SHEETS_API_BASE}/${sheetId}/values/A:G:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowData],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to add product: ${error.error?.message || response.status}`);
  }

  return newProduct;
}

/**
 * Update an existing product in the Google Sheet
 */
export async function updateProductInSheet(product: Product): Promise<void> {
  const { sheetId, apiKey } = getConfig();

  if (!sheetId || !apiKey) {
    throw new Error('Google Sheets API not configured');
  }

  const rowNumber = await getRowNumberById(product.id);

  if (!rowNumber) {
    throw new Error(`Product with ID ${product.id} not found in sheet`);
  }

  // Prepare row data in column order
  const rowData = [
    product.id,
    product.name,
    product.brand,
    product.category,
    product.ingredients || '',
    product.imageUrl || '',
    product.barcode || '',
  ];

  const range = `A${rowNumber}:G${rowNumber}`;
  const url = `${SHEETS_API_BASE}/${sheetId}/values/${range}?valueInputOption=RAW&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowData],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update product: ${error.error?.message || response.status}`);
  }
}

/**
 * Delete a product from the Google Sheet
 * Note: This clears the row content. For actual row deletion,
 * you would need to use batchUpdate with deleteDimension request.
 */
export async function deleteProductFromSheet(id: string): Promise<void> {
  const { sheetId, apiKey } = getConfig();

  if (!sheetId || !apiKey) {
    throw new Error('Google Sheets API not configured');
  }

  const rowNumber = await getRowNumberById(id);

  if (!rowNumber) {
    throw new Error(`Product with ID ${id} not found in sheet`);
  }

  // Clear the row content
  const range = `A${rowNumber}:G${rowNumber}`;
  const url = `${SHEETS_API_BASE}/${sheetId}/values/${range}:clear?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete product: ${error.error?.message || response.status}`);
  }
}

/**
 * Check if Google Sheets is properly configured
 */
export function isGoogleSheetsConfigured(): boolean {
  const { csvUrl } = getConfig();
  return Boolean(csvUrl);
}

/**
 * Check if admin write operations are available
 */
export function isAdminWriteEnabled(): boolean {
  const { sheetId, apiKey } = getConfig();
  return Boolean(sheetId && apiKey);
}
