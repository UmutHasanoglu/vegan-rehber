import Papa from 'papaparse';
import { Product } from '../types';

// Google Sheets Configuration
const getConfig = () => ({
  csvUrl: import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || '',
});

// Netlify Function URL for write operations
const NETLIFY_FUNCTION_URL = '/.netlify/functions/sheets-api';

// Get admin PIN from session storage (set during login)
const getAdminPin = (): string => {
  return sessionStorage.getItem('adminPin') || '';
};

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
 * Add a new product to the Google Sheet via Netlify Function
 */
export async function addProductToSheet(
  product: Omit<Product, 'id'>
): Promise<Product> {
  const pin = getAdminPin();

  if (!pin) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${NETLIFY_FUNCTION_URL}?action=add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${pin}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to add product: ${response.status}`);
  }

  return response.json();
}

/**
 * Update an existing product in the Google Sheet via Netlify Function
 */
export async function updateProductInSheet(product: Product): Promise<void> {
  const pin = getAdminPin();

  if (!pin) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${NETLIFY_FUNCTION_URL}?action=update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${pin}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to update product: ${response.status}`);
  }
}

/**
 * Delete a product from the Google Sheet via Netlify Function
 */
export async function deleteProductFromSheet(id: string): Promise<void> {
  const pin = getAdminPin();

  if (!pin) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${NETLIFY_FUNCTION_URL}?action=delete&id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${pin}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to delete product: ${response.status}`);
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
 * (Always true now since we use Netlify Function)
 */
export function isAdminWriteEnabled(): boolean {
  return true;
}
