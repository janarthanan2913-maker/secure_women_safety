import { Download, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Downloads() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-400 mb-4">Sign in to access downloads</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          {t.nav.downloads}
        </h1>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <Download className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Download songs for offline listening</p>
          <p className="text-sm text-gray-500">No downloads yet. Start downloading your favorite tracks!</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Storage Used</h3>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            </div>
            <p className="text-sm text-gray-400">0 MB / 5 GB</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Download Quality</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="quality" defaultChecked className="w-4 h-4" />
                <span>High (320 kbps)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="quality" className="w-4 h-4" />
                <span>Medium (192 kbps)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="quality" className="w-4 h-4" />
                <span>Low (128 kbps)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
