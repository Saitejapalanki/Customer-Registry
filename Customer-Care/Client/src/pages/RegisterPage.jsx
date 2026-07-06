import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { registerUser } from "../services/customerApi.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "customer",
  phone: "",
  department: ""
};

function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await registerUser(form);
      setMessage(`${data.user.name} registered as ${data.user.role}.`);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="page-stack narrow">
      <header className="page-header">
        <div>
          <p className="eyebrow">User registration</p>
          <h1>Create Account</h1>
        </div>
      </header>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength="6" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Department
          <input name="department" value={form.department} onChange={handleChange} />
        </label>

        <div className="form-actions full-width">
          <button className="primary-button" type="submit" disabled={isSaving}>
            <UserPlus size={18} aria-hidden="true" />
            {isSaving ? "Creating..." : "Create account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegisterPage;
