/**
 * API Service
 *
 * This service provides mock implementations of API calls
 * to allow frontend development without a backend server.
 *
 * In a production environment, these would be replaced with
 * actual axios calls to your backend API.
 */

// Mock delay function to simulate network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "",
  },
  {
    id: "2",
    name: "Technician User",
    email: "tech@example.com",
    role: "technician",
    avatar: "",
  },
  {
    id: "3",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    avatar: "",
  },
];

// Mock login function
export const login = async (email: string, password: string) => {
  await delay(800); // Simulate network delay

  const user = users.find((u) => u.email === email);

  if (!user || password !== "password") {
    throw new Error("Invalid email or password");
  }

  return {
    token: `mock-jwt-token-${user.id}`,
    user,
  };
};

// Mock register function
export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  await delay(1000);

  if (users.some((u) => u.email === email)) {
    throw new Error("Email already in use");
  }

  const newUser = {
    id: `${users.length + 1}`,
    name,
    email,
    role: "user",
    avatar: "",
  };

  users.push(newUser);

  return {
    token: `mock-jwt-token-${newUser.id}`,
    user: newUser,
  };
};

// Mock get current user function
export const getCurrentUser = async () => {
  await delay(500);
  return users[0]; // Default to admin for testing
};

// Mock machines
export const machines = [
  {
    id: "1",
    name: "DLM-1001",
    serialNumber: "SN-10029485",
    model: "Denim Laser 3000",
    type: "Laser Processing",
    location: "Production Floor A",
    status: "operational",
    lastMaintenance: new Date(2023, 6, 15).toISOString(),
    nextMaintenance: new Date(2023, 9, 15).toISOString(),
    metrics: {
      availability: 92,
      performance: 85,
      quality: 98,
      oee: 76,
    },
    installationDate: new Date(2022, 1, 10).toISOString(),
    imageUrl: "",
    createdAt: new Date(2022, 1, 10).toISOString(),
    updatedAt: new Date(2023, 7, 5).toISOString(),
  },
  {
    id: "2",
    name: "DLM-2003",
    serialNumber: "SN-20038572",
    model: "Denim Washing Pro",
    type: "Denim Washing",
    location: "Production Floor B",
    status: "maintenance",
    lastMaintenance: new Date(2023, 5, 10).toISOString(),
    nextMaintenance: new Date(2023, 8, 10).toISOString(),
    metrics: {
      availability: 78,
      performance: 82,
      quality: 95,
      oee: 61,
    },
    installationDate: new Date(2021, 3, 15).toISOString(),
    imageUrl: "",
    createdAt: new Date(2021, 3, 15).toISOString(),
    updatedAt: new Date(2023, 7, 6).toISOString(),
  },
  {
    id: "3",
    name: "DLM-3005",
    serialNumber: "SN-30047859",
    model: "Denim Cutter X2",
    type: "Cutting",
    location: "Production Floor A",
    status: "operational",
    lastMaintenance: new Date(2023, 7, 1).toISOString(),
    nextMaintenance: new Date(2023, 10, 1).toISOString(),
    metrics: {
      availability: 95,
      performance: 89,
      quality: 97,
      oee: 82,
    },
    installationDate: new Date(2022, 5, 20).toISOString(),
    imageUrl: "",
    createdAt: new Date(2022, 5, 20).toISOString(),
    updatedAt: new Date(2023, 7, 7).toISOString(),
  },
];

// Mock machine API calls
export const fetchMachines = async () => {
  await delay(600);
  return machines;
};

export const fetchMachine = async (id: string) => {
  await delay(300);
  const machine = machines.find((m) => m.id === id);

  if (!machine) {
    throw new Error("Machine not found");
  }

  return machine;
};

