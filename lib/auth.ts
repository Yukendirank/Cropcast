const BASE_URL = "http://localhost:5000/api/Auth";

// Storage utilities
export const auth = {
  /**
   * Check if user is authenticated by verifying token exists
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  /**
   * Get the stored JWT token
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  /**
   * Store JWT token in localStorage
   */
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },

  /**
   * Remove token from localStorage (logout)
   */
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  },

  /**
   * Get authorization header for API requests
   */
  getAuthHeader: (): Record<string, string> => {
    const token = auth.getToken();
    if (!token) return {};
    return {
      'Authorization': `Bearer ${token}`,
    };
  },
};

// API calls
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

// Password reset flow
export async function forgotPassword(email: string) {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res.json();
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  return res.json();
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  return res.json();
}
