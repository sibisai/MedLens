import { useState } from 'react';
import { Download, Info, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { id: 'original', label: 'Original' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'overlay', label: 'Overlay' },
];

// Format class names for display (e.g., "notumor" -> "No Tumor", "glioma" -> "Glioma")
function formatClassName(name) {
  const formatMap = {
    'notumor': 'No Tumor',
    'glioma': 'Glioma',
    'meningioma': 'Meningioma',
    'pituitary': 'Pituitary',
    'normal': 'Normal',
    'pneumonia': 'Pneumonia',
  };

  const lower = name.toLowerCase();
  if (formatMap[lower]) {
    return formatMap[lower];
  }

  // Fallback: capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function AnalysisResults({ result, originalImage }) {
  const [activeTab, setActiveTab] = useState('overlay');
  const [showGradcamInfo, setShowGradcamInfo] = useState(false);

  if (!result) return null;

  const { prediction, confidence, probabilities, images } = result;

  // Sort probabilities by value descending
  const sortedProbs = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a);

  const isPredictionCorrect = confidence > 0.7;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${images.overlay}`;
    link.download = `gradcam_${prediction}_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Prediction Header */}
      <div className={clsx(
        'px-6 py-4 border-b',
        isPredictionCorrect ? 'bg-success-50 border-success-100' : 'bg-warning-50 border-warning-100'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPredictionCorrect ? (
              <CheckCircle className="w-6 h-6 text-success-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-warning-500" />
            )}
            <div>
              <p className="text-sm text-gray-600">Prediction</p>
              <p className={clsx(
                'text-xl font-bold',
                isPredictionCorrect ? 'text-success-700' : 'text-warning-700'
              )}>
                {formatClassName(prediction)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Confidence</p>
            <p className={clsx(
              'text-xl font-bold',
              isPredictionCorrect ? 'text-success-700' : 'text-warning-700'
            )}>
              {(confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700">Grad-CAM Visualization</h4>
                <button
                  onClick={() => setShowGradcamInfo(!showGradcamInfo)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>

            {showGradcamInfo && (
              <div className="mb-3 p-3 bg-primary-50 rounded-lg text-xs text-primary-800">
                <strong>What is Grad-CAM?</strong> Gradient-weighted Class Activation Mapping highlights
                the regions of the image that most influenced the model's prediction.
                Warmer colors (red/yellow) indicate areas of higher importance.
              </div>
            )}

            {/* Image Tabs */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'flex-1 px-4 py-2.5 text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'text-primary-600 bg-white border-b-2 border-primary-500 -mb-px'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="aspect-square bg-gray-900 flex items-center justify-center">
                {activeTab === 'original' && originalImage ? (
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : images[activeTab] ? (
                  <img
                    src={`data:image/png;base64,${images[activeTab]}`}
                    alt={activeTab}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">Image not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Probabilities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Class Probabilities</h4>

            <div className="space-y-3">
              {sortedProbs.map(([className, prob], index) => {
                const percentage = (prob * 100).toFixed(1);
                const isPredicted = className.toLowerCase() === prediction.toLowerCase();
                const displayName = formatClassName(className);

                return (
                  <div key={className}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={clsx(
                        'text-sm font-medium',
                        isPredicted ? 'text-primary-700' : 'text-gray-700'
                      )}>
                        {displayName}
                        {isPredicted && (
                          <span className="ml-2 text-xs font-normal text-primary-500">
                            (Predicted)
                          </span>
                        )}
                      </span>
                      <span className={clsx(
                        'text-sm font-semibold',
                        isPredicted ? 'text-primary-700' : 'text-gray-600'
                      )}>
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all duration-500 ease-out',
                          isPredicted ? 'bg-primary-500' : 'bg-gray-300'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Model info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                Results generated using EfficientNet-V2-S architecture.
                This tool is for educational purposes only and should not be used for medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}