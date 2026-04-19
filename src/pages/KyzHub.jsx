import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Check, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useAppStore } from '../store/store';
import { useTranslation } from 'react-i18next';

// ── Категории и их стили ──────────────────────────────
const CATEGORY_STYLES = {
  'Кулинария':  { bg: 'from-amber-400 to-orange-400', tag: 'bg-amber-100 text-amber-700' },
  'IT/Кодинг':  { bg: 'from-lime-400 to-emerald-400', tag: 'bg-lime-100 text-lime-700' },
  'Спорт':      { bg: 'from-pink-400 to-rose-400',    tag: 'bg-pink-100 text-pink-700' },
  'Творчество': { bg: 'from-purple-400 to-violet-400', tag: 'bg-purple-100 text-purple-700' },
  'Волонтёрство': { bg: 'from-blue-400 to-indigo-400', tag: 'bg-blue-100 text-blue-700' },
};
const defaultStyle = { bg: 'from-slate-400 to-slate-500', tag: 'bg-slate-100 text-slate-600' };

// ── Локальные mock-данные (резерв если база пустая) ───
const MOCK_EVENTS = [
  {
    id: 'mock-1',
    title: 'Technologies That Work for You: How to Organize Your Life Through Apps and AI',
    category: 'IT/Кодинг',
    date: '2026-06-05',
    time: '18:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Modern technologies are powerful tools when used intentionally. This workshop helps you transform your devices from distraction sources into personal assistants.\n\nWhat we will cover:\n• Tools that actually help (planning, habit tracking, studying)\n• How to use AI for development, not just for cheating\n• Digital hygiene: how to stay focused, not just scroll\n• Balance: Online vs. Real life\n\nWorkshop practice:\n• Setting up 1–2 apps (planner or tracker)\n• Checklist "My useful digital habits"\n• Mini-case: how AI can help in studies and projects.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    id: 'mock-2',
    title: 'How Not to Burn Out in School and Social Media: Time Management Without Pressure',
    category: 'Творчество',
    date: '2026-06-10',
    time: '15:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Feeling overwhelmed by school and social media? You are not alone. This course is about managing your energy and attention in a high-pressure world.\n\nWhat we will cover:\n• Why "there is not enough time" — analyzing the real reasons (overload and defocus)\n• How social media affects attention and self-esteem\n• Simple planning systems (flexible, not rigid)\n• How to distribute energy, not just time\n\nWorkshop practice:\n• Analyzing your typical day\n• Creating a mini-plan for the week (study + rest)\n• The "3 priorities instead of 10 tasks" exercise.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  },
  {
    id: 'mock-3',
    title: 'Mobile App Design: From Idea to Interactive Prototype',
    category: 'IT/Кодинг',
    date: '2026-06-12',
    time: '18:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Ever had an idea for an app? Learn how to bring it to life! We will explore the basics of UI/UX design tailored for students.\n\nKey topics:\n• Understanding user needs\n• Creating wireframes and user flows\n• Intro to Figma: Designing your first screen\n• Prototyping interactions\n\nFinal goal: You will have a clickable prototype of your own app idea.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
  },
  {
    id: 'mock-4',
    title: 'Digital Art & Illustration: Finding Your Unique Style',
    category: 'Творчество',
    date: '2026-06-14',
    time: '12:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Unleash your creativity in the digital world. Whether you use an iPad or a graphics tablet, this course will help you find your artistic voice.\n\nModules:\n• Tools of the trade (Procreate/Photoshop)\n• Color theory and composition in digital art\n• Character design fundamentals\n• Building an online portfolio as a young artist\n\nIncludes a speed-painting session and personalized feedback.',
    image: 'https://images.unsplash.com/photo-1569144157591-c46755444ca1?w=800&q=80',
  },
  {
    id: 'mock-5',
    title: 'Self-Defense for Girls: Confidence and Awareness Training',
    category: 'Спорт',
    date: '2026-06-16',
    time: '10:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Safety starts with confidence. This practical course combines physical techniques with mental preparedness.\n\nFocus areas:\n• Situational awareness: How to avoid danger professionally\n• Basic escape techniques and physical boundaries\n• Verbal self-defense and assertive communication\n• Building a "safety mindset" in the urban environment\n\nLed by certified instructors in a supportive environment.',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80',
  },
  {
    id: 'mock-6',
    title: 'Yoga and Mindfulness for Academic Stress Relief',
    category: 'Спорт',
    date: '2026-06-18',
    time: '09:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Feeling the pressure of exams and deadlines? Take a breath. This course helps you reconnect with your body and calm your mind.\n\nPractice includes:\n• Gentle vinyasa flow for physical tension release\n• Practical breathing techniques for focus\n• Guided meditation for stress reduction\n• Creating a sustainable "self-care" routine at home\n\nNo prior experience required.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  },
  {
    id: 'mock-7',
    title: 'Social Impact 101: How to Launch Your Own Grassroots Project',
    category: 'Волонтёрство',
    date: '2026-06-20',
    time: '14:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Do you want to see change in your community? Learn how to make it happen. From identifying problems to implementing solutions.\n\nWhat we will cover:\n• Social entrepreneurship vs. volunteering\n• Grant writing basics for beginners\n• Recruiting and leading a volunteer team\n• Measuring your impact\n\nA practical guide to starting something that matters.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  },
  {
    id: 'mock-8',
    title: 'Public Speaking for Future Leaders: Pitching Your Ideas',
    category: 'Волонтёрство',
    date: '2026-06-22',
    time: '16:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Become a powerful communicator. This workshop is designed to help you overcome stage fright and speak with confidence.\n\nKey skills:\n• Structuring a persuasive speech\n• Body language and vocal variety\n• Storytelling techniques for social causes\n• Handling Q&A with poise\n\nEvery participant will give a 2-minute "pitch" for a cause they believe in.',
    image: 'https://images.unsplash.com/photo-1505373633132-ba7d7303cebb?w=800&q=80',
  },
  {
    id: 'mock-9',
    title: 'Healthy & Fast: Meal Prepping for a Busy School Week',
    category: 'Кулинария',
    date: '2026-06-24',
    time: '11:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Stop relying on snacks and learn how to fuel your brain! This course teaches you how to prep delicious, healthy meals in under 2 hours for the whole week.\n\nHighlights:\n• Smart grocery shopping on a student budget\n• 5 core recipes with multiple variations\n• Storage tips to keep food fresh\n• Nutrition basics for energy and skin health\n\nIncludes a downloadable PDF recipe book.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
  },
  {
    id: 'mock-10',
    title: 'The Art of Pastry: Modern Desserts with Local Ingredients',
    category: 'Кулинария',
    date: '2026-06-26',
    time: '13:00',
    location: null,
    spots_total: null,
    participants_count: 0,
    is_online: true,
    contact_url: null,
    description: 'Take your baking to the next level by understanding contemporary techniques and the chemistry of ingredients.\n\nTopics:\n• Texture analysis: From crispy to fluffy\n• Working with local fruits and berries in modern ways\n• Plate styling and presentation aesthetics\n• Building your brand as a young pastry chef\n\nGreat for aspiring entrepreneurs in the food industry.',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80',
  },
];

export default function KyzHub() {
  const { t, i18n } = useTranslation();
  const { user } = useAppStore();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);

  const CATEGORIES = [
    { id: 'All', label: t('education.categories.all') },
    { id: 'IT/Кодинг', label: t('education.categories.coding') },
    { id: 'Спорт', label: t('education.categories.sport') },
    { id: 'Творчество', label: t('education.categories.craft') },
    { id: 'Кулинария', label: t('education.categories.cooking') },
    { id: 'Волонтёрство', label: t('education.categories.volunteer') }
  ];

  // ── Загрузка из Supabase ──────────────────────────
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) {
      // Combine database events with high-quality mock courses
      // We use a Map to prevent duplicate IDs if any exist
      const combined = [...data, ...MOCK_EVENTS];
      const uniqueEvents = Array.from(new Map(combined.map(item => [item.id, item])).values());
      setEvents(uniqueEvents);
    } else {
      setEvents(MOCK_EVENTS);
    }
    setLoading(false);
  };

  // ── Загрузка своих регистраций ────────────────────
  useEffect(() => {
    if (!user) return;
    const loadRegistrations = async () => {
      const { data } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id);
      if (data) setRegisteredIds(new Set(data.map(r => r.event_id)));
    };
    loadRegistrations();
  }, [user]);

  // ── Регистрация / отмена ──────────────────────────
  const handleRegister = async (event) => {
    if (!user) return;

    // Если есть внешняя ссылка — открываем её
    if (event.contact_url) {
      window.open(event.contact_url, '_blank');
      return;
    }

    const alreadyRegistered = registeredIds.has(event.id);

    // Оптимистичный UI
    setRegisteredIds(prev => {
      const next = new Set(prev);
      alreadyRegistered ? next.delete(event.id) : next.add(event.id);
      return next;
    });

    if (alreadyRegistered) {
      await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('event_registrations')
        .insert([{ event_id: event.id, user_id: user.id }]);
    }
  };

  // ── Фильтрация ────────────────────────────────────
  const filtered = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  // ── Форматирование даты ───────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'ky' ? 'ky-KG' : 'en-US', { day: 'numeric', month: 'long' });
  };

  const spotsLeft = (e) => (e.spots_total || 50) - (e.participants_count || 0);

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-pink-50 to-lime-50 dark:from-slate-900 dark:to-slate-900 transition-colors p-4 md:p-8 pb-32">

      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-lime-500 bg-clip-text text-transparent">
          {t('education.hubTitle')}
        </h1>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 font-bold">
          {t('education.hubSubtitle')}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl whitespace-nowrap text-sm font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-pink-600 font-bold'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Лоадер */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-pink-400" size={36} />
        </div>
      )}

      {/* Карточки событий */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event, idx) => {
            const style = CATEGORY_STYLES[event.category] || defaultStyle;
            const isRegistered = registeredIds.has(event.id);
            const left = spotsLeft(event);
            const isExpanded = expandedId === event.id;
            const hasExternalLink = !!event.contact_url;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                {/* Обложка */}
                <div className="h-44 w-full relative overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${style.bg}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Категория */}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${style.tag}`}>
                    {event.category}
                  </span>
                  {/* Онлайн бейдж */}
                  {event.is_online && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-[9px] font-black text-slate-600 uppercase">
                      🌐 {t('education.online')}
                    </span>
                  )}
                </div>

                {/* Контент */}
                <div className="p-5">
                  <h3 className="font-black text-lg text-slate-800 dark:text-white mb-1 leading-tight">
                    {event.title}
                  </h3>

                  {/* Детали */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center text-xs text-slate-800 dark:text-slate-200 font-bold gap-2">
                      <Calendar size={13} className="text-lime-500 shrink-0" />
                      <span>{formatDate(event.date)}</span>
                      {event.time && <><Clock size={13} className="text-lime-500 ml-1 shrink-0" /><span>{event.time}</span></>}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-xs text-slate-800 dark:text-slate-200 font-bold">
                        <MapPin size={13} className="text-lime-500 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.spots_total > 0 && (
                      <div className="flex items-center text-xs font-bold gap-2">
                        <Users size={13} className={left <= 5 ? 'text-red-400' : 'text-lime-500'} />
                        <span className={left <= 5 ? 'text-red-500' : 'text-slate-900 dark:text-slate-200 font-black'}>
                          {left > 0 ? `${t('education.spotsLeft')}: ${left}` : t('education.noSpots')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Описание (раскрываемое) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                          {event.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {event.description && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : event.id)}
                      className="text-xs font-bold text-pink-500 mb-4 hover:text-pink-600 transition-colors"
                    >
                      {isExpanded ? `↑ ${t('education.collapse')}` : `↓ ${t('education.readMore')}`}
                    </button>
                  )}

                  {/* Кнопка записи */}
                  <button
                    onClick={() => handleRegister(event)}
                    disabled={!user || (left <= 0 && !hasExternalLink && !isRegistered)}
                    className={`w-full py-3 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isRegistered && !hasExternalLink
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold'
                        : left <= 0 && !hasExternalLink
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-lime-500 text-white hover:opacity-90 shadow-md'
                    }`}
                  >
                    {hasExternalLink ? (
                      <><ExternalLink size={16} /> {t('education.apply')}</>
                    ) : isRegistered ? (
                      <><Check size={16} /> {t('education.registered')}</>
                    ) : left <= 0 ? (
                      t('education.noSpots')
                    ) : (
                      t('education.enroll')
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-700 dark:text-slate-300 font-black">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-bold">{t('education.noEvents')}</p>
              <p className="text-sm mt-1">{t('education.tryAnother')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
