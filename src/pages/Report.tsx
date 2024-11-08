import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReportForm } from '../types';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mldebkwz'; // Replace with your FormSpree form ID

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = new URLSearchParams(location.search).get('productId');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ReportForm>({
    name: '',
    email: '',
    description: '',
    type: 'new',
    productId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          subject: form.type === 'new' 
            ? 'New Product Suggestion' 
            : 'Product Report',
        }),
      });

      if (response.ok) {
        alert('Thank you for your submission! We will review it shortly.');
        navigate('/');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      alert('Failed to submit form. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        {form.type === 'new' ? 'Suggest New Product' : 'Report Product'}
      </h1>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setForm(f => ({ ...f, type: 'new' }))}
          className={`px-4 py-2 rounded-full ${
            form.type === 'new' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Suggest New
        </button>
        <button
          onClick={() => setForm(f => ({ ...f, type: 'report' }))}
          className={`px-4 py-2 rounded-full ${
            form.type === 'report' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Report Issue
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder={form.type === 'new' 
              ? 'Please provide product details (name, brand, ingredients)...'
              : 'Please describe the issue with this product...'}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Report;