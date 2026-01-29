import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ModelSelector from './components/ModelSelector';
import SampleImages from './components/SampleImages';
import FileUploader from './components/FileUploader';
import AnalysisResults from './components/AnalysisResults';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import { useImageAnalysis } from './hooks/useImageAnalysis';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('brain_tumor');
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const { analyze, reset, isAnalyzing, result, error } = useImageAnalysis();

  // Reset selection when model changes
  useEffect(() => {
    setSelectedSample(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    reset();
  }, [selectedModel, reset]);

  // Handle sample image selection
  const handleSampleSelect = useCallback((sample) => {
    setSelectedSample(sample);
    setUploadedFile(null);
    setPreviewUrl(sample.path);
    reset();
  }, [reset]);

  // Handle file upload
  const handleFileSelect = useCallback((file) => {
    setUploadedFile(file);
    setSelectedSample(null);
    reset();
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Cleanup old URL
    return () => URL.revokeObjectURL(url);
  }, [reset]);

  // Clear selection
  const handleClear = useCallback(() => {
    setUploadedFile(null);
    setSelectedSample(null);
    setPreviewUrl(null);
    reset();
  }, [reset]);

  // Run analysis
  const handleAnalyze = useCallback(async () => {
    if (!previewUrl) return;

    let file = uploadedFile;

    // If using sample image, fetch it as a file
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Model Selection */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                1
              </span>
              <h3 className="text-lg font-semibold text-gray-900">Select Model</h3>
            </div>
            <ModelSelector
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
          </section>

          {/* Step 2: Image Selection */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                2
              </span>
              <h3 className="text-lg font-semibold text-gray-900">Select Image</h3>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {/* Sample Images */}
              <SampleImages
                model={selectedModel}
                selectedSample={selectedSample}
                onSelect={handleSampleSelect}
              />

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500">or upload your own</span>
                </div>
              </div>

              {/* File Uploader */}
              <FileUploader
                onFileSelect={handleFileSelect}
                selectedFile={uploadedFile}
                previewUrl={uploadedFile ? previewUrl : null}
                onClear={handleClear}
              />
            </div>
          </section>

          {/* Analyze Button */}
          {hasSelection && !result && !isAnalyzing && (
            <section className="mb-10">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Image
                <ArrowRight className="w-5 h-5" />
              </button>
            </section>
          )}

          {/* Step 3: Results */}
          {(isAnalyzing || result || error) && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                  3
                </span>
                <h3 className="text-lg font-semibold text-gray-900">Results</h3>
              </div>

              {isAnalyzing && (
                <LoadingState imageUrl={previewUrl} />
              )}

              {error && !isAnalyzing && (
                <ErrorMessage message={error} onRetry={handleAnalyze} />
              )}

              {result && !isAnalyzing && (
                <AnalysisResults result={result} originalImage={previewUrl} />
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
