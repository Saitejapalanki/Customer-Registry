import React from "react";
import { Search } from "lucide-react";

function EmptyState() {
  return (
    <div className="empty-state">
      <Search size={38} aria-hidden="true" />
      <h2>No customers found</h2>
      <p>Add a customer profile or adjust the current filters.</p>
    </div>
  );
}

export default EmptyState;
