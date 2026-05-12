import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Sparkles } from "lucide-react";
import "./ListingFormModal.css";

const WHATSAPP_NUMBER = "9779812345678"; // 👈 replace with your number

export function ListingFormModal({ kind, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const labels = kind === "product"
    ? { heading: "Add Product", catLabel: "Product type", catPh: "e.g. Handmade clothing" }
    : { heading: "Add Service", catLabel: "Which service do you offer?", catPh: "e.g. Plumbing, Tutoring, Catering" };

  const handleImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = [
      `*New ${kind === "product" ? "Product" : "Service"} Listing*`,
      ``,
      `*${labels.catLabel}:* ${category}`,
      `*Title:* ${title}`,
      `*Description:* ${description}`,
      price ? `*Price:* ${price}` : "",
      imagePreview ? `_(Image attached separately)_` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ y: 60, opacity: 0, rotateX: -10 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-card"
      >
        <div className="modal-head">
          <div className="modal-head-title"><Sparkles size={20} /> <h3>{labels.heading}</h3></div>
          <button onClick={onClose} className="modal-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <Field label={labels.catLabel}>
            <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder={labels.catPh} className="form-input" />
          </Field>
          <Field label="Title">
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give it a clear name" className="form-input" />
          </Field>
          <Field label="Description">
            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you offer…" className="form-input" style={{ resize: "none" }} />
          </Field>
          {kind === "product" && (
            <Field label="Price (NPR)">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="form-input" />
            </Field>
          )}
          <Field label="Image">
            <label className="image-drop">
              {imagePreview
                ? <img src={imagePreview} alt="preview" />
                : <>
                    <Upload size={24} color="#f97316" />
                    <span className="image-drop-title">Click to upload image</span>
                    <span className="image-drop-hint">PNG, JPG up to a few MB</span>
                  </>}
              <input type="file" accept="image/*" hidden onChange={handleImage} />
            </label>
          </Field>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="brand-button btn-submit">
              Submit via WhatsApp
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
