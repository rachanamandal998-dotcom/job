import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import "./ListingFormModal.css";

export function ListingFormModal({ kind, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name ||!form.price) return;
    onSubmit({
     ...form,
      price: parseFloat(form.price).toFixed(2),
      stock: parseInt(form.stock) || 0,
      image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    });
  };

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add New {kind}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Handmade Bag"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="29.99"
                required
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="12"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} /> Add Product
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}