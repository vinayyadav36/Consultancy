/**
 * Centralized API client for Shree Nandi Marketing Services
 * Routes all backend calls through VITE_API_BASE
 */

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('snms_admin_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  if (!API_BASE) {
    throw new Error('API_BASE not configured');
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const get = <T>(path: string, signal?: AbortSignal) => request<T>('GET', path, undefined, signal);
const post = <T>(path: string, body: unknown) => request<T>('POST', path, body);
const put = <T>(path: string, body: unknown) => request<T>('PUT', path, body);
const del = <T>(path: string) => request<T>('DELETE', path);

// ── API methods ───────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  badge?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface VisitorStats {
  total: number;
  daily: number;
  date: string;
}

export interface AdminStats {
  visitors: VisitorStats;
  orders: number;
  revenue: number;
  products: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface AdminLoginResponse {
  token: string;
  user: { id: string; email: string; role: string; name?: string };
}

export const isApiConfigured = Boolean(API_BASE);

export const api = {
  // Health
  health: () => get<{ status: string }>('/health'),

  // Visitor
  registerVisit: (path: string) =>
    post<void>('/api/visit', { path }).catch(() => undefined),

  // Contact
  contact: (payload: ContactPayload) =>
    post<{ success: boolean; message: string }>('/api/contact', payload),

  // Products
  getProducts: (signal?: AbortSignal) => get<Product[]>('/api/products', signal),
  getProduct: (slug: string) => get<Product>(`/api/products/${slug}`),

  // Certifications
  getCertifications: (signal?: AbortSignal) =>
    get<{ id: string; slug: string; title: string; issuer: string; year: number; description: string; url?: string; icon?: string; color?: string }[]>(
      '/api/certifications',
      signal
    ),

  // Orders
  createOrder: (payload: {
    orderId: string;
    customer: { name: string; email: string; phone?: string; company?: string; gst?: string };
    cart: { id: string; name: string; price: number; qty: number }[];
    total: number;
  }) => post<{ id: string; orderId: string }>('/api/orders', payload),

  // NPS
  submitNps: (payload: { orderId: string; score: number; comment?: string }) =>
    post<{ success: boolean }>('/api/nps', payload),

  // Admin auth
  adminLogin: (email: string, password: string) =>
    post<AdminLoginResponse>('/api/admin/login', { email, password }),

  // Admin data
  adminStats: (signal?: AbortSignal) => get<AdminStats>('/api/admin/stats', signal),
  adminOrders: (signal?: AbortSignal) =>
    get<{ orders: Order[]; total: number; page: number; pages: number }>('/api/admin/orders', signal)
      .then((res) => res.orders),
  adminProducts: (signal?: AbortSignal) => get<Product[]>('/api/admin/products', signal),
  adminCreateProduct: (data: Omit<Product, 'id' | 'isActive'>) =>
    post<Product>('/api/admin/products', data),
  adminUpdateProduct: (id: string, data: Partial<Product>) =>
    put<Product>(`/api/admin/products/${id}`, data),
  adminDeleteProduct: (id: string) => del<void>(`/api/admin/products/${id}`),
};

export default api;
