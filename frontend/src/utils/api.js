const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeImage(modelName, imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(
    `${API_URL}/predict/${modelName}/gradcam?output_type=all`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Analysis failed: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`);
  
  if (!response.ok) {
    throw new Error('API is not available');
  }

  return response.json();
}

export async function getModels() {
  const response = await fetch(`${API_URL}/models`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }

  return response.json();
}

export function getGradcamImageUrl(modelName) {
  return `${API_URL}/predict/${modelName}/gradcam/image`;
}
