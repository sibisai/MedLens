// Dashboard data utilities and pre-seeded demo data

const STORAGE_KEY = 'medlens_quiz_history';

// Pre-seeded demo data for expo/demo purposes
const DEMO_DATA = [
  {
    date: "2026-02-25T09:15:00Z",
    total: 10,
    correct: 8,
    answers: [
      { model: "brain_tumor", label: "Glioma", correct: true },
      { model: "brain_tumor", label: "Meningioma", correct: true },
      { model: "brain_tumor", label: "Pituitary", correct: false },
      { model: "brain_tumor", label: "No Tumor", correct: true },
      { model: "pneumonia", label: "Normal", correct: true },
      { model: "pneumonia", label: "Pneumonia", correct: true },
      { model: "retinal_oct", label: "CNV", correct: false },
      { model: "retinal_oct", label: "DME", correct: true },
      { model: "bone_fracture", label: "Fractured", correct: true },
      { model: "bone_fracture", label: "Not Fractured", correct: true },
    ]
  },
  {
    date: "2026-02-25T14:30:00Z",
    total: 8,
    correct: 6,
    answers: [
      { model: "brain_tumor", label: "Glioma", correct: true },
      { model: "brain_tumor", label: "Meningioma", correct: false },
      { model: "pneumonia", label: "Pneumonia", correct: true },
      { model: "pneumonia", label: "Normal", correct: true },
      { model: "retinal_oct", label: "Drusen", correct: true },
      { model: "retinal_oct", label: "Normal", correct: false },
      { model: "bone_fracture", label: "Fractured", correct: true },
      { model: "bone_fracture", label: "Not Fractured", correct: true },
    ]
  },
  {
    date: "2026-02-26T10:00:00Z",
    total: 12,
    correct: 10,
    answers: [
      { model: "brain_tumor", label: "Glioma", correct: true },
      { model: "brain_tumor", label: "Meningioma", correct: true },
      { model: "brain_tumor", label: "Pituitary", correct: true },
      { model: "brain_tumor", label: "No Tumor", correct: true },
      { model: "pneumonia", label: "Normal", correct: true },
      { model: "pneumonia", label: "Pneumonia", correct: false },
      { model: "retinal_oct", label: "CNV", correct: true },
      { model: "retinal_oct", label: "DME", correct: true },
      { model: "retinal_oct", label: "Drusen", correct: false },
      { model: "retinal_oct", label: "Normal", correct: true },
      { model: "bone_fracture", label: "Fractured", correct: true },
      { model: "bone_fracture", label: "Not Fractured", correct: true },
    ]
  },
  {
    date: "2026-02-26T16:45:00Z",
    total: 10,
    correct: 9,
    answers: [
      { model: "brain_tumor", label: "Glioma", correct: true },
      { model: "brain_tumor", label: "Pituitary", correct: true },
      { model: "pneumonia", label: "Normal", correct: true },
      { model: "pneumonia", label: "Pneumonia", correct: true },
      { model: "retinal_oct", label: "CNV", correct: true },
      { model: "retinal_oct", label: "DME", correct: true },
      { model: "retinal_oct", label: "Drusen", correct: true },
      { model: "bone_fracture", label: "Fractured", correct: false },
      { model: "bone_fracture", label: "Not Fractured", correct: true },
      { model: "brain_tumor", label: "No Tumor", correct: true },
    ]
  },
  {
    date: "2026-02-27T11:20:00Z",
    total: 7,
    correct: 5,
    answers: [
      { model: "brain_tumor", label: "Meningioma", correct: true },
      { model: "brain_tumor", label: "Pituitary", correct: false },
      { model: "pneumonia", label: "Pneumonia", correct: true },
      { model: "retinal_oct", label: "CNV", correct: true },
      { model: "retinal_oct", label: "Drusen", correct: false },
      { model: "bone_fracture", label: "Fractured", correct: true },
      { model: "bone_fracture", label: "Not Fractured", correct: true },
    ]
  },
];

// Check if data exists
export function hasQuizHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return false;
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) && parsed.length > 0;
}

// Get quiz history
export function getQuizHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

// Seed demo data (only if empty)
export function seedDemoData() {
  if (!hasQuizHistory()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
    return true;
  }
  return false;
}

// Force seed demo data (overwrites existing)
export function resetToDemo() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
}

// Clear all data
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}

// Calculate dashboard stats
export function calculateStats() {
  const history = getQuizHistory();

  if (history.length === 0) {
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      accuracy: 0,
      sessionsCompleted: 0,
      byModel: {},
      byClass: {},
      recentSessions: [],
      weakAreas: [],
    };
  }

  // Flatten all answers
  const allAnswers = history.flatMap(session => session.answers);
  const totalAnswered = allAnswers.length;
  const totalCorrect = allAnswers.filter(a => a.correct).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // By model
  const byModel = {};
  allAnswers.forEach(answer => {
    if (!byModel[answer.model]) {
      byModel[answer.model] = { total: 0, correct: 0 };
    }
    byModel[answer.model].total++;
    if (answer.correct) byModel[answer.model].correct++;
  });

  // By class
  const byClass = {};
  allAnswers.forEach(answer => {
    const key = `${answer.model}_${answer.label}`;
    if (!byClass[key]) {
      byClass[key] = { model: answer.model, label: answer.label, total: 0, correct: 0 };
    }
    byClass[key].total++;
    if (answer.correct) byClass[key].correct++;
  });

  // Recent sessions (last 5)
  const recentSessions = history
    .slice(-5)
    .reverse()
    .map(session => ({
      date: session.date,
      total: session.total,
      correct: session.correct,
      accuracy: Math.round((session.correct / session.total) * 100),
    }));

  // Weak areas (classes with < 70% accuracy and at least 3 attempts)
  const weakAreas = Object.values(byClass)
    .filter(c => c.total >= 3 && (c.correct / c.total) < 0.7)
    .map(c => ({
      ...c,
      accuracy: Math.round((c.correct / c.total) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return {
    totalAnswered,
    totalCorrect,
    accuracy,
    sessionsCompleted: history.length,
    byModel,
    byClass,
    recentSessions,
    weakAreas,
  };
}

// Model display names
export const MODEL_NAMES = {
  brain_tumor: 'Brain MRI',
  pneumonia: 'Chest X-Ray',
  retinal_oct: 'Retinal OCT',
  bone_fracture: 'Bone X-Ray',
};

// Model colors for charts
export const MODEL_COLORS = {
  brain_tumor: '#8B5CF6',
  pneumonia: '#3B82F6',
  retinal_oct: '#10B981',
  bone_fracture: '#F59E0B',
};