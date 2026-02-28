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

  const handleStart = () => {
    onStart(selectedModel);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Learn Mode
        </h1>
        <p className="text-gray-600">
          Practice diagnosing medical images with instant feedback
        </p>
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Select Scan Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modelOptions.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setSelectedModel(id)}
              className={clsx(
                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                selectedModel === id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
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

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
      >
        Start Learning
      </button>
    </div>
  );
}