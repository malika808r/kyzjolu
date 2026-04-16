import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/store';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [useDemoMode, setUseDemoMode] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault(); // ЭТО САМОЕ ВАЖНОЕ! Останавливает перезагрузку страницы
  
  // Вызываем функцию из store
  const result = await login(email, password); 
  
  if (result.success) {
    navigate('/app'); // Перекидываем в приложение
  } else {
    alert("Ошибка входа: " + result.error);
  }
};

    

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{t('auth.login')}</h1>
        <p className="text-sm text-slate-700 font-bold">{t('auth.loginDescription')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          <input
            type="email" required placeholder={t('auth.email')}
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          <input
            type="password" required placeholder={t('auth.password')}
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>

      

        <button
          type="submit" disabled={loading}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50 mt-4 shadow-[0_4px_20px_rgba(236,72,153,0.3)] font-black"
        >
          {loading ? t('common.loading') : t('auth.loginButton')}
        </button>
      </form>

      <p className="text-center text-sm text-slate-800 mt-6 font-black uppercase tracking-wide">
        {t('auth.dontHaveAccount')}{' '}
        <Link to="/auth/register" className="text-pink-600 hover:underline">
          {t('auth.register')}
        </Link>
      </p>
    </div>
  );
}