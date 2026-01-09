import { useState, useEffect } from 'react';
import { BookOpen, Phone, Scale, Heart, Shield, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Resource {
  id: string;
  category: 'legal' | 'mental_health' | 'self_protection' | 'emergency_services';
  title: string;
  description: string;
  content: string;
  language: string;
  external_link: string | null;
}

export default function Resources() {
  const { language, t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, [language]);

  const loadResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('language', language)
      .eq('is_published', true)
      .order('category', { ascending: true });

    if (error) {
      console.error('Error loading resources:', error);
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  const filteredResources =
    selectedCategory === 'all'
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency_services':
        return <Phone className="h-6 w-6" />;
      case 'legal':
        return <Scale className="h-6 w-6" />;
      case 'mental_health':
        return <Heart className="h-6 w-6" />;
      case 'self_protection':
        return <Shield className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency_services':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'legal':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'mental_health':
        return 'bg-pink-100 text-pink-600 border-pink-200';
      case 'self_protection':
        return 'bg-green-100 text-green-600 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const categories = [
    { id: 'all', label: t.resources.categories.all },
    { id: 'emergency_services', label: t.resources.categories.emergency_services },
    { id: 'legal', label: t.resources.categories.legal },
    { id: 'mental_health', label: t.resources.categories.mental_health },
    { id: 'self_protection', label: t.resources.categories.self_protection },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.resources.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Access comprehensive information and support resources for your safety and well-being.
          </p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 min-w-max justify-center pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-teal-600 hover:text-teal-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No resources available in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getCategoryColor(resource.category)} border`}>
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{resource.title}</h3>
                        {resource.category === 'emergency_services' && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>

                      {expandedResource === resource.id && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {resource.content}
                          </p>
                          {resource.external_link && (
                            <a
                              href={resource.external_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-3 text-teal-600 hover:text-teal-700 font-medium"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {t.resources.externalLink}
                            </a>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() =>
                          setExpandedResource(
                            expandedResource === resource.id ? null : resource.id
                          )
                        }
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                      >
                        {expandedResource === resource.id ? 'Show Less' : t.resources.readMore} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-8 text-center shadow-lg">
          <Phone className="h-10 w-10 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">24/7 Support Available</h2>
          <p className="text-teal-50 mb-4 leading-relaxed">
            If you need immediate assistance, don't hesitate to reach out to emergency services
            or call a crisis hotline. Help is always available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:911"
              className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors shadow-md"
            >
              Call 911
            </a>
            <a
              href="tel:18007997233"
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              National Hotline: 1-800-799-7233
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
