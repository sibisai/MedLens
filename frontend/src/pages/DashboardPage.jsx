import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Target, CheckCircle, HelpCircle,
  AlertTriangle, RotateCcw, GraduationCap, Info, Layers
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  calculateStats, seedDemoData, resetToDemo,
  hasQuizHistory, MODEL_NAMES, MODEL_COLORS
} from '../utils/dashboardData';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const seeded = seedDemoData();
    setIsDemo(seeded || !hasQuizHistory());
    setStats(calculateStats());
  }, []);

  const refreshStats = () => {
    setStats(calculateStats());
  };

  const handleReset = () => {
    if (confirm('Reset all progress and load demo data?')) {
      resetToDemo();
      setIsDemo(true);
      refreshStats();
    }
  };

  const modelChartData = useMemo(() => {
    if (!stats?.byModel) return [];
    return Object.entries(stats.byModel).map(([model, data]) => ({
      name: MODEL_NAMES[model] || model,
      model,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
    }));
  }, [stats]);

  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-xl">
                <BarChart3 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Track your learning progress</p>
              </div>
            </div>

            <Link
              to="/learn"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Practice
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        {isDemo && (
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-sm text-blue-800 flex-1">
              Showing sample data for demonstration. Complete quizzes in Learn Mode to see your real progress.
            </p>
          </div>
        )}

        {/* Stats Overview - Consistent styling */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-100 rounded-lg">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.accuracy}%</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Correct</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCorrect}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Answered</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalAnswered}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-100 rounded-lg">
                <Layers className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Sessions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.sessionsCompleted}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Accuracy by Model Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Accuracy by Model</h2>
            {modelChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Accuracy']}
                      contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                      {modelChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MODEL_COLORS[entry.model] || '#6B7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data yet
              </div>
            )}
          </div>

          {/* Weak Areas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Areas to Improve</h2>
            {stats.weakAreas.length > 0 ? (
              <div className="space-y-3">
                {stats.weakAreas.map((area) => (
                  <div
                    key={`${area.model}_${area.label}`}
                    className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{area.label}</p>
                      <p className="text-xs text-gray-500">{MODEL_NAMES[area.model]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-600">{area.accuracy}%</p>
                      <p className="text-xs text-gray-500">{area.correct}/{area.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-500">
                <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-xl mb-3">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">No weak areas identified</p>
                <p className="text-xs text-gray-400 mt-1">Keep practicing to maintain your skills</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Sessions</h2>
          {stats.recentSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 pb-3">Date</th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3">Questions</th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3">Correct</th>
                    <th className="text-right text-xs font-medium text-gray-500 pb-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSessions.map((session, index) => (
                    <tr key={index} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 text-sm text-gray-900">
                        {new Date(session.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="py-3 text-sm text-gray-600 text-center">{session.total}</td>
                      <td className="py-3 text-sm text-gray-600 text-center">{session.correct}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${session.accuracy >= 80
                          ? 'bg-success-100 text-success-700'
                          : session.accuracy >= 60
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                          }`}>
                          {session.accuracy}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="text-sm">No sessions completed yet</p>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}