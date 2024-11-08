export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string;
  imageUrl: string;
  barcode?: string;
}

export interface ReportForm {
  name: string;
  email: string;
  description: string;
  type: 'new' | 'report';
  productId?: string;
}