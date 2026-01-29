import { useState, useCallback } from 'react';
import { analyzeImage } from '../utils/api';

export function useImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (modelName, imageFile) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeImage(modelName, imageFile);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyze,
    reset,
    isAnalyzing,
    result,
    error,
  };
}
