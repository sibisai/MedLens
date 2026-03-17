import { useState } from 'react';
import { GraduationCap, Brain, Stethoscope, Eye, Bone, Layers } from 'lucide-react';
import clsx from 'clsx';

const modelOptions = [
  { id: 'all', label: 'All Models', icon: Layers, description: 'Mix of all scan types' },
  { id: 'brain_tumor', label: 'Brain MRI', icon: Brain, description: '4 classes' },
  { id: 'pneumonia', label: 'Chest X-Ray', icon: Stethoscope, description: '2 classes' },
  { id: 'retinal_oct', label: 'Retinal OCT', icon: Eye, description: '4 classes' },
  { id: 'bone_fracture', label: 'Bone X-Ray', icon: Bone, description: '2 classes' },
];

export default function QuizSetup({ onStart }) {
  const [selectedModel, setSelectedModel] = useState('all');

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 bg-brand-gradient">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 mb-2">
          Learn Mode
        </h1>
        <p className="text-gray-600">
          Practice diagnosing medical images with instant feedback
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Select Scan Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modelOptions.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setSelectedModel(id)}
              className={clsx(
                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                selectedModel === id
                  ? 'border-primary-500 bg-primary-50/50 shadow-card'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:-translate-y-0.5'
              )}
            >
              <div className={clsx(
                'flex items-center justify-center w-10 h-10 rounded-lg',
                selectedModel === id ? 'bg-primary-100' : 'bg-gray-100'
              )}>
                <Icon className={clsx(
                  'w-5 h-5',
                  selectedModel === id ? 'text-primary-600' : 'text-gray-500'
                )} />
              </div>
              <div>
                <div className={clsx(
                  'font-medium',
                  selectedModel === id ? 'text-primary-900' : 'text-gray-900'
                )}>
                  {label}
                </div>
                <div className="text-xs text-gray-500">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selectedModel)}
        className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-sm transition-all duration-200"
      >
        Start Learning
      </button>
    </div>
  );
}
