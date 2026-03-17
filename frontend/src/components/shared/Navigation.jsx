import { Link, useLocation } from 'react-router-dom';
import { Activity, Microscope, GraduationCap, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/analyze', label: 'Analyze', icon: Microscope },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-gradient">
              <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-sm sm:text-lg font-semibold font-display text-gray-900">
              MedLens
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive
                    ? 'bg-primary-50/80 text-primary-700 border border-primary-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
