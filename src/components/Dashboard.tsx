import { useState, useEffect } from 'react';
import { User, FileText, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Profile {
  display_name: string | null;
  phone_number: string | null;
  language_preference: string;
}

interface Report {
  id: string;
  report_type: string;
  description: string;
  status: string;
  created_at: string;
}

interface EmergencyContact {
  id: string;
  contact_name: string;
  contact_phone: string;
  relationship: string;
}

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    phone_number: '',
    language_preference: language,
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    const [profileResult, reportsResult, contactsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('emergency_contacts').select('*').eq('user_id', user.id).eq('is_active', true),
    ]);

    if (profileResult.data) {
      setProfile({
        display_name: profileResult.data.display_name || '',
        phone_number: profileResult.data.phone_number || '',
        language_preference: profileResult.data.language_preference || 'en',
      });
    }

    if (reportsResult.data) {
      setReports(reportsResult.data);
    }

    if (contactsResult.data) {
      setContacts(contactsResult.data);
    }

    setLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: profile.display_name || null,
        phone_number: profile.phone_number || null,
        language_preference: profile.language_preference,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      setLanguage(profile.language_preference as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    onNavigate('auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.title}</h1>
          <p className="text-gray-600">
            {t.dashboard.welcome}, {profile.display_name || user.email}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Total Reports</h3>
            </div>
            <p className="text-3xl font-bold text-teal-600">{reports.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-6 w-6 text-red-600" />
              <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">{contacts.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Account Status</h3>
            </div>
            <p className="text-sm font-medium text-green-600">Active</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-teal-600" />
              {t.dashboard.profile}
            </h2>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">Profile saved successfully!</p>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (verified)
                </label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.dashboard.displayName}
                </label>
                <input
                  type="text"
                  value={profile.display_name || ''}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your name or pseudonym"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.dashboard.phone}
                </label>
                <input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.dashboard.language}
                </label>
                <select
                  value={profile.language_preference}
                  onChange={(e) => setProfile({ ...profile, language_preference: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : t.dashboard.saveProfile}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-teal-600" />
                {t.dashboard.myReports}
              </h2>

              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No reports yet</p>
                  <button
                    onClick={() => onNavigate('report')}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Submit a Report
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {report.report_type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="h-6 w-6 text-red-600" />
                {t.dashboard.myContacts}
              </h2>

              {contacts.length === 0 ? (
                <div className="text-center py-8">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No emergency contacts</p>
                  <button
                    onClick={() => onNavigate('sos')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Add Contacts
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="font-medium text-gray-900">{contact.contact_name}</p>
                      <p className="text-sm text-gray-600">{contact.contact_phone}</p>
                      <p className="text-xs text-gray-500">{contact.relationship}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => onNavigate('sos')}
                    className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Manage Contacts →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
