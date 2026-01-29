export const sampleImages = {
  brain_tumor: [
    { id: 'glioma_1', label: 'Glioma', path: '/samples/brain_tumor/glioma_1.jpg' },
    { id: 'glioma_2', label: 'Glioma', path: '/samples/brain_tumor/glioma_2.jpg' },
    { id: 'meningioma_1', label: 'Meningioma', path: '/samples/brain_tumor/meningioma_1.jpg' },
    { id: 'meningioma_2', label: 'Meningioma', path: '/samples/brain_tumor/meningioma_2.jpg' },
    { id: 'pituitary_1', label: 'Pituitary', path: '/samples/brain_tumor/pituitary_1.jpg' },
    { id: 'pituitary_2', label: 'Pituitary', path: '/samples/brain_tumor/pituitary_2.jpg' },
    { id: 'notumor_1', label: 'No Tumor', path: '/samples/brain_tumor/notumor_1.jpg' },
    { id: 'notumor_2', label: 'No Tumor', path: '/samples/brain_tumor/notumor_2.jpg' },
  ],
  pneumonia: [
    { id: 'normal_1', label: 'Normal', path: '/samples/pneumonia/normal_1.jpg' },
    { id: 'normal_2', label: 'Normal', path: '/samples/pneumonia/normal_2.jpg' },
    { id: 'pneumonia_1', label: 'Pneumonia', path: '/samples/pneumonia/pneumonia_1.jpg' },
    { id: 'pneumonia_2', label: 'Pneumonia', path: '/samples/pneumonia/pneumonia_2.jpg' },
  ],
};

export const modelInfo = {
  brain_tumor: {
    name: 'Brain Tumor Classification',
    description: 'Classifies brain MRI scans into four categories: Glioma, Meningioma, Pituitary tumor, or No Tumor.',
    accuracy: '99%',
    classes: ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'],
    imageType: 'MRI Scan',
  },
  pneumonia: {
    name: 'Pneumonia Detection',
    description: 'Detects pneumonia from chest X-ray images with binary classification: Normal or Pneumonia.',
    accuracy: '88%',
    auc: '0.958',
    classes: ['Normal', 'Pneumonia'],
    imageType: 'Chest X-Ray',
  },
};
