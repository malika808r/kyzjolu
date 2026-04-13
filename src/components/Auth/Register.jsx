import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/store';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    const result = await register(
      formData.email, 
      formData.password, 
      formData.firstName, 
      formData.lastName
    );

    if (result.success) {
      navigate('/app'); // Успех! Переходим в ленту
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{t('auth.registerButton')}</h1>
        <p className="text-sm text-slate-700 font-bold">{t('auth.registerDescription')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input
              type="text" name="firstName" placeholder={t('auth.firstName')} required
              value={formData.firstName} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative flex-1">
            <input
              type="text" name="lastName" placeholder={t('auth.lastName')}
              value={formData.lastName} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input
            type="email" name="email" placeholder={t('auth.email')} required
            value={formData.email} onChange={handleChange}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input
            type="password" name="password" placeholder={t('auth.password')} required
            value={formData.password} onChange={handleChange}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input
            type="password" name="confirmPassword" placeholder={t('auth.confirmPassword')} required
            value={formData.confirmPassword} onChange={handleChange}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50 mt-4 shadow-[0_4px_20px_rgba(236,72,153,0.3)]"
        >
          {loading ? t('common.loading') : t('auth.registerButton')}
        </button>
      </form>

      <p className="text-center text-sm text-slate-800 mt-6 font-black uppercase tracking-wide">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to="/auth/login" className="text-pink-600 hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </div>
  );
}