import { Product } from '../types';
import Papa from 'papaparse';

export const loadProducts = async (): Promise<Product[]> => {
  const response = await fetch('/data/products.csv');
  const csv = await response.text();
  
  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  });
  
  return data as Product[];
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