import React, { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

const blankContact = { type: "phone", label: "Primary", value: "", preferred: false };
const blankCustomField = { label: "", value: "" };

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  category: "General",
  status: "active",
  assignedAgent: "",
  communicationPreference: "email",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  },
  contacts: [{ ...blankContact }],
  customFields: [{ ...blankCustomField }],
  notes: ""
};

function normalizeCustomer(customer) {
  if (!customer) return initialForm;

  return {
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    company: customer.company || "",
    city: customer.city || customer.address?.city || "",
    category: customer.category || "General",
    status: customer.status || "active",
    assignedAgent: customer.assignedAgent || "",
    communicationPreference: customer.communicationPreference || "email",
    address: {
      street: customer.address?.street || "",
      city: customer.address?.city || customer.city || "",
      state: customer.address?.state || "",
      postalCode: customer.address?.postalCode || "",
      country: customer.address?.country || ""
    },
    contacts: customer.contacts?.length ? customer.contacts : [{ ...blankContact }],
    customFields: customer.customFields?.length ? customer.customFields : [{ ...blankCustomField }],
    notes: customer.notes || ""
  };
}

function CustomerForm({ initialCustomer, isSaving, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(normalizeCustomer(initialCustomer));
  }, [initialCustomer]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleAddressChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      address: { ...current.address, [name]: value },
      city: name === "city" ? value : current.city
    }));
  }

  function updateListItem(listName, index, field, value) {
    setForm((current) => ({
      ...current,
      [listName]: current[listName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  }

  function addListItem(listName, value) {
    setForm((current) => ({ ...current, [listName]: [...current[listName], value] }));
  }

  function removeListItem(listName, index, fallback) {
    setForm((current) => {
      const nextList = current[listName].filter((_, itemIndex) => itemIndex !== index);
      return { ...current, [listName]: nextList.length ? nextList : [fallback] };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      contacts: form.contacts.filter((contact) => contact.value.trim()),
      customFields: form.customFields.filter((field) => field.label.trim() || field.value.trim())
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Customer name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Primary email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Primary phone
        <input name="phone" value={form.phone} onChange={handleChange} required />
      </label>

      <label>
        Company
        <input name="company" value={form.company} onChange={handleChange} />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          <option>General</option>
          <option>Premium</option>
          <option>Enterprise</option>
          <option>Support</option>
        </select>
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      <label>
        Assigned agent
        <input name="assignedAgent" value={form.assignedAgent} onChange={handleChange} placeholder="Agent name" />
      </label>

      <label>
        Communication preference
        <select name="communicationPreference" value={form.communicationPreference} onChange={handleChange}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="sms">SMS</option>
          <option value="notification">Notification</option>
          <option value="none">None</option>
        </select>
      </label>

      <fieldset className="form-section full-width">
        <legend>Address</legend>
        <div className="section-grid">
          <label>
            Street
            <input name="street" value={form.address.street} onChange={handleAddressChange} />
          </label>
          <label>
            City
            <input name="city" value={form.address.city} onChange={handleAddressChange} />
          </label>
          <label>
            State
            <input name="state" value={form.address.state} onChange={handleAddressChange} />
          </label>
          <label>
            Postal code
            <input name="postalCode" value={form.address.postalCode} onChange={handleAddressChange} />
          </label>
          <label>
            Country
            <input name="country" value={form.address.country} onChange={handleAddressChange} />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section full-width">
        <div className="section-title-row">
          <legend>Contact Methods</legend>
          <button type="button" className="icon-text-button" onClick={() => addListItem("contacts", { ...blankContact })}>
            <Plus size={16} aria-hidden="true" />
            Add contact
          </button>
        </div>

        <div className="repeat-list">
          {form.contacts.map((contact, index) => (
            <div className="repeat-row" key={`contact-${index}`}>
              <select value={contact.type} onChange={(event) => updateListItem("contacts", index, "type", event.target.value)}>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="social">Social</option>
                <option value="website">Website</option>
                <option value="other">Other</option>
              </select>
              <input
                value={contact.label}
                onChange={(event) => updateListItem("contacts", index, "label", event.target.value)}
                placeholder="Label"
              />
              <input
                value={contact.value}
                onChange={(event) => updateListItem("contacts", index, "value", event.target.value)}
                placeholder="Contact detail"
              />
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={Boolean(contact.preferred)}
                  onChange={(event) => updateListItem("contacts", index, "preferred", event.target.checked)}
                />
                Preferred
              </label>
              <button type="button" className="icon-button danger-icon" onClick={() => removeListItem("contacts", index, blankContact)}>
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-section full-width">
        <div className="section-title-row">
          <legend>Custom Fields</legend>
          <button type="button" className="icon-text-button" onClick={() => addListItem("customFields", { ...blankCustomField })}>
            <Plus size={16} aria-hidden="true" />
            Add field
          </button>
        </div>

        <div className="repeat-list">
          {form.customFields.map((field, index) => (
            <div className="repeat-row two-inputs" key={`field-${index}`}>
              <input
                value={field.label}
                onChange={(event) => updateListItem("customFields", index, "label", event.target.value)}
                placeholder="Field name"
              />
              <input
                value={field.value}
                onChange={(event) => updateListItem("customFields", index, "value", event.target.value)}
                placeholder="Value"
              />
              <button type="button" className="icon-button danger-icon" onClick={() => removeListItem("customFields", index, blankCustomField)}>
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      <label className="full-width">
        Notes
        <textarea name="notes" rows="5" value={form.notes} onChange={handleChange} />
      </label>

      <div className="form-actions full-width">
        <button className="primary-button" type="submit" disabled={isSaving}>
          <Save size={18} aria-hidden="true" />
          {isSaving ? "Saving..." : "Save customer"}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
