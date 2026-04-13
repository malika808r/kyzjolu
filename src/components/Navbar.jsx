import { Link, useLocation } from "react-router-dom";
import { Home, Map, MessageCircle, User, BookOpen, LifeBuoy } from "lucide-react"; 
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/app/feed", icon: Home, label: t('nav.feed') },
    { path: "/app/map", icon: Map, label: t('nav.map') },
    { path: "/app/eduhub", icon: BookOpen, label: t('nav.eduhub') },
    { path: "/app/chats", icon: MessageCircle, label: t('nav.chats') },
    { path: "/app/profile", icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 px-1 py-3 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] dark:shadow-none flex justify-around items-center max-w-5xl mx-auto overflow-x-auto transition-colors duration-300">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          className="flex flex-col items-center gap-1 min-w-[55px]"
        >
          <div className={`p-1.5 rounded-[16px] transition-all duration-300 ${isActive(item.path) ? 'bg-pink-500 text-white shadow-md' : 'text-slate-700 hover:bg-pink-50 dark:hover:bg-slate-700 hover:text-pink-600 dark:text-slate-300 dark:hover:text-pink-400'}`}>
            <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
          </div>
          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wide transition-colors ${isActive(item.path) ? 'text-pink-600' : 'text-slate-800 dark:text-slate-200'}`}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}