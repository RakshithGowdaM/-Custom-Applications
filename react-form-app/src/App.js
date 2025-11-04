import React, { useState } from "react";
import "./App.css";

/* Simple modal component */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2>{title}</h2>
        <div>{children}</div>
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button className="btn primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    rating: "5",
    comments: "",
    subscribe: false,
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // Controlled input handler
  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      // store file name (or file object) if you want to upload later
      setForm(prev => ({ ...prev, [name]: files[0] || null }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  // Basic validation
  function validate() {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Valid email required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) err.phone = "Phone must be 10 digits";
    if (!form.product) err.product = "Please select a product";
    if (form.comments && form.comments.length < 10) err.comments = "Comments must be at least 10 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  // Submit handler — no navigation, just open modal and optionally send to server
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Example: save to localStorage (optional)
    const prev = JSON.parse(localStorage.getItem("submissions") || "[]");
    prev.push({ ...form, date: new Date().toISOString() });
    localStorage.setItem("submissions", JSON.stringify(prev));

    // Example: send to server (optional)
    // try {
    //   const fd = new FormData();
    //   Object.keys(form).forEach(key => fd.append(key, form[key]));
    //   await fetch("/api/submit-feedback", { method: "POST", body: fd });
    // } catch (err) {
    //   console.error("submit error", err);
    // }

    // Show success modal (same page, no navigation)
    setModalOpen(true);
  }

  function resetForm() {
    setForm({
      name: "",
      email: "",
      phone: "",
      product: "",
      rating: "5",
      comments: "",
      subscribe: false,
    });
    setErrors({});
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Furniture Feedback</h1>
        <p>Tell us about your purchase — submission stays on this page.</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label>
            Full name
            <input name="name" value={form.name} onChange={handleChange} type="text" />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label>
            Email
            <input name="email" value={form.email} onChange={handleChange} type="email" />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            Phone (10 digits)
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </label>

          <label>
            Product Purchased
            <select name="product" value={form.product} onChange={handleChange}>
              <option value="">-- choose product --</option>
              <option value="sofa">Sofa</option>
              <option value="dining-table">Dining Table</option>
              <option value="bed">Bed</option>
              <option value="desk">Office Desk</option>
            </select>
            {errors.product && <small className="error">{errors.product}</small>}
          </label>

          <label>
            Rating
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Very Good</option>
              <option value="3">3 — Good</option>
              <option value="2">2 — Fair</option>
              <option value="1">1 — Poor</option>
            </select>
          </label>

          <label>
            Comments
            <textarea name="comments" value={form.comments} onChange={handleChange} rows="4" />
            {errors.comments && <small className="error">{errors.comments}</small>}
          </label>

          <label className="checkbox">
            <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={handleChange} />
            Subscribe to our newsletter
          </label>

          {/* Optional file input for e.g., photo of damaged product */}
          <label>
            Upload photo (optional)
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </label>

          <div className="actions">
            <button type="submit" className="btn primary">Submit</button>
            <button type="button" className="btn" onClick={resetForm}>Reset</button>
          </div>
        </form>

        <aside className="aside">
          <h3>Why feedback matters</h3>
          <p>We use your feedback to improve quality and service. Submission will show a popup on success.</p>
        </aside>
      </main>

      <Modal open={modalOpen} onClose={closeModal} title="Submission Successful">
        <p>Thank you, <strong>{form.name || "Customer"}</strong>! Your feedback was received.</p>
        <p>We will review it and contact you if needed.</p>
      </Modal>
    </div>
  );
}

export default App;
