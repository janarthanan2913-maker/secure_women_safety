import { useState, useEffect } from 'react';
import { Phone, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface EmergencyContact {
  id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  relationship: string;
  is_active: boolean;
}

interface SOSProps {
  onNavigate: (page: string) => void;
}

export default function SOS({ onNavigate }: SOSProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newContact, setNewContact] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    relationship: '',
  });

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading contacts:', error);
    } else {
      setContacts(data || []);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from('emergency_contacts').insert({
      user_id: user.id,
      ...newContact,
      contact_email: newContact.contact_email || null,
    });

    if (error) {
      console.error('Error adding contact:', error);
    } else {
      setNewContact({
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        relationship: '',
      });
      setShowAddForm(false);
      loadContacts();
    }
    setLoading(false);
  };

  const handleDeleteContact = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('emergency_contacts')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
    } else {
      loadContacts();
    }
  };

  const handleSendAlert = async () => {
    if (!user || contacts.length === 0) return;

    setLoading(true);

    try {
      let locationData = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (err) {
          console.log('Location access denied');
        }
      }

      const { error } = await supabase.from('sos_alerts').insert({
        user_id: user.id,
        location_data: locationData,
        alert_message: alertMessage || 'Emergency alert',
      });

      if (error) throw error;

      setAlertSent(true);
      setAlertMessage('');
      setTimeout(() => setAlertSent(false), 5000);
    } catch (err) {
      console.error('Error sending alert:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall911 = () => {
    window.location.href = 'tel:911';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center border border-gray-200">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to create an account to use the emergency SOS feature and manage your trusted contacts.
            </p>
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              {t.nav.signIn}
            </button>
          </div>

          <div className="mt-8 bg-red-100 border-l-4 border-red-600 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <Phone className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">In Case of Emergency</h3>
                <p className="text-red-800 mb-3">
                  If you are in immediate danger, please call emergency services right away.
                </p>
                <button
                  onClick={handleCall911}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Call 911
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.sos.title}</h1>
          <p className="text-gray-600">{t.sos.subtitle}</p>
        </div>

        <div className="bg-red-100 border-l-4 border-red-600 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Emergency Services</h3>
              <p className="text-red-800 mb-3">
                If you are in immediate danger, call emergency services first.
              </p>
              <button
                onClick={handleCall911}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                {t.sos.call911}
              </button>
            </div>
          </div>
        </div>

        {alertSent && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">{t.sos.alertSent}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alert Your Contacts</h2>
          {contacts.length > 0 ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="alertMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.sos.message}
                </label>
                <textarea
                  id="alertMessage"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="I need help..."
                />
              </div>
              <button
                onClick={handleSendAlert}
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending...' : t.sos.sendAlert}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 mb-4">{t.sos.noContacts}</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t.contacts.title}</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t.contacts.add}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddContact} className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contacts.name}
                  </label>
                  <input
                    type="text"
                    value={newContact.contact_name}
                    onChange={(e) => setNewContact({ ...newContact, contact_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contacts.phone}
                  </label>
                  <input
                    type="tel"
                    value={newContact.contact_phone}
                    onChange={(e) => setNewContact({ ...newContact, contact_phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contacts.email}
                  </label>
                  <input
                    type="email"
                    value={newContact.contact_email}
                    onChange={(e) => setNewContact({ ...newContact, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contacts.relationship}
                  </label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {t.contacts.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {contacts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No emergency contacts yet</p>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{contact.contact_name}</p>
                    <p className="text-sm text-gray-600">{contact.contact_phone}</p>
                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
