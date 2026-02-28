import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';

function formatClassName(name) {
  const formatMap = {
    'notumor': 'No Tumor',
    'glioma': 'Glioma',
    'meningioma': 'Meningioma',
    'pituitary': 'Pituitary',
    'normal': 'Normal',
    'pneumonia': 'Pneumonia',
    'cnv': 'CNV',
    'dme': 'DME',
    'drusen': 'Drusen',
    'fractured': 'Fractured',
    'not fractured': 'Not Fractured',
  };
  return formatMap[name.toLowerCase()] || name;
}

export default function QuizFeedback({ question, userAnswer, isCorrect, explanation, onNext }) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Pre-cached overlay path
  const overlayPath = `/samples/overlays/${question.model}_${question.id}.png`;

  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#1570EF', '#2E90FA', '#53B1FD'],
        disableForReducedMotion: true,
      });
    }

    const timer = setTimeout(() => setShowExplanation(true), 300);
    return () => clearTimeout(timer);
  }, [isCorrect]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Result Banner */}
      <div className={clsx(
        'flex items-center gap-3 p-4 rounded-xl mb-6',
        isCorrect ? 'bg-success-50' : 'bg-red-50'
      )}>
        {isCorrect ? (
          <CheckCircle className="w-6 h-6 text-success-500 shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        )}
        <div>
          <p className={clsx(
            'font-semibold',
            isCorrect ? 'text-success-700' : 'text-red-700'
          )}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && (
            <p className="text-sm text-red-600">
              The correct answer is <span className="font-medium">{formatClassName(question.label)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Images - Original and Grad-CAM side by side */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-2 gap-px bg-gray-200">
          {/* Original */}
          <div className="bg-gray-900">
            <p className="text-xs font-medium text-gray-400 text-center py-2 bg-gray-800">Original</p>
            <div className="aspect-square flex items-center justify-center">
              <img
                src={question.path}
                alt="Original scan"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Grad-CAM Overlay - Now from pre-cached file */}
          <div className="bg-gray-900">
            <p className="text-xs font-medium text-gray-400 text-center py-2 bg-gray-800">Grad-CAM</p>
            <div className="aspect-square flex items-center justify-center">
              <img
                src={overlayPath}
                alt="Grad-CAM overlay"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="px-4 py-3 bg-gray-800 flex items-center justify-between">
          <span className="text-sm font-medium text-white">
            {formatClassName(question.label)}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Low</span>
            <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500" />
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && explanation && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-primary-900 mb-1">Explanation</h3>
              <p className="text-sm text-primary-800 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
      >
        Next Question
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}