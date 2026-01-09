import { useState } from 'react';
import { FileText, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export default function Report() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reportType, setReportType] = useState<string>('harassment');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(!user);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('reports').insert({
        user_id: isAnonymous ? null : user?.id,
        report_type: reportType,
        description,
        location: location || null,
        incident_date: incidentDate || null,
        is_anonymous: isAnonymous,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
      setDescription('');
      setLocation('');
      setIncidentDate('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Report Submitted Successfully
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t.report.success}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.report.title}</h1>
          <p className="text-gray-600">
            Share your experience safely. All reports are treated with confidentiality.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          {user && (
            <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal-600" />
                  <span className="font-medium text-gray-900">{t.report.anonymous}</span>
                </div>
              </label>
            </div>
          )}

          {!user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Lock className="h-5 w-5" />
                <span className="font-medium">This report will be submitted anonymously</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
                {t.report.type}
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="harassment">{t.report.types.harassment}</option>
                <option value="assault">{t.report.types.assault}</option>
                <option value="stalking">{t.report.types.stalking}</option>
                <option value="domestic_violence">{t.report.types.domestic_violence}</option>
                <option value="other">{t.report.types.other}</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t.report.description}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="Please describe what happened..."
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                {t.report.location}
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="City, state, or general area"
              />
            </div>

            <div>
              <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t.report.date}
              </label>
              <input
                id="incidentDate"
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : t.report.submit}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              Your privacy is our priority. All reports are encrypted and stored securely.
              {isAnonymous && ' This report will not be linked to any personal information.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
