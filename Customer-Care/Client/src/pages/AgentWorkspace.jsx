import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Headphones, Search } from "lucide-react";
import { getCustomers, getUsers } from "../services/customerApi.js";

function AgentWorkspace() {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomers(), getUsers({ role: "agent" })])
      .then(([customerData, userData]) => {
        setCustomers(customerData.customers);
        setAgents(userData.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase();
    return customers.filter((customer) => {
      return [customer.name, customer.email, customer.phone, customer.company, customer.assignedAgent]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [customers, search]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Agent accounts</p>
          <h1>Support Workspace</h1>
        </div>
        <Link className="primary-button" to="/register">
          <Headphones size={18} aria-hidden="true" />
          Create agent
        </Link>
      </header>

      {error && <div className="alert error">{error}</div>}
      {isLoading && <div className="alert">Loading agent workspace...</div>}

      <div className="toolbar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <input
            placeholder="Search assigned customers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      <section className="notes-section">
        <h2>Agent Profiles</h2>
        <div className="customer-grid">
          {agents.map((agent) => (
            <article className="customer-card" key={agent._id}>
              <div className="customer-card-header">
                <div>
                  <h3>{agent.name}</h3>
                  <p>{agent.department || "Support team"}</p>
                </div>
                <span className={`status-pill ${agent.isActive ? "active" : "inactive"}`}>
                  {agent.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="customer-meta">
                <span>{agent.email}</span>
                <span>{agent.phone || "No phone added"}</span>
              </div>
            </article>
          ))}
          {!agents.length && !isLoading && <p>No agents registered yet.</p>}
        </div>
      </section>

      <section className="notes-section">
        <h2>Customer Assistance Queue</h2>
        <div className="data-list">
          {filteredCustomers.map((customer) => (
            <Link className="data-row" to={`/customers/${customer._id}`} key={customer._id}>
              <strong>{customer.name}</strong>
              <span>{customer.communicationPreference || "email"} · {customer.status}</span>
              <em>{customer.assignedAgent || "Unassigned"}</em>
            </Link>
          ))}
          {!filteredCustomers.length && !isLoading && <p>No matching customers found.</p>}
        </div>
      </section>
    </section>
  );
}

export default AgentWorkspace;
