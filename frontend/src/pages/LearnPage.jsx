import { useState, useCallback, useMemo } from 'react';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizCard from '../components/quiz/QuizCard';
import QuizFeedback from '../components/quiz/QuizFeedback';
import QuizSummary from '../components/quiz/QuizSummary';
import { sampleImages, modelInfo, cachedExplanations } from '../utils/sampleData';

const STATES = {
  SETUP: 'setup',
  ACTIVE: 'active',
  FEEDBACK: 'feedback',
  SUMMARY: 'summary',
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getAllQuestions(modelFilter) {
  let allSamples = [];

  const models = modelFilter === 'all'
    ? Object.keys(sampleImages)
    : [modelFilter];

  models.forEach(model => {
    const samples = sampleImages[model] || [];
    samples.forEach(sample => {
      allSamples.push({
        ...sample,
        model,
        modelInfo: modelInfo[model],
      });
    });
  });

  return shuffleArray(allSamples);
}

// Save results to localStorage
function saveSession(answers) {
  const existing = JSON.parse(localStorage.getItem('medlens_quiz_history') || '[]');
  const session = {
    date: new Date().toISOString(),
    total: answers.length,
    correct: answers.filter(a => a.correct).length,
    answers: answers.map(a => ({
      model: a.question.model,
      label: a.question.label,
      correct: a.correct,
    })),
  };
  existing.push(session);
  localStorage.setItem('medlens_quiz_history', JSON.stringify(existing));
}

export default function LearnPage() {
  const [quizState, setQuizState] = useState(STATES.SETUP);
  const [selectedModel, setSelectedModel] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const currentQuestion = questions[currentIndex];

  const handleStart = useCallback((model) => {
    const quizQuestions = getAllQuestions(model);
    setSelectedModel(model);
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setUserAnswer(null);
    setSessionStats({ correct: 0, total: 0 });
    setQuizState(STATES.ACTIVE);
  }, []);

  const handleAnswer = useCallback((answer) => {
    setUserAnswer(answer);

    const isCorrect = answer.toLowerCase() === currentQuestion.label.toLowerCase();

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      question: currentQuestion,
      userAnswer: answer,
      correctAnswer: currentQuestion.label,
      correct: isCorrect,
    }]);

    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setQuizState(STATES.FEEDBACK);
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setQuestions(shuffleArray([...questions]));
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
    setUserAnswer(null);
    setQuizState(STATES.ACTIVE);
  }, [currentIndex, questions]);

  // End session and save results HERE (only runs once)
  const handleEndSession = useCallback(() => {
    if (answers.length > 0) {
      saveSession(answers);
    }
    setQuizState(STATES.SUMMARY);
  }, [answers]);

  const handleRestart = useCallback(() => {
    setQuizState(STATES.SETUP);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setUserAnswer(null);
    setSessionStats({ correct: 0, total: 0 });
  }, []);

  const getExplanation = useCallback(() => {
    if (!currentQuestion) return null;
    const key = `${currentQuestion.model}_${currentQuestion.id}`;
    return cachedExplanations[key] || null;
  }, [currentQuestion]);

  const showQuizHeader = quizState === STATES.ACTIVE || quizState === STATES.FEEDBACK;

  return (
    <div className="flex-1 bg-gray-50">
      {/* Sub-header - Only during active quiz */}
      {showQuizHeader && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="text-sm text-gray-600">
                {sessionStats.correct}/{sessionStats.total} correct
              </div>

              <button
                onClick={handleEndSession}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                End Session
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${((currentIndex + (quizState === STATES.FEEDBACK ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quizState === STATES.SETUP && (
          <QuizSetup onStart={handleStart} />
        )}

        {quizState === STATES.ACTIVE && currentQuestion && (
          <QuizCard
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}

        {quizState === STATES.FEEDBACK && currentQuestion && (
          <QuizFeedback
            question={currentQuestion}
            userAnswer={userAnswer}
            isCorrect={userAnswer?.toLowerCase() === currentQuestion.label.toLowerCase()}
            explanation={getExplanation()}
            onNext={handleNext}
          />
        )}

        {quizState === STATES.SUMMARY && (
          <QuizSummary
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}