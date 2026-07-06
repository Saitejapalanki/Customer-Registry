import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "../components/CustomerForm.jsx";
import { createCustomer, getCustomer, updateCustomer } from "../services/customerApi.js";

function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getCustomer(id)
      .then((data) => setCustomer(data.customer))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(formData) {
    setIsSaving(true);
    setError("");

    try {
      const data = id ? await updateCustomer(id, formData) : await createCustomer(formData);
      navigate(`/customers/${data.customer._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="page-stack narrow">
      <Link className="inline-link" to={id ? `/customers/${id}` : "/"}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </Link>

      <header className="page-header">
        <div>
          <p className="eyebrow">{id ? "Update profile" : "Create profile"}</p>
          <h1>{id ? "Edit Customer" : "New Customer"}</h1>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {isLoading ? <div className="alert">Loading customer...</div> : <CustomerForm initialCustomer={customer} isSaving={isSaving} onSubmit={handleSubmit} />}
    </section>
  );
}

export default CustomerFormPage;
