import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterBatchScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    batchNumber: '',
    productName: '',
    expiryDate: '',
    manufacturingDate: '',
    description: '',
    dosage: '',
    sideEffects: '',
    activeIngredients: '',
    manufacturedBy: '',
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/products/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product batch registered successfully!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to register product batch');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      batchNumber: formData.batchNumber,
      productName: formData.productName,
      expiryDate: formData.expiryDate,
      manufacturingDate: formData.manufacturingDate,
      medicalDetails: {
        description: formData.description,
        dosage: formData.dosage,
        sideEffects: formData.sideEffects,
        activeIngredients: formData.activeIngredients,
        manufacturedBy: formData.manufacturedBy,
      },
    };
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Register New Product Batch</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number
            </label>
            <input
              id="batchNumber"
              name="batchNumber"
              type="text"
              value={formData.batchNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g. LOT123456"
              required
            />
          </div>
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g. Aspirin 100mg"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="manufacturingDate" className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturing Date
              </label>
              <input
                id="manufacturingDate"
                name="manufacturingDate"
                type="date"
                value={formData.manufacturingDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Product description..."
            />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
              Dosage
            </label>
            <input
              id="dosage"
              name="dosage"
              type="text"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g. 100mg per tablet"
            />
          </div>
          <div>
            <label htmlFor="sideEffects" className="block text-sm font-medium text-gray-700 mb-2">
              Side Effects
            </label>
            <textarea
              id="sideEffects"
              name="sideEffects"
              value={formData.sideEffects}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Possible side effects..."
            />
          </div>
          <div>
            <label htmlFor="activeIngredients" className="block text-sm font-medium text-gray-700 mb-2">
              Active Ingredients
            </label>
            <input
              id="activeIngredients"
              name="activeIngredients"
              type="text"
              value={formData.activeIngredients}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g. Aspirin, Acetylsalicylic Acid"
            />
          </div>
          <div>
            <label htmlFor="manufacturedBy" className="block text-sm font-medium text-gray-700 mb-2">
              Manufactured By
            </label>
            <input
              id="manufacturedBy"
              name="manufacturedBy"
              type="text"
              value={formData.manufacturedBy}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Manufacturer name"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? 'Registering...' : 'Register Product Batch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterBatchScreen;
