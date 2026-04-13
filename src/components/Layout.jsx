import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Home, Map, MessageCircle, User, BookOpen, LifeBuoy, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { path: "/app/map",     icon: Map,           labelKey: 'nav.map' },
  { path: "/app/hub",     icon: BookOpen,      labelKey: 'education.hubTitle' },
  { path: "/app/chats",   icon: MessageCircle, labelKey: 'nav.chats' },
  { path: "/app/profile", icon: User,          labelKey: 'nav.profile' },
];

function Sidebar({ expanded, onToggle }) {
  const location = useLocation();
  const { t } = useTranslation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ======== DESKTOP SIDEBAR ======== */}
      <motion.aside
        animate={{ width: expanded ? 220 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-full border-r border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-40 shrink-0 overflow-hidden"
      >
        {/* Logo area + toggle */}
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800 w-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-pink-100 shrink-0">
            <img src="/photo_2026-04-02_23-26-19.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-black text-[15px] bg-gradient-to-r from-pink-500 to-lime-500 bg-clip-text text-transparent whitespace-nowrap"
            >
              KyzJolu
            </motion.span>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className={`ml-auto shrink-0 text-slate-700 group-hover:text-pink-600 transition-colors ${!expanded && 'hidden'} font-black`}
          >
            <ChevronRight size={16} />
          </motion.div>
        </button>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <div
                  title={!expanded ? t(item.labelKey) : undefined}
                  className={`flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${expanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                    ${active
                      ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-white shadow-md shadow-pink-200/40'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-pink-50 dark:hover:bg-slate-800 hover:text-pink-600 font-bold'
                    }
                  `}
                >
                  <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} className="shrink-0" />
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 }}
                      className="text-sm font-bold whitespace-nowrap"
                    >
                      {t(item.labelKey, item.labelKey)}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-slate-100 dark:border-slate-800"
          >
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest">© 2025 KyzJolu</p>
          </motion.div>
        )}
      </motion.aside>

      {/* ======== MOBILE BOTTOM BAR ======== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex justify-around items-center px-2 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 min-w-[52px]">
              <div className={`p-2 rounded-[14px] transition-all duration-200 ${
                active ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'
              }`}>
                <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wide ${active ? 'text-pink-600' : 'text-slate-800 dark:text-slate-200'}`}>
                {t(item.labelKey, item.labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

const Layout = () => {
  const [expanded, setExpanded] = useState(false); // иконки по умолчанию

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#F7F8FC] dark:bg-slate-950 font-sans transition-colors duration-300">

      <Sidebar expanded={expanded} onToggle={() => setExpanded(v => !v)} />

      <main className="flex-1 overflow-y-auto pb-[80px] md:pb-0 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;