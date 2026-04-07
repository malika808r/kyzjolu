import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/store';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [useDemoMode, setUseDemoMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (useDemoMode) {
      // Demo mode - вход без Supabase
      if (!email || !password) {
        setError('Пожалуйста, введите email и пароль');
        return;
      }
      
      const demoUserData = {
        id: Date.now().toString(),
        email,
        firstName: 'Demo',
        lastName: 'User',
        avatar: '👤',
        bio: 'Demo аккаунт',
      };
      
      const result = await login(email, password, demoUserData);
      if (result.success) {
        navigate('/app/feed');
      } else {
        setError(result.error || 'Ошибка входа');
      }
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/app/feed');
      } else {
        setError(result.error || t('auth.invalidCredentials'));
      }
    } catch (err) {
      setError(t('common.error') || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">KyzJolu</h1>
            <p className="text-muted-foreground">{t('auth.loginDescription')}</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={useDemoMode}
                  onChange={(e) => setUseDemoMode(e.target.checked)}
                />
                <span className="text-muted-foreground">Режим демо</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                {t('auth.forgotPassword')}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('auth.loginButton')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground text-sm">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t('auth.registerButton')}
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-xs text-muted-foreground mb-3">
              Проблемы с входом?
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>✓ Включите <strong>"Режим демо"</strong> выше для быстрого входа</p>
              <p>Или:</p>
              <p>1. Проверьте email подтверждение в Supabase</p>
              <p>2. Убедитесь, что email confirmation отключен</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
