import { Brain, Stethoscope, Eye, Bone } from 'lucide-react';
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
    {
      id: 'retinal_oct',
      icon: Eye,
      ...modelInfo.retinal_oct,
    },
    {
      id: 'bone_fracture',
      icon: Bone,
      ...modelInfo.bone_fracture,
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
              'relative p-6 rounded-xl border-2 text-left transition-all duration-200',
              isSelected
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            )}
          >
            {isSelected && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}

            {/* Icon */}
            <div className={clsx(
              'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
              isSelected ? 'bg-primary-500' : 'bg-gray-100'
            )}>
              <Icon className={clsx('w-6 h-6', isSelected ? 'text-white' : 'text-gray-600')} />
            </div>

            {/* Title */}
            <h3 className={clsx(
              'font-semibold text-lg mb-2',
              isSelected ? 'text-primary-900' : 'text-gray-900'
            )}>
              {model.name}
            </h3>

            {/* Description - full text, no truncation */}
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              {model.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={clsx(
                'text-xs font-medium px-3 py-1.5 rounded-full',
                isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              )}>
                {model.accuracy} Accuracy
              </span>
              {model.auc && (
                <span className={clsx(
                  'text-xs font-medium px-3 py-1.5 rounded-full',
                  isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {model.auc} AUC
                </span>
              )}
              <span className={clsx(
                'text-xs font-medium px-3 py-1.5 rounded-full',
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