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

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: 'ecommerce_ops' | 'marketing' | 'branding' | 'ai_automation' | 'compliance';
  short_description: string;
  detailed_description: string;
  narrative_problem: string;
  narrative_transformation: string;
  narrative_deliverables: string[];
  prestige_indicator: string;
  ideal_client: string;
  starting_price_inr: number;
  delivery_timeframe: string;
  highlights: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  sector: string;
  project_type: string;
  quote: string;
  result_summary: string;
  deliverables: string[];
  metrics: {
    leads_increase_percent: number | null;
    revenue_increase_percent: number | null;
  };
  featured: boolean;
  approval_status: 'pending' | 'approved' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}
