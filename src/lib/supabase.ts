import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          phone_number: string | null;
          language_preference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          phone_number?: string | null;
          language_preference?: string;
        };
        Update: {
          display_name?: string | null;
          phone_number?: string | null;
          language_preference?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          contact_name: string;
          contact_phone: string;
          contact_email: string | null;
          relationship: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          contact_name: string;
          contact_phone: string;
          contact_email?: string | null;
          relationship: string;
          is_active?: boolean;
        };
        Update: {
          contact_name?: string;
          contact_phone?: string;
          contact_email?: string | null;
          relationship?: string;
          is_active?: boolean;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string | null;
          report_type: 'harassment' | 'assault' | 'stalking' | 'domestic_violence' | 'other';
          description: string;
          location: string | null;
          incident_date: string | null;
          is_anonymous: boolean;
          status: 'submitted' | 'under_review' | 'resolved';
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          report_type: 'harassment' | 'assault' | 'stalking' | 'domestic_violence' | 'other';
          description: string;
          location?: string | null;
          incident_date?: string | null;
          is_anonymous?: boolean;
          status?: 'submitted' | 'under_review' | 'resolved';
        };
      };
      sos_alerts: {
        Row: {
          id: string;
          user_id: string;
          location_data: any;
          alert_message: string | null;
          status: 'active' | 'resolved' | 'cancelled';
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          user_id: string;
          location_data?: any;
          alert_message?: string | null;
          status?: 'active' | 'resolved' | 'cancelled';
        };
        Update: {
          status?: 'active' | 'resolved' | 'cancelled';
          resolved_at?: string | null;
        };
      };
      resources: {
        Row: {
          id: string;
          category: 'legal' | 'mental_health' | 'self_protection' | 'emergency_services';
          title: string;
          description: string;
          content: string;
          language: string;
          external_link: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
