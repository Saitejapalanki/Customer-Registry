import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Headphones, LayoutDashboard, ShieldCheck, UserPlus, UsersRound } from "lucide-react";

function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Headphones size={24} aria-hidden="true" />
          </div>
          <div>
            <strong>Customer Care</strong>
            <span>Profile Registry</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <NavLink to="/" end>
            <LayoutDashboard size={18} aria-hidden="true" />
            Dashboard
          </NavLink>
          <NavLink to="/customers/new">
            <UserPlus size={18} aria-hidden="true" />
            New Customer
          </NavLink>
          <NavLink to="/register">
            <UserPlus size={18} aria-hidden="true" />
            Register
          </NavLink>
          <NavLink to="/agents">
            <UsersRound size={18} aria-hidden="true" />
            Agents
          </NavLink>
          <NavLink to="/admin">
            <ShieldCheck size={18} aria-hidden="true" />
            Admin
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
