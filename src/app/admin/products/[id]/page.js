"use client";

import { useRouter, useParams } from "next/navigation"; // 1. IMPORT useParams
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams(); // 2. GET PARAMS FROM THE HOOK
  const { id } = params; // 3. The 'id' is now correctly accessed

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="card p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            className="w-full"
            value={product.slug}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            name="price"
            type="number"
            className="w-full"
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            type="text"
            className="w-full"
            value={product.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            className="w-full"
            value={product.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            name="brand"
            type="text"
            className="w-full"
            value={product.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="countInStock">Count In Stock</label>
          <input
            id="countInStock"
            name="countInStock"
            type="number"
            className="w-full"
            value={product.countInStock}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="primary-button">
          Update Product
        </button>
      </form>
    </div>
  );
}
