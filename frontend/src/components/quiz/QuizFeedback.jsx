import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import formatClassName from '../../utils/formatClassName';

export default function QuizFeedback({ question, userAnswer, isCorrect, explanation, onNext }) {
  const [showExplanation, setShowExplanation] = useState(false);

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
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className={clsx(
        'flex items-center gap-3 p-4 rounded-xl mb-6 shadow-card',
        isCorrect ? 'bg-success-50 border border-success-100' : 'bg-error-50 border border-error-100'
      )}>
        {isCorrect ? (
          <CheckCircle className="w-6 h-6 text-success-500 shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-error-500 shrink-0" />
        )}
        <div>
          <p className={clsx(
            'font-semibold font-display',
            isCorrect ? 'text-success-700' : 'text-error-700'
          )}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && (
            <p className="text-sm text-error-500">
              The correct answer is <span className="font-medium">{formatClassName(question.label)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden mb-6">
        <div className="grid grid-cols-2 gap-px bg-gray-200">
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

      {showExplanation && explanation && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Explanation</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200"
      >
        Next Question
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
