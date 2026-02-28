import { useState } from 'react';
import clsx from 'clsx';
import { modelInfo } from '../../utils/sampleData';

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

export default function QuizCard({ question, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Get options in consistent order (as defined in modelInfo)
  const options = modelInfo[question.model]?.classes || [];

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };

  const model = modelInfo[question.model];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Model Badge */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          {model?.name || question.model}
        </span>
      </div>

      {/* Image */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="aspect-square sm:aspect-[4/3] bg-gray-900 flex items-center justify-center">
          <img
            src={question.path}
            alt="Medical scan"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
        What is your diagnosis?
      </h2>

      {/* Options - consistent order */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={clsx(
              'p-4 rounded-xl border-2 font-medium transition-all',
              selectedOption === option
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            {formatClassName(option)}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedOption}
        className={clsx(
          'w-full py-4 rounded-xl font-semibold transition-all',
          selectedOption
            ? 'bg-primary-600 hover:bg-primary-700 text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        Submit Answer
      </button>
    </div>
  );
}