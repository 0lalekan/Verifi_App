import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store';

const ProductCreationScreen = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [productAttributes, setProductAttributes] = useState('');

  const { userInfo } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/products', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product batch created successfully!');
      queryClient.invalidateQueries(['userProfile']);
      // Reset form
      setBatchNumber('');
      setProductName('');
      setExpiryDate('');
      setManufacturingDate('');
      setProductAttributes('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product batch');
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();

    if (!batchNumber || !productName || !expiryDate || !manufacturingDate) {
      toast.error('Please fill all required fields');
      return;
    }

    let attributes = {};
    if (productAttributes.trim()) {
      try {
        attributes = JSON.parse(productAttributes);
        if (typeof attributes !== 'object' || Array.isArray(attributes)) {
          throw new Error();
        }
      } catch (err) {
        toast.error('Invalid JSON format for product attributes');
        return;
      }
    }

    mutation.mutate({
      batchNumber,
      productName,
      expiryDate,
      manufacturingDate,
      productAttributes: attributes,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Product Batch</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Coca Cola"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number
            </label>
            <input
              id="batchNumber"
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. BATCH123"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="manufacturingDate" className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturing Date
            </label>
            <input
              id="manufacturingDate"
              type="date"
              value={manufacturingDate}
              onChange={(e) => setManufacturingDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productAttributes" className="block text-sm font-medium text-gray-700 mb-2">
              Product Attributes (JSON)
            </label>
            <textarea
              id="productAttributes"
              value={productAttributes}
              onChange={(e) => setProductAttributes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="8"
              placeholder='e.g. {"AlcoholPercentage": "5%", "Volume": "33cl", "Ingredients": "Water, Sugar"}'
            />
            <p className="text-sm text-gray-500 mt-1">Enter attributes as valid JSON object (optional)</p>
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Creating...' : 'Create Product Batch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductCreationScreen;
