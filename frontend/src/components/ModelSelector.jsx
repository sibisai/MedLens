import { Brain, Stethoscope } from 'lucide-react';
import clsx from 'clsx';
import { modelInfo } from '../utils/sampleData';

export default function ModelSelector({ selectedModel, onSelect }) {
  const models = [
    {
      id: 'brain_tumor',
      icon: Brain,
      ...modelInfo.brain_tumor,
    },
    {
      id: 'pneumonia',
      icon: Stethoscope,
      ...modelInfo.pneumonia,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {models.map((model) => {
        const Icon = model.icon;
        const isSelected = selectedModel === model.id;

        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={clsx(
              'relative p-5 rounded-xl border-2 text-left transition-all duration-200',
              isSelected
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}

            <div className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
              isSelected ? 'bg-primary-500' : 'bg-gray-100'
            )}>
              <Icon className={clsx('w-5 h-5', isSelected ? 'text-white' : 'text-gray-600')} />
            </div>

            <h3 className={clsx(
              'font-semibold mb-1',
              isSelected ? 'text-primary-900' : 'text-gray-900'
            )}>
              {model.name}
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              {model.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className={clsx(
                'text-xs font-medium px-2 py-1 rounded-full',
                isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              )}>
                {model.accuracy} Accuracy
              </span>
              {model.auc && (
                <span className={clsx(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {model.auc} AUC
                </span>
              )}
              <span className={clsx(
                'text-xs font-medium px-2 py-1 rounded-full',
                isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              )}>
                {model.imageType}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