export const createMachine = async (machineData: any) => {
  await delay(800);

  const newMachine = {
    id: `${machines.length + 1}`,
    ...machineData,
    status: "operational",
    metrics: {
      availability: 100,
      performance: 100,
      quality: 100,
      oee: 100,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  machines.push(newMachine);

  return newMachine;
};

export const updateMachine = async (id: string, machineData: any) => {
  await delay(600);

  const machineIndex = machines.findIndex((m) => m.id === id);

  if (machineIndex === -1) {
    throw new Error("Machine not found");
  }

  const updatedMachine = {
    ...machines[machineIndex],
    ...machineData,
    updatedAt: new Date().toISOString(),
  };

  machines[machineIndex] = updatedMachine;

  return updatedMachine;
};

export const deleteMachine = async (id: string) => {
  await delay(500);

  const machineIndex = machines.findIndex((m) => m.id === id);

  if (machineIndex === -1) {
    throw new Error("Machine not found");
  }

  machines.splice(machineIndex, 1);

  return { success: true };
};

// Mock alerts data
export const alerts = [
  {
    id: "1",
    title: "Temperature Exceeding Limits",
    description:
      "Machine temperature has reached 95°C, exceeding the safe limit of 85°C.",
    machineId: "1",
    machineName: "DLM-1001",
    priority: "critical",
    status: "pending",
    createdBy: {
      id: "3",
      name: "Regular User",
    },
    assignedTo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    title: "Pressure Drop Detected",
    description:
      "Machine operating pressure has dropped below 40 PSI. Normal range is 60-80 PSI.",
    machineId: "2",
    machineName: "DLM-2003",
    priority: "medium",
    status: "assigned",
    createdBy: {
      id: "3",
      name: "Regular User",
    },
    assignedTo: {
      id: "2",
      name: "Technician User",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "3",
    title: "Unexpected Vibration",
    description:
      "Unusual vibration detected in the main drive unit. Please inspect belt tension.",
    machineId: "3",
    machineName: "DLM-3005",
    priority: "low",
    status: "resolved",
    createdBy: {
      id: "3",
      name: "Regular User",
    },
    assignedTo: {
      id: "2",
      name: "Technician User",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

// Mock alert API calls
export const fetchAlerts = async () => {
  await delay(600);
  return alerts;
};

export const fetchUserAlerts = async () => {
  await delay(400);
  return alerts.filter((alert) => alert.createdBy.id === "3");
};

export const createAlert = async (alertData: any) => {
  await delay(800);

  const machine = machines.find((m) => m.id === alertData.machineId);

  if (!machine) {
    throw new Error("Machine not found");
  }

  const newAlert = {
    id: `${alerts.length + 1}`,
    ...alertData,
    machineName: machine.name,
    status: "pending",
    createdBy: {
      id: "3",
      name: "Regular User",
    },
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  alerts.push(newAlert);

  return newAlert;
};

export const updateAlert = async (id: string, alertData: any) => {
  await delay(600);

  const alertIndex = alerts.findIndex((a) => a.id === id);

  if (alertIndex === -1) {
    throw new Error("Alert not found");
  }

  const updatedAlert = {
    ...alerts[alertIndex],
    ...alertData,
    updatedAt: new Date().toISOString(),
  };

  alerts[alertIndex] = updatedAlert;

  return updatedAlert;
};

export const assignAlert = async (id: string, technicianId: string) => {
  await delay(500);

  const alertIndex = alerts.findIndex((a) => a.id === id);

  if (alertIndex === -1) {
    throw new Error("Alert not found");
  }

  const technician = users.find((u) => u.id === technicianId);

  if (!technician) {
    throw new Error("Technician not found");
  }

  const updatedAlert = {
    ...alerts[alertIndex],
    assignedTo: {
      id: technician.id,
      name: technician.name,
    },
    status: "assigned",
    updatedAt: new Date().toISOString(),
  };

  alerts[alertIndex] = updatedAlert;

  return updatedAlert;
};

// Mock maintenance data
export const maintenanceRecords = [
  {
    id: "1",
    machineId: "1",
    machineName: "DLM-1001",
    problemDescription: "Routine maintenance and calibration",
    startTime: new Date(2023, 6, 15, 9, 0).toISOString(),
    endTime: new Date(2023, 6, 15, 11, 30).toISOString(),
    status: "completed",
    technician: {
      id: "2",
      name: "Technician User",
    },
    notes:
      "Replaced air filters and lubricated moving parts. System is running optimally.",
    partsReplaced: "Air filters, lubricant",
    createdAt: new Date(2023, 6, 14).toISOString(),
    updatedAt: new Date(2023, 6, 15).toISOString(),
  },
  {
    id: "2",
    machineId: "2",
    machineName: "DLM-2003",
    problemDescription: "Pressure system failure",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    endTime: null,
    status: "in-progress",
    technician: {
      id: "2",
      name: "Technician User",
    },
    notes:
      "Investigating pressure system issues. Initial diagnosis suggests valve failure.",
    partsReplaced: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "3",
    machineId: "3",
    machineName: "DLM-3005",
    problemDescription: "Scheduled preventive maintenance",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    endTime: null,
    status: "pending",
    technician: {
      id: "2",
      name: "Technician User",
    },
    notes: "",
    partsReplaced: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

// Mock maintenance API calls
export const fetchMaintenance = async () => {
  await delay(600);
  return maintenanceRecords;
};

export const fetchUserMaintenance = async () => {
  await delay(400);
  return maintenanceRecords.filter((record) => record.technician.id === "2");
};

export const fetchMaintenanceById = async (id: string) => {
  await delay(300);
  const record = maintenanceRecords.find((r) => r.id === id);

  if (!record) {
    throw new Error("Maintenance record not found");
  }

  return record;
};

export const createMaintenance = async (maintenanceData: any) => {
  await delay(800);

  const machine = machines.find((m) => m.id === maintenanceData.machineId);

  if (!machine) {
    throw new Error("Machine not found");
  }

  const newMaintenance = {
    id: `${maintenanceRecords.length + 1}`,
    ...maintenanceData,
    machineName: machine.name,
    technician: {
      id: "2",
      name: "Technician User",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  maintenanceRecords.push(newMaintenance);

  return newMaintenance;
};

export const updateMaintenance = async (id: string, maintenanceData: any) => {
  await delay(600);

  const recordIndex = maintenanceRecords.findIndex((r) => r.id === id);

  if (recordIndex === -1) {
    throw new Error("Maintenance record not found");
  }

  const updatedRecord = {
    ...maintenanceRecords[recordIndex],
    ...maintenanceData,
    updatedAt: new Date().toISOString(),
  };

  maintenanceRecords[recordIndex] = updatedRecord;

  return updatedRecord;
};

export const completeMaintenance = async (id: string, endTime: string) => {
  await delay(500);

  const recordIndex = maintenanceRecords.findIndex((r) => r.id === id);

  if (recordIndex === -1) {
    throw new Error("Maintenance record not found");
  }

  const updatedRecord = {
    ...maintenanceRecords[recordIndex],
    endTime,
    status: "completed",
    updatedAt: new Date().toISOString(),
  };

  maintenanceRecords[recordIndex] = updatedRecord;

  return updatedRecord;
};

// Export as a mock axios-like object
export default {
  get: async (url: string) => {
    // Extract ID from URL if present
    const idMatch = url.match(/\/([^\/]+)$/);
    const id = idMatch ? idMatch[1] : null;

    // Mock API responses based on URL
    if (url.includes("/auth/me")) {
      return { data: await getCurrentUser() };
    } else if (url.includes("/machines") && id) {
      return { data: await fetchMachine(id) };
    } else if (url.includes("/machines")) {
      return { data: await fetchMachines() };
    } else if (url.includes("/alerts/user")) {
      return { data: await fetchUserAlerts() };
    } else if (url.includes("/alerts") && id) {
      // Mock endpoint for specific alert
      const alert = alerts.find((a) => a.id === id);
      return { data: alert || null };
    } else if (url.includes("/alerts")) {
      return { data: await fetchAlerts() };
    } else if (url.includes("/maintenance/technician")) {
      return { data: await fetchUserMaintenance() };
    } else if (url.includes("/maintenance") && id) {
      return { data: await fetchMaintenanceById(id) };
    } else if (url.includes("/maintenance")) {
      return { data: await fetchMaintenance() };
    }

    // Default response
    return { data: null };
  },

  post: async (url: string, data: any) => {
    if (url.includes("/auth/login")) {
      const { email, password } = data;
      return { data: await login(email, password) };
    } else if (url.includes("/auth/register")) {
      const { name, email, password } = data;
      return { data: await register(name, email, password) };
    } else if (url.includes("/machines")) {
      return { data: await createMachine(data) };
    } else if (url.includes("/alerts")) {
      return { data: await createAlert(data) };
    } else if (url.includes("/maintenance")) {
      return { data: await createMaintenance(data) };
    }

    // Default response
    return { data: null };
  },

  put: async (url: string, data: any) => {
    // Extract ID from URL
    const idMatch = url.match(/\/([^\/]+)$/);
    const id = idMatch ? idMatch[1] : null;

    if (!id) {
      throw new Error("Invalid URL: ID not found");
    }

    if (url.includes("/machines")) {
      return { data: await updateMachine(id, data) };
    } else if (url.includes("/alerts") && url.includes("/assign")) {
      return { data: await assignAlert(id, data.technicianId) };
    } else if (url.includes("/alerts")) {
      return { data: await updateAlert(id, data) };
    } else if (url.includes("/maintenance") && url.includes("/complete")) {
      return { data: await completeMaintenance(id, data.endTime) };
    } else if (url.includes("/maintenance")) {
      return { data: await updateMaintenance(id, data) };
    }

    // Default response
    return { data: null };
  },

  delete: async (url: string) => {
    // Extract ID from URL
    const idMatch = url.match(/\/([^\/]+)$/);
    const id = idMatch ? idMatch[1] : null;

    if (!id) {
      throw new Error("Invalid URL: ID not found");
    }

    if (url.includes("/machines")) {
      return { data: await deleteMachine(id) };
    }

    // Default response
    return { data: { success: false } };
  },

  // Set up default headers property
  defaults: {
    headers: {
      common: {},
    },
  },
};
