import { useState } from 'react';
import clsx from 'clsx';
import { modelInfo } from '../../utils/sampleData';
import formatClassName from '../../utils/formatClassName';

export default function QuizCard({ question, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = modelInfo[question.model]?.classes || [];

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };

  const model = modelInfo[question.model];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          {model?.name || question.model}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden mb-6">
        <div className="aspect-square sm:aspect-[4/3] bg-gray-900 flex items-center justify-center">
          <img
            src={question.path}
            alt="Medical scan"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold font-display text-gray-900 text-center mb-6">
        What is your diagnosis?
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={clsx(
              'p-4 rounded-xl border-2 font-medium transition-all duration-200',
              selectedOption === option
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-card'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:-translate-y-0.5'
            )}
          >
            {formatClassName(option)}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption}
        className={clsx(
          'w-full py-4 rounded-xl font-semibold transition-all duration-200',
          selectedOption
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        Submit Answer
      </button>
    </div>
  );
}
