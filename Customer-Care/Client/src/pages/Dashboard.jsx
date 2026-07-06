import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import CustomerCard from "../components/CustomerCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getCustomers } from "../services/customerApi.js";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      getCustomers({ search, status })
        .then((data) => {
          setCustomers(data.customers);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [search, status]);

  const totals = useMemo(() => {
    return customers.reduce(
      (summary, customer) => {
        summary.total += 1;
        summary[customer.status] += 1;
        return summary;
      },
      { total: 0, active: 0, pending: 0, inactive: 0 }
    );
  }, [customers]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Customer profiles</p>
          <h1>Customer Care Dashboard</h1>
        </div>
        <Link className="primary-button" to="/customers/new">
          <Plus size={18} aria-hidden="true" />
          Add customer
        </Link>
      </header>

      <div className="stats-grid">
        <div className="stat-box">
          <span>Total</span>
          <strong>{totals.total}</strong>
        </div>
        <div className="stat-box">
          <span>Active</span>
          <strong>{totals.active}</strong>
        </div>
        <div className="stat-box">
          <span>Pending</span>
          <strong>{totals.pending}</strong>
        </div>
        <div className="stat-box">
          <span>Inactive</span>
          <strong>{totals.inactive}</strong>
        </div>
      </div>

      <div className="toolbar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <input
            placeholder="Search by name, email, phone, or company"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <div className="alert error">{error}</div>}
      {isLoading && <div className="alert">Loading customers...</div>}

      {!isLoading && customers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="customer-grid">
          {customers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
