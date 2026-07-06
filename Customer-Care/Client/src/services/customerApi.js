const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong. Please try again.");
  }

  return payload;
}

export function getCustomers(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return request(`/customers${query ? `?${query}` : ""}`);
}

export function getCustomer(id) {
  return request(`/customers/${id}`);
}

export function createCustomer(customer) {
  return request("/customers", {
    method: "POST",
    body: JSON.stringify(customer)
  });
}

export function updateCustomer(id, customer) {
  return request(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(customer)
  });
}

export function deleteCustomer(id) {
  return request(`/customers/${id}`, {
    method: "DELETE"
  });
}

export function addCustomerInteraction(id, interaction) {
  return request(`/customers/${id}/interactions`, {
    method: "POST",
    body: JSON.stringify(interaction)
  });
}

export function getUsers(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return request(`/users${query ? `?${query}` : ""}`);
}

export function registerUser(user) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(user)
  });
}

export function updateUser(id, user) {
  return request(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user)
  });
}

export function deleteUser(id) {
  return request(`/users/${id}`, {
    method: "DELETE"
  });
}
