const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

function buildUrl(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('snma_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method,
    headers: getHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({ error: 'Request failed' }))) as { error?: string };
    throw new ApiError(errorBody.error || `Request failed (${res.status})`, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: 'ecommerce_ops' | 'marketing' | 'branding' | 'ai_automation' | 'compliance';
  short_description: string;
  detailed_description: string;
  ideal_client: string;
  starting_price_inr: number;
  delivery_timeframe: string;
  highlights: string[];
  is_featured: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  project_type: string;
  quote: string;
  result_summary: string;
  metrics: {
    leads_increase_percent: number | null;
    revenue_increase_percent: number | null;
  };
  featured: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_stage: 'idea' | 'early' | 'growing' | 'established';
  services_interested: string[];
  goals: string[];
  monthly_budget_inr: number | null;
  source_channel: 'website' | 'whatsapp' | 'referral' | 'other';
  preferred_contact_time: string;
  message: string;
  status: 'new' | 'in_progress' | 'closed';
  priority_score: number;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_stage: 'idea' | 'early' | 'growing' | 'established';
  services_interested: string[];
  goals: string[];
  monthly_budget_inr: number | null;
  source_channel: 'website' | 'whatsapp' | 'referral' | 'other';
  preferred_contact_time: string;
  message: string;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface StrategyRecommendationResponse {
  plan_tier: 'launch_mode' | 'growth_mode' | 'scale_mode';
  readiness_score: number;
  recommended_services: Service[];
}

export interface AdminInsights {
  total: number;
  by_status: {
    new: number;
    in_progress: number;
    closed: number;
  };
  by_stage: {
    idea: number;
    early: number;
    growing: number;
    established: number;
  };
  average_priority: number;
  top_services: Array<{ service: string; count: number }>;
}

export const api = {
  health: () => request<{ status: string }>('GET', '/health'),
  getServices: () => request<Service[]>('GET', '/api/services'),
  getTestimonials: () => request<Testimonial[]>('GET', '/api/testimonials'),
  createInquiry: (payload: InquiryPayload) => request<{ success: boolean; inquiry: Inquiry }>('POST', '/api/inquiries', payload),
  adminLogin: (username: string, password: string) =>
    request<AdminLoginResponse>('POST', '/api/admin/login', { username, password }),
  adminInquiries: () => request<Inquiry[]>('GET', '/api/inquiries'),
  adminUpdateInquiry: (id: string, data: Partial<Pick<Inquiry, 'status' | 'admin_notes'>>) =>
    request<{ success: boolean; inquiry: Inquiry }>('PATCH', `/api/inquiries/${id}`, data),
  strategyRecommend: (payload: Pick<InquiryPayload, 'business_stage' | 'goals' | 'monthly_budget_inr' | 'services_interested'>) =>
    request<StrategyRecommendationResponse>('POST', '/api/strategy/recommend', payload),
  adminInsights: () => request<AdminInsights>('GET', '/api/admin/insights'),
  adminExport: () => request<Record<string, unknown>>('GET', '/api/admin/export'),
};
