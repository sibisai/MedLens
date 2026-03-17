import { useState, useEffect, useCallback, useRef } from 'react';
import ModelSelector from '../components/ModelSelector';
import SampleImages from '../components/SampleImages';
import FileUploader from '../components/FileUploader';
import AnalysisResults from '../components/AnalysisResults';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { ArrowRight, Brain, Stethoscope, Eye, Bone } from 'lucide-react';

const modelIcons = [
  { id: 'brain_tumor', icon: Brain, label: 'Brain Tumor' },
  { id: 'pneumonia', icon: Stethoscope, label: 'Pneumonia' },
  { id: 'retinal_oct', icon: Eye, label: 'Retinal OCT' },
  { id: 'bone_fracture', icon: Bone, label: 'Bone Fracture' },
];

function StepBadge({ number, connector = false }) {
  return (
    <div className="relative flex flex-col items-center">
      <span className="flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 text-sm font-bold rounded-full border-2 border-amber-200">
        {number}
      </span>
      {connector && <div className="w-0.5 h-8 bg-gray-200 mt-2 hidden sm:block" />}
    </div>
  );
}

export default function AnalyzePage() {
  const [selectedModel, setSelectedModel] = useState('brain_tumor');
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const resultsRef = useRef(null);

  const { analyze, reset, isAnalyzing, isExplaining, result, explanation, error } = useImageAnalysis();

  useEffect(() => {
    setSelectedSample(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    reset();
  }, [selectedModel, reset]);

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const handleModelSelect = useCallback((modelId) => {
    setSelectedModel(modelId);
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleSampleSelect = useCallback((sample) => {
    setSelectedSample(sample);
    setUploadedFile(null);
    setPreviewUrl(sample.path);
    reset();
    setTimeout(() => {
      step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [reset]);

  const handleFileSelect = useCallback((file) => {
    setUploadedFile(file);
    setSelectedSample(null);
    reset();

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setTimeout(() => {
      step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => URL.revokeObjectURL(url);
  }, [reset]);

  const handleClear = useCallback(() => {
    setUploadedFile(null);
    setSelectedSample(null);
    setPreviewUrl(null);
    reset();
  }, [reset]);

  const handleAnalyze = useCallback(async () => {
    if (!previewUrl) return;

    let file = uploadedFile;

    if (selectedSample && !uploadedFile) {
      try {
        const response = await fetch(selectedSample.path);
        const blob = await response.blob();
        file = new File([blob], `${selectedSample.id}.jpg`, { type: 'image/jpeg' });
      } catch (err) {
        console.error('Failed to load sample image:', err);
        return;
      }
    }

    if (file) {
      await analyze(selectedModel, file);
    }
  }, [previewUrl, uploadedFile, selectedSample, selectedModel, analyze]);

  const hasSelection = selectedSample || uploadedFile;

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-gray-50 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-3 mb-6">
            {modelIcons.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleModelSelect(id)}
                title={label}
                className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${selectedModel === id
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                  }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
            AI-Powered Medical Image Analysis
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload medical images for instant classification with visual and written explanations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Model Selection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <StepBadge number={1} connector />
              <h3 className="text-lg font-semibold font-display text-gray-900">Select Model</h3>
            </div>
            <ModelSelector
              selectedModel={selectedModel}
              onSelect={handleModelSelect}
            />
          </section>

          {/* Step 2: Image Selection */}
          <section ref={step2Ref} className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <StepBadge number={2} connector />
              <h3 className="text-lg font-semibold font-display text-gray-900">Select Image</h3>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
              <FileUploader
                onFileSelect={handleFileSelect}
                selectedFile={uploadedFile}
                previewUrl={uploadedFile ? previewUrl : null}
                onClear={handleClear}
              />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500">or try a sample image</span>
                </div>
              </div>

              <SampleImages
                model={selectedModel}
                selectedSample={selectedSample}
                onSelect={handleSampleSelect}
              />
            </div>
          </section>

          {/* Step 3: Analyze Button / Results */}
          <section ref={step3Ref} className="scroll-mt-20">
            {/* Analyze Button */}
            {hasSelection && !result && !isAnalyzing && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <StepBadge number={3} />
                  <h3 className="text-lg font-semibold font-display text-gray-900">Analyze</h3>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Image
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Results */}
            {(isAnalyzing || result || error) && (
              <div ref={resultsRef} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <StepBadge number={3} />
                  <h3 className="text-lg font-semibold font-display text-gray-900">Results</h3>
                </div>

                {isAnalyzing && (
                  <LoadingState imageUrl={previewUrl} />
                )}

                {error && !isAnalyzing && (
                  <ErrorMessage message={error} onRetry={handleAnalyze} />
                )}

                {result && !isAnalyzing && (
                  <AnalysisResults
                    result={result}
                    originalImage={previewUrl}
                    selectedModel={selectedModel}
                    isExplaining={isExplaining}
                    explanation={explanation}
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
