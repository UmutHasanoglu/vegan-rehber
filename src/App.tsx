import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Scanner from './pages/Scanner';
import Report from './pages/Report';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <ProductProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-green-50">
          <div className="max-w-lg mx-auto pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/report" element={<Report />} />
            </Routes>
            <Navigation />
          </div>
        </div>
      </BrowserRouter>
    </ProductProvider>
  );
}

export default App;