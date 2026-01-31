import { Brain, Stethoscope, Eye, Bone, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center gap-3 mb-6">
          <div className="flex items-center justify-center w-11 h-11 bg-primary-100 rounded-xl">
            <Brain className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-center w-11 h-11 bg-primary-100 rounded-xl">
            <Stethoscope className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-center w-11 h-11 bg-primary-100 rounded-xl">
            <Eye className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-center justify-center w-11 h-11 bg-primary-100 rounded-xl">
            <Bone className="w-5 h-5 text-primary-600" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Medical Image Analysis
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Upload medical images for instant classification using deep learning models.
          Visualize model decisions with Grad-CAM explanations.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 rounded-md font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            EfficientNet-V2
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 rounded-md font-medium">
            Grad-CAM
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 rounded-md font-medium">
            Real-time
          </span>
        </div>
      </div>
    </section>
  );
}