import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { google } from 'googleapis';

// Types
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients?: string;
  imageUrl?: string;
  barcode?: string;
}

// Initialize Google Sheets client with service account
const getAuthClient = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    throw new Error('Google service account credentials not configured');
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const getSheets = async () => {
  const auth = getAuthClient();
  return google.sheets({ version: 'v4', auth });
};

// Verify admin PIN
const verifyPin = (event: HandlerEvent): boolean => {
  const authHeader = event.headers.authorization || '';
  const pin = authHeader.replace('Bearer ', '');
  return pin === process.env.ADMIN_PIN;
};

// Get row number by product ID
const getRowNumberById = async (sheets: any, sheetId: string, id: string): Promise<number | null> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A:A',
  });

  const values: string[][] = response.data.values || [];

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      return i + 1; // Sheets rows are 1-indexed
    }
  }

  return null;
};

// Get next available ID
const getNextId = async (sheets: any, sheetId: string): Promise<string> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A:A',
  });

  const values: string[][] = response.data.values || [];

  let maxId = 0;
  for (let i = 1; i < values.length; i++) {
    const id = parseInt(values[i][0], 10);
    if (!isNaN(id) && id > maxId) {
      maxId = id;
    }
  }

  return String(maxId + 1);
};

// Handler
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Verify PIN
  if (!verifyPin(event)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Google Sheet ID not configured' }),
    };
  }

  try {
    const sheets = await getSheets();
    const action = event.queryStringParameters?.action;
    const body = event.body ? JSON.parse(event.body) : {};

    switch (action) {
      case 'add': {
        const product = body as Omit<Product, 'id'>;
        const newId = await getNextId(sheets, sheetId);

        const rowData = [
          newId,
          product.name,
          product.brand,
          product.category,
          product.ingredients || '',
          product.imageUrl || '',
          product.barcode || '',
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: 'A:G',
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [rowData],
          },
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ id: newId, ...product }),
        };
      }

      case 'update': {
        const product = body as Product;
        const rowNumber = await getRowNumberById(sheets, sheetId, product.id);

        if (!rowNumber) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: `Product with ID ${product.id} not found` }),
          };
        }

        const rowData = [
          product.id,
          product.name,
          product.brand,
          product.category,
          product.ingredients || '',
          product.imageUrl || '',
          product.barcode || '',
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `A${rowNumber}:G${rowNumber}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [rowData],
          },
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }

      case 'delete': {
        const id = event.queryStringParameters?.id;

        if (!id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Product ID required' }),
          };
        }

        const rowNumber = await getRowNumberById(sheets, sheetId, id);

        if (!rowNumber) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: `Product with ID ${id} not found` }),
          };
        }

        await sheets.spreadsheets.values.clear({
          spreadsheetId: sheetId,
          range: `A${rowNumber}:G${rowNumber}`,
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action. Use: add, update, or delete' }),
        };
    }
  } catch (error) {
    console.error('Sheets API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
    };
  }
};

export { handler };
