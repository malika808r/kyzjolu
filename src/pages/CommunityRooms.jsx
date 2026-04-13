import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Home, Monitor, Dumbbell, CookingPot, Users, Bot, Sparkles } from 'lucide-react';

export default function CommunityRooms() {
  const { t } = useTranslation();

  const rooms = [
    {
      id: 'home',
      title: t('community.rooms.home.title'),
      description: t('community.rooms.home.description'),
      icon: Home,
      color: 'from-pink-400 to-rose-400',
      members: 124
    },
    {
      id: 'it',
      title: t('community.rooms.it.title'),
      description: t('community.rooms.it.description'),
      icon: Monitor,
      color: 'from-lime-400 to-emerald-400',
      members: 89
    },
    {
      id: 'sport',
      title: t('community.rooms.sport.title'),
      description: t('community.rooms.sport.description'),
      icon: CookingPot,
      color: 'from-pink-500 to-purple-500',
      members: 210
    },
    {
      id: 'food',
      title: t('community.rooms.food.title'),
      description: t('community.rooms.food.description'),
      icon: CookingPot,
      color: 'from-yellow-400 to-orange-400',
      members: 156
    }
  ];

  const BOT_DATA = {
    id: 'umai-bot',
    title: t('community.umaiBot.title'),
    description: t('community.umaiBot.description'),
    icon: Bot,
    color: 'from-indigo-600 to-purple-600',
    members: 'AI',
    isBot: true,
    link: 'https://t.me/UmAI_KyzJolu_bot'
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-slate-900 dark:to-slate-900 transition-colors p-4 md:p-8 overflow-y-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-lime-500 bg-clip-text text-transparent">{t('community.title')}</h1>
        <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 uppercase tracking-wider">{t('community.subtitle')}</p>
        
        {/* ЗАКРЕПЛЕННЫЙ БОТ */}
        <div className="mt-6">
          <a href={BOT_DATA.link} target="_blank" rel="noopener noreferrer" className="relative block group">
            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[11px] font-black px-3 py-1 rounded-full z-10 shadow-lg flex items-center gap-1.5 animate-bounce">
              <Sparkles size={12} /> {t('community.pinned')}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl border-2 border-indigo-500/20 dark:border-indigo-500/30 flex flex-col md:flex-row items-center gap-6 group-hover:border-indigo-500 transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${BOT_DATA.color} flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform shrink-0`}>
                <Bot size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1">{BOT_DATA.title}</h2>
                <p className="text-sm text-slate-800 dark:text-slate-300 font-bold mb-2">
                  {BOT_DATA.description}
                </p>
                <div className="inline-flex items-center text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                  Запустить в Telegram →
                </div>
              </div>
            </motion.div>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rooms.map((room, idx) => {
          const Icon = room.icon;
          return (
            <Link key={room.id} to={`/app/chats/${room.id}`} className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 dark:border-slate-700 flex flex-col h-full group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${room.color} flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{room.title}</h2>
                    <div className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 gap-1">
                      <Users size={14} /> {room.members} {t('community.membersCount')}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-300 flex-1 font-bold">
                  {room.description}
                </p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
