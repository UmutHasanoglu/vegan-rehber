import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Scanner = () => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { products } = useProducts();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result: string) {
      scanner.clear();
      const product = products.find(p => p.barcode === result);
      if (product) {
        navigate(`/product/${product.id}`);
      } else {
        setError('Product not found in our database');
      }
    }

    function error(err: string) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, [navigate, products]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Scan Barcode</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div id="reader" className="w-full"></div>
    </div>
  );
};

export default Scanner;