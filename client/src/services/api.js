const API_URL = "http://localhost:5000";

// -------------------------
// Register
// -------------------------
export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role: "volunteer"
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

// -------------------------
// Login
// -------------------------
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// -------------------------
// Get volunteers
// -------------------------
export const getVolunteers = async (token) => {
  const response = await fetch(`${API_URL}/volunteers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch volunteers");
  }

  return data;
};

// -------------------------
// Add volunteer
// -------------------------
export const addVolunteer = async (volunteer, token) => {
  const response = await fetch(`${API_URL}/volunteers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(volunteer)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add volunteer");
  }

  return data;
};

// -------------------------
// Get activities
// -------------------------
export const getActivities = async (token) => {
  const response = await fetch(`${API_URL}/activities`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch activities");
  }

  return data;
};

// -------------------------
// Add activity
// -------------------------
export const addActivity = async (activity, token) => {
  const response = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(activity)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add activity");
  }

  return data;
};

// -------------------------
// Get assignments
// -------------------------
export const getAssignments = async (token) => {
  const response = await fetch(`${API_URL}/assignments`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch assignments");
  }

  return data;
};

// -------------------------
// Create assignment
// -------------------------
export const createAssignment = async (assignment, token) => {
  const response = await fetch(`${API_URL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(assignment)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create assignment");
  }

  return data;
};