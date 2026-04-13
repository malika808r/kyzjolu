import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/store';
import i18nConfig from '../i18n/config';

const PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&q=80',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&q=80',
];

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const [wordIndex, setWordIndex] = useState(0);
  const animatedWords = t('welcomeHero.animatedWords', { returnObjects: true }) || ['Безопасность', 'Умная карта', 'Комьюнити', 'Обучение'];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    const langs = ['ru', 'en', 'ky'];
    const next = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(next);
    i18nConfig.changeLanguage(next);
  };

  // Настройка пружинистой анимации для сборки мозаики
  const springAnim = { type: "spring", stiffness: 100, damping: 15 };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FDFCFF] flex flex-col font-sans">

      {/* ── Ambient blobs ── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-pink-100 blur-[140px] opacity-60" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-lime-100 blur-[140px] opacity-50" />

      {/* ── HEADER ── */}
      <header className="relative z-50 shrink-0 w-full flex items-center justify-between px-8 md:px-16 py-5 border-b border-slate-100/70">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow border border-pink-100">
            <img src="/photo_2026-04-02_23-26-19.jpg" alt="logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-lg text-slate-800 tracking-tight">KyzJolu</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-slate-800 text-xs font-bold uppercase tracking-wide hover:border-pink-300 transition-colors"
          >
            <Globe size={14} className="text-pink-400" />
            {language}
          </button>
          <button
            onClick={() => navigate('/auth/login')}
            className="text-sm font-bold text-slate-800 hover:text-black transition-colors"
          >
            {t('welcomeHero.loginLink')}
          </button>
          <button
            onClick={() => navigate('/auth/register')}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-lime-500 text-white text-sm font-black rounded-full shadow-md shadow-pink-200/50 hover:opacity-90 active:scale-95 transition-all"
          >
            {t('welcomeHero.joinBtn')}
          </button>
        </motion.div>
      </header>

      {/* ── BODY: Split Layout ── */}
      <div className="relative z-10 flex-1 flex overflow-hidden">

        {/* LEFT COLUMN — Hero Text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 xl:px-24 py-10 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-2">
              {t('welcomeHero.title')}
            </h1>

            <div className="h-12 md:h-16 mb-6 overflow-hidden flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-3xl md:text-4xl xl:text-5xl font-black bg-gradient-to-r from-pink-500 to-lime-500 bg-clip-text text-transparent"
                >
                  {animatedWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="text-slate-800 text-base md:text-lg leading-relaxed max-w-lg mb-10 font-medium mt-2">
              {t('welcomeHero.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <motion.button
                onClick={() => navigate('/auth/register')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="h-14 px-8 rounded-full bg-gradient-to-r from-pink-500 via-emerald-500 to-lime-500 text-white text-base font-black shadow-xl shadow-pink-200/60 flex items-center gap-2 group hover:shadow-2xl hover:shadow-pink-200/70 transition-shadow"
              >
                {t('welcomeHero.joinBtn')}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN — Animated Photo mosaic */}
        <div className="hidden lg:flex w-[45%] xl:w-[50%] shrink-0 p-8 xl:p-12 items-center justify-center">
          <div className="relative w-full h-full max-h-[600px]">
            <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full h-full">

              {/* Левая большая картинка (Вылетает слева-сверху) */}
              <motion.div
                initial={{ opacity: 0, x: -80, y: -40 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ ...springAnim, delay: 0.2 }}
                className="row-span-2 rounded-[28px] overflow-hidden shadow-xl"
              >
                <img src={PHOTOS[0]} alt="" className="w-full h-full object-cover" />
              </motion.div>

              {/* Верхняя центральная (Вылетает сверху) */}
              <motion.div
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springAnim, delay: 0.3 }}
                className="rounded-[28px] overflow-hidden shadow-md"
              >
                <img src={PHOTOS[1]} alt="" className="w-full h-full object-cover" />
              </motion.div>

              {/* Верхняя правая (Вылетает справа-сверху) */}
              <motion.div
                initial={{ opacity: 0, x: 80, y: -40 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ ...springAnim, delay: 0.4 }}
                className="rounded-[28px] overflow-hidden shadow-md"
              >
                <img src={PHOTOS[2]} alt="" className="w-full h-full object-cover" />
              </motion.div>

              {/* Правая центральная (Вылетает справа) */}
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springAnim, delay: 0.5 }}
                className="rounded-[28px] overflow-hidden shadow-md"
              >
                <img src={PHOTOS[3]} alt="" className="w-full h-full object-cover" />
              </motion.div>

              {/* Нижняя левая средняя (Вылетает слева-снизу) */}
              <motion.div
                initial={{ opacity: 0, x: -80, y: 80 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ ...springAnim, delay: 0.6 }}
                className="col-span-2 rounded-[28px] overflow-hidden shadow-xl"
              >
                <img src={PHOTOS[4]} alt="" className="w-full h-full object-cover" />
              </motion.div>

              {/* Самая нижняя широкая (Вылетает строго снизу) */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springAnim, delay: 0.7 }}
                className="col-span-3 rounded-[28px] overflow-hidden shadow-md"
              >
                <img src={PHOTOS[5]} alt="" className="w-full h-full object-cover" />
              </motion.div>

            </div>
          </div>
        </div>

        {/* MOBILE: Анимированная лента для телефонов */}
        <div className="lg:hidden absolute bottom-[80px] left-0 right-0 flex gap-3 px-6 overflow-x-auto no-scrollbar pointer-events-none">
          {PHOTOS.slice(0, 4).map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springAnim, delay: 0.2 + i * 0.15 }}
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}