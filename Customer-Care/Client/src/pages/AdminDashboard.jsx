import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Trash2, UserPlus, UsersRound } from "lucide-react";
import { deleteUser, getCustomers, getUsers, updateUser } from "../services/customerApi.js";

function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomers(), getUsers()])
      .then(([customerData, userData]) => {
        setCustomers(customerData.customers);
        setUsers(userData.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const summary = useMemo(() => {
    return {
      customers: customers.length,
      activeCustomers: customers.filter((customer) => customer.status === "active").length,
      users: users.length,
      agents: users.filter((user) => user.role === "agent").length,
      admins: users.filter((user) => user.role === "admin").length
    };
  }, [customers, users]);

  async function toggleUser(user) {
    try {
      const data = await updateUser(user._id, { isActive: !user.isActive });
      setUsers((current) => current.map((item) => (item._id === user._id ? data.user : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeUser(userId) {
    const shouldDelete = window.confirm("Delete this user account?");
    if (!shouldDelete) return;

    try {
      await deleteUser(userId);
      setUsers((current) => current.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Manage System Data</h1>
        </div>
        <Link className="primary-button" to="/register">
          <UserPlus size={18} aria-hidden="true" />
          Add user
        </Link>
      </header>

      {error && <div className="alert error">{error}</div>}
      {isLoading && <div className="alert">Loading admin data...</div>}

      <div className="stats-grid">
        <div className="stat-box">
          <span>Customers</span>
          <strong>{summary.customers}</strong>
        </div>
        <div className="stat-box">
          <span>Active customers</span>
          <strong>{summary.activeCustomers}</strong>
        </div>
        <div className="stat-box">
          <span>Users</span>
          <strong>{summary.users}</strong>
        </div>
        <div className="stat-box">
          <span>Agents</span>
          <strong>{summary.agents}</strong>
        </div>
      </div>

      <section className="notes-section">
        <h2>User Accounts</h2>
        <div className="table-list">
          {users.map((user) => (
            <div className="table-row" key={user._id}>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <span className="status-pill inactive">{user.role}</span>
              <button className="secondary-button" type="button" onClick={() => toggleUser(user)}>
                <Settings size={16} aria-hidden="true" />
                {user.isActive ? "Disable" : "Enable"}
              </button>
              <button className="danger-button" type="button" onClick={() => removeUser(user._id)}>
                <Trash2 size={16} aria-hidden="true" />
                Delete
              </button>
            </div>
          ))}
          {!users.length && !isLoading && <p>No user accounts yet.</p>}
        </div>
      </section>

      <section className="notes-section">
        <h2>System Settings</h2>
        <div className="settings-grid">
          <label className="check-label">
            <input type="checkbox" defaultChecked />
            Email notifications
          </label>
          <label className="check-label">
            <input type="checkbox" defaultChecked />
            Agent access to customer profiles
          </label>
          <label className="check-label">
            <input type="checkbox" />
            Require review for inactive customers
          </label>
        </div>
      </section>

      <section className="notes-section">
        <h2>Customer Data Overview</h2>
        <div className="data-list">
          {customers.slice(0, 8).map((customer) => (
            <Link className="data-row" to={`/customers/${customer._id}`} key={customer._id}>
              <strong>{customer.name}</strong>
              <span>{customer.email}</span>
              <em>{customer.assignedAgent || "Unassigned"}</em>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AdminDashboard;
