import { Shield, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold">SafeSpace</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Emergency Resources</h3>
            <div className="space-y-2 text-gray-400">
              <p>National Hotline: 1-800-799-7233</p>
              <p>Emergency: 911</p>
              <p>RAINN: 1-800-656-4673</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Important Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                {t.footer.privacy}
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                {t.footer.terms}
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                {t.footer.about}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SafeSpace. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Built with care for your safety</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
