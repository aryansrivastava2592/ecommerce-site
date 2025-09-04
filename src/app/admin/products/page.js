'use client'; // <-- THIS IS THE FIX

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockValue, setStockValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/categories'),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch initial admin data.');
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to refresh products.');
    }
  };

  const handleBulkPriceUpdate = async (updateType) => {
    if (!priceValue || isNaN(priceValue) || Number(priceValue) < 0) {
      toast.error('Please enter a valid, positive number.');
      return;
    }
    if (!window.confirm(`Are you sure you want to apply this price change?`)) {
      return;
    }
    const toastId = toast.loading('Updating product prices...');
    try {
      const res = await fetch('/api/admin/products/bulk-price-edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filterType: selectedCategory === 'all' ? 'all' : 'category',
          filterValue: selectedCategory,
          updateType: updateType,
          value: Number(priceValue),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update prices.');
      }
      toast.success(data.message, { id: toastId });
      fetchProducts();
      setPriceValue('');
    } catch (err) {
      toast.error(err.message || 'Something went wrong.', { id: toastId });
    }
  };

  const handleBulkUpdateStock = async (e) => {
    e.preventDefault();
    if (!stockValue || isNaN(stockValue)) {
      toast.error('Please enter a valid number for the stock.');
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to set stock for ALL products to ${stockValue}?`
      )
    ) {
      return;
    }
    const toastId = toast.loading('Updating all product stock...');
    try {
      const res = await fetch('/api/admin/products/update-stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockValue: Number(stockValue) }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update stock.');
      }
      toast.success(data.message, { id: toastId });
      fetchProducts();
      setStockValue('');
    } catch (err) {
      toast.error(err.message || 'Something went wrong.', { id: toastId });
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="card p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Bulk Stock Update</h2>
          <form
            onSubmit={handleBulkUpdateStock}
            className="flex items-center gap-2"
          >
            <input
              type="number"
              placeholder="New stock value"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              className="w-full rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
            />
            <button type="submit" className="primary-button text-sm">
              Update All Stock
            </button>
          </form>
        </div>

        <div className="card p-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Bulk Price Editor</h2>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="category-select" className="text-sm">
              Target:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
            >
              <option value="all">All Products</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              placeholder="Enter value"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              className="w-full rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBulkPriceUpdate('percentage-increase')}
              className="default-button text-xs"
            >
              Increase by %
            </button>
            <button
              onClick={() => handleBulkPriceUpdate('percentage-decrease')}
              className="default-button text-xs"
            >
              Decrease by %
            </button>
            <button
              onClick={() => handleBulkPriceUpdate('fixed-increase')}
              className="default-button text-xs"
            >
              Increase by ₹
            </button>
            <button
              onClick={() => handleBulkPriceUpdate('fixed-decrease')}
              className="default-button text-xs"
            >
              Decrease by ₹
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="px-5 text-left">NAME</th>
                <th className="px-5 text-left">PRICE</th>
                <th className="px-5 text-left">CATEGORY</th>
                <th className="px-5 text-left">STOCK</th>
                <th className="px-5 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-5">{product._id.substring(20, 24)}...</td>
                  <td className="p-5">{product.name}</td>
                  <td className="p-5">₹{product.price}</td>
                  <td className="p-5">{product.category}</td>
                  <td className="p-5">{product.countInStock}</td>
                  <td className="p-5">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="default-button text-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
