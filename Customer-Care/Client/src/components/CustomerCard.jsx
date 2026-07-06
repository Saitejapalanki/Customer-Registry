import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Tag } from "lucide-react";

const statusLabels = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive"
};

function CustomerCard({ customer }) {
  const city = customer.address?.city || customer.city || "No city added";

  return (
    <article className="customer-card">
      <div className="customer-card-header">
        <div>
          <h3>{customer.name}</h3>
          <p>{customer.company || "Individual customer"}</p>
        </div>
        <span className={`status-pill ${customer.status}`}>{statusLabels[customer.status]}</span>
      </div>

      <div className="customer-meta">
        <span>
          <Mail size={16} aria-hidden="true" />
          {customer.email}
        </span>
        <span>
          <Phone size={16} aria-hidden="true" />
          {customer.phone}
        </span>
        <span>
          <MapPin size={16} aria-hidden="true" />
          {city}
        </span>
        <span>
          <Tag size={16} aria-hidden="true" />
          {customer.category}
        </span>
        {customer.assignedAgent && (
          <span>Assigned to {customer.assignedAgent}</span>
        )}
      </div>

      <Link className="text-button" to={`/customers/${customer._id}`}>
        View profile
      </Link>
    </article>
  );
}

export default CustomerCard;

