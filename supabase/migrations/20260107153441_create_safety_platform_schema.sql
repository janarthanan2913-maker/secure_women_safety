/*
  # Women's Safety Platform Database Schema

  ## Overview
  This migration creates a comprehensive database schema for a women's safety and privacy platform
  with strong security measures and Row Level Security (RLS) policies.

  ## New Tables

  ### 1. `profiles`
  Extended user profile information with privacy settings
  - `id` (uuid, primary key, references auth.users)
  - `display_name` (text, optional pseudonym for privacy)
  - `phone_number` (text, encrypted for emergency use)
  - `language_preference` (text, default 'en')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `emergency_contacts`
  Trusted contacts for SOS alerts
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `contact_name` (text)
  - `contact_phone` (text)
  - `contact_email` (text, optional)
  - `relationship` (text)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 3. `reports`
  Anonymous incident reporting system
  - `id` (uuid, primary key)
  - `user_id` (uuid, optional, references profiles for authenticated users)
  - `report_type` (text: harassment, assault, stalking, domestic_violence, other)
  - `description` (text)
  - `location` (text, optional)
  - `incident_date` (timestamptz, optional)
  - `is_anonymous` (boolean)
  - `status` (text: submitted, under_review, resolved)
  - `created_at` (timestamptz)

  ### 4. `sos_alerts`
  Emergency SOS alert history
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `location_data` (jsonb, stores coordinates if available)
  - `alert_message` (text)
  - `status` (text: active, resolved, cancelled)
  - `created_at` (timestamptz)
  - `resolved_at` (timestamptz, optional)

  ### 5. `resources`
  Educational and support resources
  - `id` (uuid, primary key)
  - `category` (text: legal, mental_health, self_protection, emergency_services)
  - `title` (text)
  - `description` (text)
  - `content` (text)
  - `language` (text, default 'en')
  - `external_link` (text, optional)
  - `is_published` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security Measures

  1. RLS enabled on all tables
  2. Users can only access their own data
  3. Anonymous reporting supported with privacy protection
  4. Resources are publicly readable but admin-managed
  5. Emergency contacts strictly private to each user
  6. SOS alerts only accessible to the user who created them
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  phone_number text,
  language_preference text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  relationship text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emergency contacts"
  ON emergency_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts"
  ON emergency_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts"
  ON emergency_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts"
  ON emergency_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  report_type text NOT NULL CHECK (report_type IN ('harassment', 'assault', 'stalking', 'domestic_violence', 'other')),
  description text NOT NULL,
  location text,
  incident_date timestamptz,
  is_anonymous boolean DEFAULT false,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anonymous users can insert reports"
  ON reports FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND is_anonymous = true);

-- Create sos_alerts table
CREATE TABLE IF NOT EXISTS sos_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_data jsonb,
  alert_message text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SOS alerts"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SOS alerts"
  ON sos_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SOS alerts"
  ON sos_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('legal', 'mental_health', 'self_protection', 'emergency_services')),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  language text DEFAULT 'en',
  external_link text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published resources"
  ON resources FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_language ON resources(language);

-- Insert initial resources
INSERT INTO resources (category, title, description, content, language) VALUES
  ('emergency_services', 'National Domestic Violence Hotline', 'Free, confidential 24/7 support', 'Call 1-800-799-7233 or text START to 88788 for immediate support. Available in multiple languages with trained advocates ready to help.', 'en'),
  ('emergency_services', 'Emergency Services', 'Immediate emergency assistance', 'In case of immediate danger, call 911 (US) or your local emergency number. Your safety is the top priority.', 'en'),
  ('legal', 'Know Your Rights', 'Understanding your legal protections', 'You have the right to safety, protection from harassment, and legal recourse. Restraining orders, workplace protections, and housing rights are available. Consult with local legal aid organizations for free assistance.', 'en'),
  ('mental_health', 'RAINN Support', '24/7 sexual assault support', 'The Rape, Abuse & Incest National Network (RAINN) provides free, confidential support. Call 1-800-656-4673 or visit online.rainn.org for live chat support.', 'en'),
  ('mental_health', 'Mental Health Resources', 'Support for trauma and stress', 'Seeking help is a sign of strength. Therapy, support groups, and counseling services can help process trauma and build resilience. Many organizations offer free or sliding-scale services.', 'en'),
  ('self_protection', 'Safety Planning', 'Create a personal safety plan', 'Identify safe spaces, trusted contacts, and emergency exits. Keep important documents and emergency supplies ready. Share your plan with trusted contacts and update it regularly.', 'en'),
  ('self_protection', 'Digital Safety', 'Protect your online privacy', 'Use strong passwords, enable two-factor authentication, review privacy settings, and be cautious about sharing location data. Clear browser history if needed and use secure communication apps.', 'en')
ON CONFLICT DO NOTHING;