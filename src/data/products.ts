import { Product } from '../types';
import Papa from 'papaparse';
import { fetchProductsFromSheet, isGoogleSheetsConfigured } from '../services/googleSheets';

/**
 * Load products from Google Sheets, with fallback to local CSV
 */
export const loadProducts = async (): Promise<Product[]> => {
  // Try Google Sheets first if configured
  if (isGoogleSheetsConfigured()) {
    try {
      const products = await fetchProductsFromSheet();
      console.log(`Loaded ${products.length} products from Google Sheets`);
      return products;
    } catch (error) {
      console.warn('Failed to fetch from Google Sheets, falling back to local CSV:', error);
    }
  }

  // Fallback to local CSV
  try {
    const response = await fetch('/data/products.csv');
    const csv = await response.text();

    const { data } = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
    });

    console.log(`Loaded ${data.length} products from local CSV`);
    return data as Product[];
  } catch (error) {
    console.error('Failed to load products from local CSV:', error);
    throw error;
  }
};

export const categories = [
  "Temizlik",
  "Kahvaltılık",
  "Konserve",
  "Dondurulmuş Gıda",
  "Atıştırmalık",
  "Sos",
  "Çikolata",
  "Şarküteri",
] as const;

export type Category = typeof categories[number];
