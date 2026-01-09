import { Shield, FileText, Phone, Lock, Heart, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('report')}
                className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t.hero.ctaReport}
              </button>
              <button
                onClick={() => onNavigate('sos')}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t.hero.ctaSOS}
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 border-2 border-teal-600"
              >
                {t.hero.ctaResources}
              </button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t.features.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
              <div className="bg-teal-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.features.anonymous.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.anonymous.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
              <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Phone className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.features.sos.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.sos.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.features.resources.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.resources.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.features.privacy.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.privacy.description}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 mb-16">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-10 md:p-14 text-center shadow-xl">
            <Heart className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              You Are Not Alone
            </h2>
            <p className="text-teal-50 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              We are committed to providing a safe, confidential space where you can access support,
              resources, and emergency assistance whenever you need it.
            </p>
            <button
              onClick={() => onNavigate('resources')}
              className="px-8 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-all duration-200 shadow-md"
            >
              Explore Support Resources
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
