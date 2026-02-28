import { Link } from 'react-router-dom';
import { Microscope, GraduationCap, ArrowRight } from 'lucide-react';

const features = [
  {
    path: '/analyze',
    icon: Microscope,
    title: 'Analyze',
    description: 'Get AI diagnosis with visual and written explanations of model decisions.',
    cta: 'Start Analyzing',
  },
  {
    path: '/learn',
    icon: GraduationCap,
    title: 'Learn',
    description: 'Practice diagnosing images and learn with instant feedback.',
    cta: 'Start Learning',
  },
];

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            MedLens
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-3">
            Medical AI you can see and understand.
          </p>

          <p className="text-sm text-gray-500">
            Supporting Brain MRI, Chest X-Ray, Retinal OCT & Bone X-Ray
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {features.map(({ path, icon: Icon, title, description, cta }) => (
              <Link
                key={path}
                to={path}
                className="group bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 h-full"
              >
                <div className="flex items-start gap-4 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors shrink-0">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 flex flex-col h-full">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed flex-1">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-medium group-hover:gap-3 transition-all mt-4">
                      {cta}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '99%', label: 'Top Accuracy' },
              { value: '100K+', label: 'Training Images' },
              { value: '4', label: 'Diagnostic Models' },
              { value: '<2s', label: 'Inference Time' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}