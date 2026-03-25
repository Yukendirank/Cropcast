const BASE_URL = "http://localhost:5000/api/Auth";

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
}) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function login(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  location: string;
}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}