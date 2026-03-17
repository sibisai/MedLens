const FORMAT_MAP = {
  'notumor': 'No Tumor',
  'glioma': 'Glioma',
  'meningioma': 'Meningioma',
  'pituitary': 'Pituitary',
  'normal': 'Normal',
  'pneumonia': 'Pneumonia',
  'cnv': 'CNV',
  'dme': 'DME',
  'drusen': 'Drusen',
  'fractured': 'Fractured',
  'not fractured': 'Not Fractured',
};

export default function formatClassName(name) {
  return FORMAT_MAP[name.toLowerCase()] || name.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}
