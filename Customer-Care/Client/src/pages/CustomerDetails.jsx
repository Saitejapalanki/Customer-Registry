import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Edit,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  Trash2,
  UserRound
} from "lucide-react";
import { addCustomerInteraction, deleteCustomer, getCustomer } from "../services/customerApi.js";

const interactionInitial = {
  channel: "email",
  subject: "",
  summary: "",
  handledBy: "",
  occurredAt: new Date().toISOString().slice(0, 16)
};

function formatAddress(address = {}) {
  return [address.street, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(", ");
}

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [interaction, setInteraction] = useState(interactionInitial);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCustomer(id)
      .then((data) => setCustomer(data.customer))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    const shouldDelete = window.confirm("Delete this customer profile?");
    if (!shouldDelete) return;

    try {
      await deleteCustomer(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleInteractionChange(event) {
    const { name, value } = event.target;
    setInteraction((current) => ({ ...current, [name]: value }));
  }

  async function handleInteractionSubmit(event) {
    event.preventDefault();
    setIsAddingInteraction(true);
    setError("");

    try {
      const data = await addCustomerInteraction(id, {
        ...interaction,
        occurredAt: interaction.occurredAt ? new Date(interaction.occurredAt).toISOString() : undefined
      });
      setCustomer(data.customer);
      setInteraction(interactionInitial);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingInteraction(false);
    }
  }

  if (isLoading) {
    return <div className="alert">Loading customer...</div>;
  }

  if (error && !customer) {
    return <div className="alert error">{error}</div>;
  }

  const address = formatAddress(customer.address);

  return (
    <section className="page-stack narrow">
      <Link className="inline-link" to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to dashboard
      </Link>

      <header className="profile-header">
        <div>
          <span className={`status-pill ${customer.status}`}>{customer.status}</span>
          <h1>{customer.name}</h1>
          <p>{customer.category} customer</p>
        </div>
        <div className="button-row">
          <Link className="secondary-button" to={`/customers/${id}/edit`}>
            <Edit size={18} aria-hidden="true" />
            Edit
          </Link>
          <button className="danger-button" type="button" onClick={handleDelete}>
            <Trash2 size={18} aria-hidden="true" />
            Delete
          </button>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}

      <div className="details-panel">
        <div>
          <Mail size={18} aria-hidden="true" />
          <span>{customer.email}</span>
        </div>
        <div>
          <Phone size={18} aria-hidden="true" />
          <span>{customer.phone}</span>
        </div>
        <div>
          <Building2 size={18} aria-hidden="true" />
          <span>{customer.company || "No company added"}</span>
        </div>
        <div>
          <MapPin size={18} aria-hidden="true" />
          <span>{address || "No address added"}</span>
        </div>
        <div>
          <UserRound size={18} aria-hidden="true" />
          <span>{customer.assignedAgent || "No agent assigned"}</span>
        </div>
        <div>
          <MessageSquarePlus size={18} aria-hidden="true" />
          <span>Prefers {customer.communicationPreference || "email"}</span>
        </div>
      </div>

      <section className="notes-section">
        <h2>Contact Management</h2>
        <div className="data-list">
          {customer.contacts?.length ? (
            customer.contacts.map((contact) => (
              <div className="data-row" key={contact._id || `${contact.type}-${contact.value}`}>
                <strong>{contact.label || contact.type}</strong>
                <span>{contact.value}</span>
                {contact.preferred && <em>Preferred</em>}
              </div>
            ))
          ) : (
            <p>No extra contact methods added.</p>
          )}
        </div>
      </section>

      <section className="notes-section">
        <h2>Custom Fields</h2>
        <div className="data-list">
          {customer.customFields?.length ? (
            customer.customFields.map((field) => (
              <div className="data-row" key={field._id || field.label}>
                <strong>{field.label}</strong>
                <span>{field.value || "Not set"}</span>
              </div>
            ))
          ) : (
            <p>No custom fields added.</p>
          )}
        </div>
      </section>

      <section className="notes-section">
        <h2>Notes</h2>
        <p>{customer.notes || "No notes added yet."}</p>
      </section>

      <section className="notes-section">
        <h2>Communication History</h2>
        <form className="compact-form" onSubmit={handleInteractionSubmit}>
          <select name="channel" value={interaction.channel} onChange={handleInteractionChange}>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="meeting">Meeting</option>
            <option value="support ticket">Support ticket</option>
            <option value="notification">Notification</option>
            <option value="chat">Chat</option>
            <option value="other">Other</option>
          </select>
          <input name="subject" value={interaction.subject} onChange={handleInteractionChange} placeholder="Subject" required />
          <input name="handledBy" value={interaction.handledBy} onChange={handleInteractionChange} placeholder="Handled by" />
          <input name="occurredAt" type="datetime-local" value={interaction.occurredAt} onChange={handleInteractionChange} />
          <textarea name="summary" value={interaction.summary} onChange={handleInteractionChange} placeholder="Interaction summary" required />
          <button className="primary-button" type="submit" disabled={isAddingInteraction}>
            <MessageSquarePlus size={18} aria-hidden="true" />
            {isAddingInteraction ? "Adding..." : "Add history"}
          </button>
        </form>

        <div className="timeline">
          {customer.interactions?.length ? (
            customer.interactions.map((item) => (
              <article className="timeline-item" key={item._id || `${item.subject}-${item.occurredAt}`}>
                <span>{item.channel}</span>
                <h3>{item.subject}</h3>
                <p>{item.summary}</p>
                <small>
                  {item.handledBy || "Unassigned"} · {new Date(item.occurredAt).toLocaleString()}
                </small>
              </article>
            ))
          ) : (
            <p>No communication history yet.</p>
          )}
        </div>
      </section>
    </section>
  );
}

export default CustomerDetails;
