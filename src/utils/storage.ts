import { RequestStatus, ServiceRequest, StudentUser } from '../types';

const USERS_KEY = 'campusease_users_v1';
const SESSION_KEY = 'campusease_session_v1';
const REQUESTS_KEY = 'campusease_requests_v1';

export const DEMO_STUDENT: StudentUser = {
  id: 'student-demo-dgu',
  fullName: 'Aarav Rawat',
  email: 'aarav.rawat@dgu.ac.in',
  hostel: 'Boys Hostel A (DGU Campus)',
  roomNumber: 'Room 214',
  phone: '9837451209',
  password: 'password123',
  createdAt: '2026-08-14T09:00:00.000Z',
};

const SEEDED_DEMO_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-demo-1',
    referenceCode: 'CE-2041',
    userId: DEMO_STUDENT.id,
    providerId: 'prov-doon-laundry',
    providerName: 'Doon Quick Laundry',
    providerCategory: 'Laundry',
    providerWhatsapp: '9837011204',
    studentName: DEMO_STUDENT.fullName,
    hostelAndRoom: 'Boys Hostel A (DGU Campus), Room 214',
    studentPhone: DEMO_STUDENT.phone,
    serviceNotes: 'Wash & Iron (3 kg bundle) — 2 hoodies + 4 shirts, please separate whites.',
    selectedOptionLabel: 'Wash & Iron (3 kg bundle)',
    timeSlot: 'Today · 6:00 PM – 8:00 PM',
    estimatedServiceCost: 180,
    convenienceFee: 25,
    totalEstimatedCost: 205,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: 'req-demo-2',
    referenceCode: 'CE-1988',
    userId: DEMO_STUDENT.id,
    providerId: 'prov-campus-copy',
    providerName: 'Campus Copy & Print',
    providerCategory: 'Printing',
    providerWhatsapp: '9897415502',
    studentName: DEMO_STUDENT.fullName,
    hostelAndRoom: 'Boys Hostel A (DGU Campus), Room 214',
    studentPhone: DEMO_STUDENT.phone,
    serviceNotes: 'B&W Printout (30 pages + Spiral) — Financial Accounting unit notes, double-sided.',
    selectedOptionLabel: 'B&W Printout (30 pages + Spiral)',
    timeSlot: 'Tomorrow · 8:00 AM – 10:00 AM',
    estimatedServiceCost: 90,
    convenienceFee: 20,
    totalEstimatedCost: 110,
    status: 'Completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
  },
];

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function initializeStorage(): void {
  const existingUsers = safeJsonParse<StudentUser[]>(localStorage.getItem(USERS_KEY), []);
  if (!existingUsers.some((u) => u.email.toLowerCase() === DEMO_STUDENT.email.toLowerCase())) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_STUDENT, ...existingUsers]));
  }

  const existingRequests = localStorage.getItem(REQUESTS_KEY);
  if (existingRequests === null) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(SEEDED_DEMO_REQUESTS));
  }
}

export function getUsers(): StudentUser[] {
  initializeStorage();
  return safeJsonParse<StudentUser[]>(localStorage.getItem(USERS_KEY), [DEMO_STUDENT]);
}

export function registerUser(
  payload: Omit<StudentUser, 'id' | 'createdAt'>
): { ok: true; user: StudentUser } | { ok: false; error: string } {
  const users = getUsers();
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { ok: false, error: 'An account with this email already exists. Please log in instead.' };
  }

  const newUser: StudentUser = {
    ...payload,
    id: `student-${Date.now()}`,
    email: normalizedEmail,
    fullName: payload.fullName.trim(),
    hostel: payload.hostel.trim(),
    roomNumber: payload.roomNumber.trim(),
    phone: payload.phone.replace(/\D/g, '').slice(-10),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([newUser, ...users]));
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return { ok: true, user: newUser };
}

export function loginUser(
  email: string,
  password: string
): { ok: true; user: StudentUser } | { ok: false; error: string } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const match = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!match) {
    return { ok: false, error: 'No CampusEase account found for this email.' };
  }
  if (match.password !== password) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(match));
  return { ok: true, user: match };
}

export function loginDemoStudent(): StudentUser {
  initializeStorage();
  const users = getUsers();
  const demo =
    users.find((u) => u.id === DEMO_STUDENT.id) ?? DEMO_STUDENT;
  localStorage.setItem(SESSION_KEY, JSON.stringify(demo));
  return demo;
}

export function getCurrentUser(): StudentUser | null {
  initializeStorage();
  return safeJsonParse<StudentUser | null>(localStorage.getItem(SESSION_KEY), null);
}

export function updateCurrentUser(
  updates: Pick<StudentUser, 'fullName' | 'hostel' | 'roomNumber' | 'phone'>
): StudentUser | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: StudentUser = {
    ...current,
    fullName: updates.fullName.trim(),
    hostel: updates.hostel.trim(),
    roomNumber: updates.roomNumber.trim(),
    phone: updates.phone.replace(/\D/g, '').slice(-10),
  };

  const users = getUsers().map((u) => (u.id === current.id ? updated : u));
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getUserRequests(userId: string): ServiceRequest[] {
  initializeStorage();
  const all = safeJsonParse<ServiceRequest[]>(localStorage.getItem(REQUESTS_KEY), []);
  return all
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createServiceRequest(
  payload: Omit<ServiceRequest, 'id' | 'referenceCode' | 'status' | 'createdAt'>
): ServiceRequest {
  initializeStorage();
  const all = safeJsonParse<ServiceRequest[]>(localStorage.getItem(REQUESTS_KEY), []);
  const randomDigits = Math.floor(2100 + Math.random() * 7800);

  const newRequest: ServiceRequest = {
    ...payload,
    id: `req-${Date.now()}`,
    referenceCode: `CE-${randomDigits}`,
    status: 'Requested',
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(REQUESTS_KEY, JSON.stringify([newRequest, ...all]));
  return newRequest;
}

export function updateRequestStatus(requestId: string, status: RequestStatus): void {
  const all = safeJsonParse<ServiceRequest[]>(localStorage.getItem(REQUESTS_KEY), []);
  const updated = all.map((req) => (req.id === requestId ? { ...req, status } : req));
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
}

export function buildWhatsAppLink(request: ServiceRequest): string {
  const message = [
    `Hi ${request.providerName},`,
    `I placed a service request via CampusEase (Ref: ${request.referenceCode}).`,
    ``,
    `Student: ${request.studentName}`,
    `Location: ${request.hostelAndRoom}`,
    `Phone: +91 ${request.studentPhone}`,
    `Service: ${request.serviceNotes}`,
    `Preferred Slot: ${request.timeSlot}`,
    `Estimated Total: ₹${request.totalEstimatedCost} (Service ₹${request.estimatedServiceCost} + CampusEase Fee ₹${request.convenienceFee})`,
    ``,
    `Please confirm pickup/availability. Thank you!`,
  ].join('\n');

  const cleanPhone = request.providerWhatsapp.replace(/\D/g, '').slice(-10);
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
}
