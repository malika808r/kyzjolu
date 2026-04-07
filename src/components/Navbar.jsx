import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/store';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { label: t('navigation.feed'), href: '/app/feed' },
    { label: t('navigation.findCompanion'), href: '/app/find-companion' },
    { label: t('navigation.chats'), href: '/app/chats' },
    { label: t('navigation.experts'), href: '/app/experts' },
    { label: t('navigation.education'), href: '/app/education' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <span>⚡</span>
            <span>{t('common.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                  <LanguageSelector />
                  
                  <Link
                    to="/app/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xl">{user.avatar || '👤'}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.firstName}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium text-sm"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <LanguageSelector />
                
                <Link
                  to="/auth/login"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  {t('auth.loginButton')}
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium"
                >
                  {t('auth.registerButton')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-3 px-4">
              {user ? (
                <>
                  <Link
                    to="/app/profile"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.profile')}
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-2 space-y-2">
                      <ThemeToggle />
                      <LanguageSelector />
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium"
                  >
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="block w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-center font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('auth.loginButton')}
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block w-full px-4 py-2 rounded-lg border border-primary text-primary text-center font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('auth.registerButton')}
                  </Link>
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-2 space-y-2">
                      <ThemeToggle />
                      <LanguageSelector />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}