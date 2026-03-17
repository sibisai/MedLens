import { Brain, Stethoscope, Eye, Bone, Check } from 'lucide-react';
import clsx from 'clsx';
import { modelInfo } from '../utils/sampleData';

const MODEL_ICONS = { brain_tumor: Brain, pneumonia: Stethoscope, retinal_oct: Eye, bone_fracture: Bone };

export default function ModelSelector({ selectedModel, onSelect }) {
  const models = Object.entries(MODEL_ICONS).map(([id, icon]) => ({
    id,
    icon,
    ...modelInfo[id],
  }));

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
                ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20 shadow-card-hover'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-card hover:-translate-y-0.5'
            )}
          >
            {isSelected && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              </div>
            )}

            <div className={clsx(
              'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
              isSelected ? 'bg-brand-gradient text-white' : 'bg-gray-100'
            )}>
              <Icon className={clsx('w-6 h-6', isSelected ? 'text-white' : 'text-gray-600')} />
            </div>

            <h3 className={clsx(
              'font-semibold font-display text-lg mb-2',
              isSelected ? 'text-primary-900' : 'text-gray-900'
            )}>
              {model.name}
            </h3>

            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              {model.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                `${model.accuracy} Accuracy`,
                model.auc && `${model.auc} AUC`,
                model.imageType,
              ].filter(Boolean).map(text => (
                <span key={text} className={clsx(
                  'text-xs font-medium px-3 py-1.5 rounded-full',
                  isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {text}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
