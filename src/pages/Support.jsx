import { Heart, Briefcase, Users, Building2, ChevronRight, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/store';

// Внутренний компонент карточки сервиса
const ServiceCard = ({ icon: Icon, title, description, color, iconBg, badge }) => (
  <button className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-[24px] p-4 flex items-start gap-4 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none active:scale-95 text-left">
    <div 
      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ backgroundColor: iconBg }}
    >
      <Icon size={24} color={color} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">{title}</h3>
        {badge && (
          <span className="bg-pink-100 text-pink-600 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">
            НОВОЕ
          </span>
        )}
      </div>
      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{description}</p>
    </div>
    <div className="flex items-center self-center text-slate-300 dark:text-slate-600">
      <ChevronRight size={20} />
    </div>
  </button>
);

export default function Support() {
  // Получаем текущего пользователя для аватарки
  const { user } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-full w-full rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-[#F5F3FF] to-[#FAF5FF] dark:from-slate-900 dark:via-lime-900/10 dark:to-slate-900 transition-colors duration-300">
        
      {/* Шапка */}
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold mb-1">{t('supportScreen.welcomeBack')}</p>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('supportScreen.title')}</h1>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-400 rounded-full flex items-center justify-center text-white font-bold shadow-md text-lg border-2 border-white dark:border-slate-800">
            {user?.user_metadata?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 font-medium">
          {t('supportScreen.subtitle')}
        </p>
      </div>

      {/* Сетка сервисов */}
      <div className="px-5 pb-8 space-y-4">
        
        <ServiceCard
          icon={Heart}
          title={t('supportScreen.psyHelp')}
          description={t('supportScreen.psyDesc')}
          color="#6366f1"
          iconBg={ 'rgba(99, 102, 241, 0.15)' }
        />

        <ServiceCard
          icon={Users}
          title={t('supportScreen.ngoHelp')}
          description={t('supportScreen.ngoDesc')}
          color="#6366f1"
          iconBg={ 'rgba(99, 102, 241, 0.15)' }
        />

      </div>

      {/* Быстрые действия */}
      <div className="px-5 pb-6">
        <div className="bg-white/70 dark:bg-slate-800/70 rounded-[24px] p-2 backdrop-blur-md border border-white dark:border-slate-700">
          <button className="w-full flex items-center justify-between text-left hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl p-3 transition-colors active:scale-95">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-lime-100 dark:bg-lime-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                <MessageCircle className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-[15px]">{t('supportScreen.urgentHelp')}</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{t('supportScreen.available247')}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}