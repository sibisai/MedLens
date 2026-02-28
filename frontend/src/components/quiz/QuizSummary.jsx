import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, RotateCcw, BarChart3, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizSummary({ answers, onRestart }) {
  const stats = useMemo(() => {
    const correct = answers.filter(a => a.correct).length;
    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, total, percentage };
  }, [answers]);

  // Confetti only (save is handled in LearnPage)
  useEffect(() => {
    if (stats.percentage >= 80) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1570EF', '#2E90FA', '#53B1FD', '#84CAFF'],
      });
    }
  }, [stats.percentage]);

  const getMessage = () => {
    if (stats.percentage >= 90) return { text: 'Excellent!', emoji: '🎉' };
    if (stats.percentage >= 80) return { text: 'Great job!', emoji: '👏' };
    if (stats.percentage >= 70) return { text: 'Good work!', emoji: '👍' };
    if (stats.percentage >= 60) return { text: 'Keep practicing!', emoji: '💪' };
    return { text: 'Room to improve', emoji: '📚' };
  };

  const message = getMessage();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-4">
          <Trophy className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Session Complete!
        </h1>
        <p className="text-lg text-gray-600">
          {message.emoji} {message.text}
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.percentage}%</div>
            <div className="text-sm text-gray-500">Accuracy</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{stats.correct}/{stats.total}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
        </div>
      </div>

      {/* Perfect Score Message */}
      {stats.percentage === 100 && (
        <div className="bg-success-50 border border-success-100 rounded-xl p-6 mb-6 text-center">
          <CheckCircle className="w-8 h-8 text-success-500 mx-auto mb-2" />
          <p className="text-success-700 font-medium">Perfect score! All answers correct!</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          New Session
        </button>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}